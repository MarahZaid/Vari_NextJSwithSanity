import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import { writeClient } from "../../../sanity/lib/writeClient";

const POINTS_PER_DOLLAR = 100; // 100 points = $1 discount
const POINTS_EARN_RATE = 0.1; // earn 1 point per $0.10 spent → adjust as needed

export async function POST(request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { items, shippingAddress, phone, paymentMethod, pointsToRedeem = 0 } = body;

  if (!items?.length || !shippingAddress) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = subtotal > 0 && subtotal < 200 ? 15 : 0;

  const customerId = session.user.id;
  const customerDoc = await writeClient.getDocument(customerId);
  const pointsBalance = customerDoc?.points || 0;

  const safePointsToRedeem = Math.min(
    Math.max(0, Number(pointsToRedeem) || 0),
    pointsBalance,
    Math.floor((subtotal + shippingFee) * POINTS_PER_DOLLAR)
  );
  const pointsDiscount = safePointsToRedeem / POINTS_PER_DOLLAR;
  const totalAmount = Math.max(subtotal + shippingFee - pointsDiscount, 0);
  const pointsEarned = Math.round(totalAmount * POINTS_EARN_RATE);

  const order = await writeClient.create({
    _type: "order",
    customer: { _type: "reference", _ref: customerId },
    customerName: session.user.name,
    customerEmail: session.user.email,
    items: items.map((i) => ({
      _type: "orderItem",
      _key: crypto.randomUUID(),
      productName: i.name,
      product: { _type: "reference", _ref: i.productId },
      color: i.color,
      price: i.price,
      quantity: i.quantity,
    })),
    status: "pending",
    subtotal,
    shippingFee,
    pointsRedeemed: safePointsToRedeem,
    pointsDiscount,
    totalAmount,
    paymentMethod,
    phone,
    shippingAddress,
    createdAt: new Date().toISOString(),
  });

  const newPointsBalance = pointsBalance - safePointsToRedeem + pointsEarned;
  await writeClient.patch(customerId).set({ points: newPointsBalance }).commit();

  if (safePointsToRedeem > 0) {
    await writeClient.create({
      _type: "pointsHistoryEntry",
      customer: { _type: "reference", _ref: customerId },
      amount: -safePointsToRedeem,
      type: "redeem",
      order: { _type: "reference", _ref: order._id },
      createdAt: new Date().toISOString(),
    });
  }
  if (pointsEarned > 0) {
    await writeClient.create({
      _type: "pointsHistoryEntry",
      customer: { _type: "reference", _ref: customerId },
      amount: pointsEarned,
      type: "order",
      order: { _type: "reference", _ref: order._id },
      createdAt: new Date().toISOString(),
    });
  }

  return NextResponse.json({ orderId: order._id }, { status: 201 });
}