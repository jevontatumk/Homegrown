import { useState } from "react"
import { Leaf } from "lucide-react"
import { theme } from '../../constants/theme.js'
import { WAREHOUSE } from '../../constants/warehouse.js'
import { randomNearby } from '../../utils/helpers.js'
import { Text, TextArea } from '../ui/FormComponents.jsx'

export function AuthScreens({ auth, setAuth, setRole, onAfterAuth }) {
  const [mode, setMode] = useState(auth.status) // 'entry' | 'signin' | 'signupShopper' | 'signupFarmer'

  function goApp(user) {
    setRole("customer")
    setAuth({ status: "app", user })
    onAfterAuth?.()
  }

  if (mode === "entry") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
        <div className="w-[92vw] max-w-md rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-9 w-9 rounded-2xl flex items-center justify-center bg-emerald-600 text-white shadow-sm">
              <Leaf className="h-5 w-5" />
            </div>
            <div className="font-extrabold text-xl text-emerald-900">Home Grown</div>
          </div>
          <p className="text-emerald-800 mb-4 text-sm leading-relaxed">
            Sign in or create an account to shop local produce or sell your harvest.
          </p>
          <div className="grid gap-2">
            <button
              onClick={() => setMode("signin")}
              className={`${theme.brand.primary} ${theme.brand.primaryHover} text-white px-4 py-2.5 rounded-xl font-medium shadow-sm transition-colors`}
            >
              Sign in
            </button>
            <button
              onClick={() => setMode("signupShopper")}
              className="px-4 py-2.5 rounded-xl border border-emerald-200 text-emerald-800 hover:bg-emerald-50 transition-colors font-medium"
            >
              Sign up as Shopper
            </button>
            <button
              onClick={() => setMode("signupFarmer")}
              className="px-4 py-2.5 rounded-xl border border-emerald-200 text-emerald-800 hover:bg-emerald-50 transition-colors font-medium"
            >
              Sign up as Farmer
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (mode === "signin") return <SignIn onBack={() => setMode("entry")} onSubmit={(user) => goApp(user)} />
  if (mode === "signupShopper")
    return <SignUpShopper onBack={() => setMode("entry")} onSubmit={(user) => goApp(user)} />
  if (mode === "signupFarmer") return <SignUpFarmer onBack={() => setMode("entry")} onSubmit={(user) => goApp(user)} />
  return null
}

function SignIn({ onBack, onSubmit }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
      <div className="w-[92vw] max-w-md rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
        <button onClick={onBack} className="text-sm text-emerald-700 underline">
          Back
        </button>
        <h2 className="mt-2 text-xl font-bold text-emerald-900">Sign in</h2>
        <div className="mt-4 space-y-3">
          <Text label="Email" value={email} onChange={setEmail} />
          <Text label="Password" value={password} onChange={setPassword} />
          <button
            onClick={() => onSubmit({ id: `u_${Date.now()}`, type: "shopper", isFarmer: false, email })}
            className={`${theme.brand.primary} ${theme.brand.primaryHover} text-white px-4 py-2 rounded-xl w-full`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

function SignUpShopper({ onBack, onSubmit }) {
  const [identifier, setIdentifier] = useState("") // email or phone
  const [password, setPassword] = useState("")
  const [useLocation, setUseLocation] = useState(true)

  async function getLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null)
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve([pos.coords.latitude, pos.coords.longitude]),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 5000 },
      )
    })
  }

  async function submit() {
    const loc = useLocation ? await getLocation() : null
    onSubmit({ id: `u_${Date.now()}`, type: "shopper", isFarmer: false, identifier, location: loc })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
      <div className="w-[92vw] max-w-md rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
        <button onClick={onBack} className="text-sm text-emerald-700 underline">
          Back
        </button>
        <h2 className="mt-2 text-xl font-bold text-emerald-900">Create shopper account</h2>
        <div className="mt-4 space-y-3">
          <Text label="Email or phone" value={identifier} onChange={setIdentifier} />
          <Text label="Password" value={password} onChange={setPassword} />
          <label className="flex items-center gap-2 text-sm text-emerald-800">
            <input type="checkbox" checked={useLocation} onChange={(e) => setUseLocation(e.target.checked)} />
            Enable location services for delivery
          </label>
          <button
            onClick={submit}
            className={`${theme.brand.primary} ${theme.brand.primaryHover} text-white px-4 py-2 rounded-xl w-full`}
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  )
}

function SignUpFarmer({ onBack, onSubmit }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [farmName, setFarmName] = useState("")
  const [address, setAddress] = useState("")
  const [about, setAbout] = useState("")
  const [photo, setPhoto] = useState(null)

  function onPhoto(e) {
    const f = e.target.files?.[0]
    if (!f) return
    setPhoto({ name: f.name, url: URL.createObjectURL(f) })
  }

  function submit() {
    const farmCoords = randomNearby(WAREHOUSE.coords)
    onSubmit({
      id: `u_${Date.now()}`,
      type: "farmer",
      isFarmer: true,
      email,
      farmProfile: { farmName, address, about, imageUrl: photo?.url || "", coords: farmCoords },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
      <div className="w-[92vw] max-w-md rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
        <button onClick={onBack} className="text-sm text-emerald-700 underline">
          Back
        </button>
        <h2 className="mt-2 text-xl font-bold text-emerald-900">Create farmer account</h2>
        <div className="mt-4 space-y-3">
          <Text label="Email" value={email} onChange={setEmail} />
          <Text label="Password" value={password} onChange={setPassword} />
          <Text label="Farm name" value={farmName} onChange={setFarmName} />
          <Text label="Address" value={address} onChange={setAddress} />
          <TextArea label="About your farm" value={about} onChange={setAbout} />
          <label className="block">
            <div className="mb-2 text-emerald-800 font-medium">Farm image</div>
            <input
              type="file"
              accept="image/*"
              onChange={onPhoto}
              className={`w-full px-4 py-3 text-base rounded-xl border ${theme.brand.border} ${theme.brand.ring} focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400`}
            />
          </label>
          {photo && (
            <div className="mt-2 rounded-2xl overflow-hidden border border-emerald-200">
              <img src={photo.url || "/placeholder.svg"} alt={photo.name} className="w-full object-cover max-h-60" />
            </div>
          )}
          <button
            onClick={submit}
            className={`${theme.brand.primary} ${theme.brand.primaryHover} text-white px-4 py-2 rounded-xl w-full`}
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  )
}
