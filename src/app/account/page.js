import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { client } from "../../sanity/lib/client";
import {
  CUSTOMER_BY_ID_QUERY,
  ORDERS_BY_EMAIL_QUERY,
  POINTS_HISTORY_BY_CUSTOMER_QUERY,
} from "../../sanity/lib/queries";
import AccountPageClient from "../../components/account/AccountPageClient";

export const metadata = {
  title: "My Account | Vari",
};

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const customer = await client.fetch(
    CUSTOMER_BY_ID_QUERY,
    { id: session.user.id },
    { cache: "no-store" }
  );

  if (!customer) {
    redirect("/login");
  }

  const [orders, pointsHistory] = await Promise.all([
    client.fetch(
      ORDERS_BY_EMAIL_QUERY,
      { email: customer.email },
      { cache: "no-store" }
    ),
    client.fetch(
      POINTS_HISTORY_BY_CUSTOMER_QUERY,
      { customerId: customer._id },
      { cache: "no-store" }
    ),
  ]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f6f8f9] px-4 py-10 sm:px-6 md:py-14">
      <h1 className="mx-auto mb-8 max-w-[960px] text-3xl font-extrabold text-[#003349]">
        My Account
      </h1>

      <AccountPageClient
        customer={customer}
        orders={orders}
        pointsHistory={pointsHistory}
      />
    </div>
  );
}