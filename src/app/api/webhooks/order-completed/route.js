import { NextResponse } from "next/server";
import { writeClient } from "../../../../sanity/lib/writeClient";

const POINTS_EARN_RATE = 0.1;
const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

export async function POST(request) {
  const providedSecret = request.nextUrl.searchParams.get("secret");

  if (!WEBHOOK_SECRET || providedSecret !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const order = await request.json();

  if (!order?._id || order.status !== "completed" || order.pointsAwarded) {
    return NextResponse.json({ skipped: true });
  }

  const customerId = order.customer?._ref;
  if (!customerId) {
    return NextResponse.json({ error: "No customer reference" }, { status: 400 });
  }

  const pointsEarned = Math.round((order.totalAmount || 0) * POINTS_EARN_RATE);

  if (pointsEarned > 0) {
    const customerDoc = await writeClient.getDocument(customerId);
    const currentPoints = customerDoc?.points || 0;

    await writeClient.patch(customerId).set({ points: currentPoints + pointsEarned }).commit();

    await writeClient.create({
      _type: "pointsHistoryEntry",
      customer: { _type: "reference", _ref: customerId },
      amount: pointsEarned,
      type: "order",
      order: { _type: "reference", _ref: order._id },
      createdAt: new Date().toISOString(),
    });
  }

  await writeClient.patch(order._id).set({ pointsAwarded: true }).commit();

  return NextResponse.json({ success: true, pointsEarned });
}