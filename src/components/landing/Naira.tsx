"use client";

import NumberFlow from "@number-flow/react";
import { useEffect, useState } from "react";

const format = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export function Naira({ value }: { value: number }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <span className="tabular-nums">{format.format(value)}</span>;
  return (
    <NumberFlow
      value={value}
      locales="en-NG"
      format={{ style: "currency", currency: "NGN", maximumFractionDigits: 0 }}
      className="tabular-nums"
    />
  );
}
