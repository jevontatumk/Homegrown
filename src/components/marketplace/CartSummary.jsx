import { useMemo } from "react"
import { CheckCircle2 } from "lucide-react"
import { theme } from '../../constants/theme.js'
import { currency } from '../../utils/helpers.js'
import { RowKV } from '../ui/UIComponents.jsx'

export function CartSummary({ listings, cart, onRemove, onCheckout }) {
  const details = useMemo(() => {
    const items = cart
      .map((c) => {
        const l = listings.find((x) => x.id === c.listingId)
        if (!l) return null
        const lineSubtotal = l.pricePerUnit * c.qty
        return { ...l, qty: c.qty, lineSubtotal }
      })
      .filter(Boolean)
    const subtotal = items.reduce((a, b) => a + b.lineSubtotal, 0)
    const customerMarkup = subtotal * 0.05
    const deliveryFee = 4 + 1.25 * 6
    const total = subtotal + customerMarkup + deliveryFee
    return { items, subtotal, customerMarkup, deliveryFee, total }
  }, [cart, listings])

  return (
    <div className="rounded-2xl border border-emerald-200 bg-white shadow-sm p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold">Your Cart</div>
        <div className="text-sm text-emerald-700/80">{details.items.length} items</div>
      </div>
      {details.items.length === 0 ? (
        <div className="text-sm text-emerald-700/80">Cart is empty.</div>
      ) : (
        <>
          <div className="space-y-3">
            {details.items.map((it) => (
              <div key={it.id} className="flex items-start justify-between gap-3 py-2 border-b border-emerald-100">
                <div>
                  <div className="font-medium">{it.title}</div>
                  <div className="text-xs text-emerald-700/80">
                    {it.qty} × {currency(it.pricePerUnit)} / {it.unit}
                  </div>
                  <div className="text-xs text-emerald-700/70">Grown by: {it.farm}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{currency(it.lineSubtotal)}</div>
                  <button onClick={() => onRemove(it.id)} className="text-xs text-emerald-700 underline">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <RowKV k="Subtotal" v={currency(details.subtotal)} />
            <RowKV k="Customer markup" v={currency(details.customerMarkup)} />
            <RowKV k="Delivery fee" v={currency(details.deliveryFee)} />
            <div className="h-px my-3 bg-emerald-100" />
            <RowKV k={<b>Total</b>} v={<b>{currency(details.total)}</b>} />
            <button
              onClick={onCheckout}
              className={`mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl ${theme.brand.primary} ${theme.brand.primaryHover} text-white shadow`}
            >
              <CheckCircle2 className="h-5 w-5" /> Place order
            </button>
          </div>
        </>
      )}
    </div>
  )
}
