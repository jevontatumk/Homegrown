import { theme } from '../../constants/theme.js'

export function Text({ label, value, onChange }) {
  return (
    <label className="block">
      <div className="mb-2 text-emerald-800 font-medium">{label}</div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 text-base rounded-xl border ${theme.brand.border} ${theme.brand.ring} focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400`}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </label>
  )
}

export function TextArea({ label, value, onChange }) {
  return (
    <label className="block">
      <div className="mb-2 text-emerald-800 font-medium">{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className={`w-full px-4 py-3 text-base rounded-xl border ${theme.brand.border} ${theme.brand.ring} focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 resize-none`}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </label>
  )
}

export function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <div className="mb-2 text-emerald-800 font-medium">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 text-base rounded-xl border ${theme.brand.border} ${theme.brand.ring} bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400`}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}

export function Number({ label, value, onChange, min = 0, max = 999999, step = 1, prefix }) {
  return (
    <label className="block">
      <div className="mb-2 text-emerald-800 font-medium">{label}</div>
      <div className="flex items-center gap-2">
        {prefix && <span className="text-emerald-800 font-medium">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className={`w-full px-4 py-3 text-base rounded-xl border ${theme.brand.border} ${theme.brand.ring} focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400`}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      </div>
    </label>
  )
}
