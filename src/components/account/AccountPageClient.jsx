"use client";

import { useState } from "react";
import AccountSidebar from "./AccountSidebar";
import ProfileTab from "./ProfileTab";
import OrdersTab from "./OrdersTab";
import PointsTab from "./PointsTab";

export default function AccountPageClient({
  customer: initialCustomer,
  orders,
  pointsHistory,
}) {
  const [customer, setCustomer] = useState(initialCustomer);
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="mx-auto flex max-w-[960px] flex-col gap-6 md:flex-row md:items-start">
      <AccountSidebar
        customer={customer}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="w-full flex-1 rounded-[18px] border border-black/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(0,51,73,0.04),0_8px_24px_rgba(0,51,73,0.06)] sm:p-8">
        {activeTab === "profile" && (
          <ProfileTab customer={customer} onUpdated={setCustomer} />
        )}
        {activeTab === "orders" && <OrdersTab orders={orders} />}
        {activeTab === "points" && (
          <PointsTab points={customer.points} history={pointsHistory} />
        )}
      </div>
    </div>
  );
}