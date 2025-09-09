// Pure helper functions

export function sumCartQty(cart) {
  if (!Array.isArray(cart)) return 0
  return cart.reduce((n, it) => n + (Number(it?.qty) || 0), 0)
}

export function currency(n) {
  return (Number(n) || 0).toLocaleString(undefined, { style: "currency", currency: "USD" })
}

export function visibleListings(listings) {
  return (listings || []).filter((l) => l.status === "available")
}

export function randBetween(min, max) {
  return Math.random() * (max - min) + min
}

export function round2(n) {
  return Math.round(n * 100) / 100
}

export function randomNearby([lat, lng]) {
  return [lat + (Math.random() - 0.5) * 0.02, lng + (Math.random() - 0.5) * 0.02]
}

export function computeTotals(items) {
  const subtotal = (items || []).reduce((a, b) => a + (Number(b?.pricePerUnit) || 0) * (Number(b?.qty) || 0), 0)
  const customerMarkup = subtotal * 0.05 // fixed for customers
  const deliveryFee = 4 + 1.25 * 6 // demo fee
  const total = subtotal + customerMarkup + deliveryFee
  return { subtotal, customerMarkup, deliveryFee, total }
}
