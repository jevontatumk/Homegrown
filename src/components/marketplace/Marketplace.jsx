import { useState, useMemo } from "react"
import { CheckCircle2 } from "lucide-react"
import { theme } from '../../constants/theme.js'
import { currency } from '../../utils/helpers.js'
import { CartSummary } from './CartSummary.jsx'

export function Marketplace({ listings, onAdd, cart, onRemove, onCheckout }) {
  const [qty, setQty] = useState({}) // listingId -> qty
  const items = listings || []

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((l) => (
            <div
              key={l.id}
              className="rounded-2xl overflow-hidden border border-emerald-200 bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img src={l.image || "/placeholder.svg"} alt={l.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm text-emerald-700">{l.type}</div>
                    <div className="font-semibold text-lg">{l.title}</div>
                    <div className="text-xs text-emerald-700/80 mt-1">
                      Grown by: <span className="font-medium">{l.farm}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-900 font-bold">
                      {currency(l.pricePerUnit)} / {l.unit}
                    </div>
                    <div className="text-xs text-emerald-700/70">{l.availableQty} available</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="number"
                    min={1}
                    max={l.availableQty}
                    value={qty[l.id] ?? 1}
                    onChange={(e) => setQty({ ...qty, [l.id]: Number(e.target.value) })}
                    className={`w-24 px-3 py-2 rounded-xl border ${theme.brand.border} ${theme.brand.ring}`}
                  />
                  <button
                    disabled={l.availableQty <= 0}
                    onClick={() => onAdd(l, qty[l.id] ?? 1)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${theme.brand.primary} ${theme.brand.primaryHover} text-white shadow-sm disabled:opacity-60`}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sidebar: cart */}
      <aside className="lg:sticky lg:top-[100px] h-fit">
        <CartSummary listings={listings} cart={cart} onRemove={onRemove} onCheckout={onCheckout} />
      </aside>
    </main>
  )
}
