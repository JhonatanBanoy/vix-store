"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentStatusRefresher({ enabled = false }) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) return undefined;

    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      if (attempts > 12) {
        clearInterval(timer);
        return;
      }
      router.refresh();
    }, 5000);

    return () => clearInterval(timer);
  }, [enabled, router]);

  return null;
}
