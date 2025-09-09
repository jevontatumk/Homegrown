import { ShoppingCart, Leaf, X } from "lucide-react"
import { theme } from '../../constants/theme.js'

export function RoleToggle({ role, setRole }) {
  return null
}

export function CartPill({ count = 0 }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
      <ShoppingCart className="h-4 w-4" />
      <span className="text-sm font-medium">{count} in cart</span>
    </div>
  )
}

export function TabBtn({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${active ? "bg-emerald-600 text-white border-emerald-600" : `${theme.brand.border} text-emerald-800 hover:bg-emerald-50`}`}
      aria-pressed={active}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  )
}

export function CartDrawer({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white border-l border-emerald-200 shadow-xl p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold">Your Cart</div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-emerald-50">
            <X className="h-5 w-5 text-emerald-800" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function RowKV({ k, v }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span>{k}</span>
      <span>{v}</span>
    </div>
  )
}


