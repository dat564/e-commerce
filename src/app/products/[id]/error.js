"use client";

import ProductErrorBoundary from "@/components/products/ProductErrorBoundary";

export default function ProductError({ error, reset }) {
  return <ProductErrorBoundary error={error} reset={reset} />;
}
