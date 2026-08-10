"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function useLivePoints() {
  const { data: session } = useSession();
  const [points, setPoints] = useState(session?.user?.points ?? 0);

  useEffect(() => {
    if (!session?.user) return;

    fetch("/api/customer/points")
      .then((res) => res.json())
      .then((data) => setPoints(data.points))
      .catch(() => {});
  }, [session?.user]);

  return points;
}