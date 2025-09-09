"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Leaf, Search, MapIcon, PlaySquare, Sprout } from "lucide-react"

// Import components
import { AuthScreens } from './components/auth/AuthScreens.jsx'
import { Marketplace } from './components/marketplace/Marketplace.jsx'
import { DeliveriesMap } from './components/deliveries/DeliveriesMap.jsx'
import { FarmerHub } from './components/farmer/FarmerHub.jsx'
import { LearnVideos } from './components/learn/LearnVideos.jsx'
import { RoleToggle, CartPill, TabBtn, CartDrawer } from './components/ui/UIComponents.jsx'
import { CartSummary } from './components/marketplace/CartSummary.jsx'

// Import constants and utilities
import { theme } from './constants/theme.js'
import { WAREHOUSE } from './constants/warehouse.js'
import { seedWithRandomPricesAndFarms } from './utils/seedData.js'
import { sumCartQty, visibleListings, computeTotals, randomNearby } from './utils/helpers.js'

// -------------------------------------------------------------
// Home Grown — React single-file prototype (green & white theme)
// Implements:
// - Auth flow (landing → sign in / sign up for Shopper or Farmer)
// - Shopper accounts can convert to Farmer via Farmer tab
// - Tabs order: Marketplace, Deliveries, Farmer, Learn (Videos)
// - Marketplace shows random price per unit + farm that grew it (6 items)
// - Deliveries Map uses MapLibre; waits for style load before drawing (fixes "Style is not done loading")
// - Farmer dashboard (Established vs Partner). Pending produce becomes visible only after pickup.
// - Cart drawer accessible from header pill; checkout places an order and opens Deliveries Map.
// - Added dev tests for pure helpers.
// -------------------------------------------------------------

// ---------- Root App ----------
export default function HomeGrownApp() {
  // Auth state
  const [auth, setAuth] = useState({ status: "entry", user: null })
  // UI role view (customer/farmer)
  const [role, setRole] = useState("customer") // 'customer' | 'farmer'
  const [tab, setTab] = useState("market") // 'market' | 'deliveries' | 'farmer' | 'learn'

  // Marketplace state
  const [listings, setListings] = useState(seedWithRandomPricesAndFarms())
  const [cart, setCart] = useState([]) // { listingId, qty }
  const [showCart, setShowCart] = useState(false)

  // Orders (customer deliveries)
  const [orders, setOrders] = useState([]) // {id, createdAt, items:[{title,unit,qty,pricePerUnit,farm}], statusIndex, driverPos, dropoffCoords}
  const [showOrderPopup, setShowOrderPopup] = useState(null)

  // Active pickups (warehouse → farm → warehouse)
  const [pickups, setPickups] = useState([]) // {id, listingId, farm, farmCoords:[lat,lng], driverPos:[lat,lng], phase:0|1}

  // Videos
  const [videos, setVideos] = useState([]) // { id, name, url, createdAt }

  // Farmer sub-tabs
  const [farmerTab, setFarmerTab] = useState("established") // 'established' | 'partner'

  const market = useMemo(() => visibleListings(listings), [listings])

  // ---- Cart helpers ----
  function addToCart(listing, qty) {
    if (!qty || qty <= 0) return
    setCart((prev) => {
      const existing = prev.find((c) => c.listingId === listing.id)
      const nextQty = (existing?.qty || 0) + qty
      const next = existing
        ? prev.map((c) => (c.listingId === listing.id ? { ...c, qty: nextQty } : c))
        : [...prev, { listingId: listing.id, qty: nextQty }]
      return next
    })
    setShowCart(true)
  }
  function removeFromCart(listingId) {
    setCart((prev) => prev.filter((c) => c.listingId !== listingId))
  }

  function placeOrder() {
    if (cart.length === 0) return

    const items = cart
      .map((c) => {
        const l = listings.find((x) => x.id === c.listingId)
        if (!l) return null
        return { title: l.title, unit: l.unit, pricePerUnit: l.pricePerUnit, qty: c.qty, farm: l.farm }
      })
      .filter(Boolean)

    const totals = computeTotals(items)

    const userDrop = auth.user?.location || randomNearby([33.52, -86.8])

    const newOrder = {
      id: `o_${Date.now()}`,
      createdAt: new Date().toISOString(),
      items,
      totals,
      statusIndex: 0, // Placed
      driverPos: WAREHOUSE.coords, // start at warehouse
      dropoffCoords: userDrop,
    }

    const nextListings = listings.map((l) => {
      const ci = cart.find((c) => c.listingId === l.id)
      if (!ci) return l
      return { ...l, availableQty: Math.max(0, l.availableQty - ci.qty) }
    })

    setListings(nextListings)
    setOrders((prev) => [newOrder, ...prev])
    setCart([])
    setShowOrderPopup(newOrder.id)
    setTab("deliveries")
  }

  // ---- Driver movement simulation (deliveries & pickups) ----
  useEffect(() => {
    const t = setInterval(() => {
      // Move delivery drivers (customer orders)
      setOrders((prev) =>
        prev.map((o) => {
          if (o.statusIndex >= 4) return o
          const start = o.driverPos || WAREHOUSE.coords
          const end = o.dropoffCoords
          const step = 0.0012
          const dx = end[0] - start[0]
          const dy = end[1] - start[1]
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 0.002) {
            return { ...o, driverPos: end, statusIndex: 4 } // Delivered
          }
          const nx = start[0] + (dx / dist) * step
          const ny = start[1] + (dy / dist) * step
          return { ...o, driverPos: [nx, ny], statusIndex: Math.max(o.statusIndex, 3) } // Out for Delivery
        }),
      )

      // Move pickup drivers (warehouse → farm → warehouse)
      setPickups((prev) => {
        const doneListings = []
        const next = prev
          .map((p) => {
            const target = p.phase === 0 ? p.farmCoords : WAREHOUSE.coords
            const start = p.driverPos || WAREHOUSE.coords
            const step = 0.0012
            const dx = target[0] - start[0]
            const dy = target[1] - start[1]
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 0.002) {
              if (p.phase === 0) {
                return { ...p, driverPos: target, phase: 1 } // reached farm, now go back
              } else {
                doneListings.push(p.listingId) // reached warehouse with pickup
                return { ...p, _done: true }
              }
            }
            const nx = start[0] + (dx / dist) * step
            const ny = start[1] + (dy / dist) * step
            return { ...p, driverPos: [nx, ny] }
          })
          .filter((p) => !p._done)
        if (doneListings.length) {
          // Mark picked up listings as available
          setListings((ls) => ls.map((l) => (doneListings.includes(l.id) ? { ...l, status: "available" } : l)))
        }
        return next
      })
    }, 1200)
    return () => clearInterval(t)
  }, [])

  // Expose pickup setter to children via context-like window shim (optional for this playground)
  useEffect(() => {
    window.__setPickups = setPickups
    return () => {
      delete window.__setPickups
    }
  }, [setPickups])

  // ---------- Auth gate ----------
  if (auth.status !== "app") {
    return <AuthScreens auth={auth} setAuth={setAuth} setRole={setRole} onAfterAuth={() => setTab("market")} />
  }

  return (
    <div className={`min-h-screen ${theme.brand.bg} ${theme.brand.text}`}>
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-2xl flex items-center justify-center bg-emerald-600 text-white shadow-sm">
                  <Leaf className="h-5 w-5" />
                </div>
                <div className="leading-tight">
                  <div className="font-extrabold text-xl tracking-tight">Home Grown</div>
                  <div className="text-xs text-emerald-700">Local farms → urban tables</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RoleToggle role={role} setRole={setRole} />
                <button onClick={() => setShowCart(true)} aria-label="Open cart">
                  <CartPill count={sumCartQty(cart)} />
                </button>
              </div>
            </div>

            {/* Tabs — order: Marketplace, Deliveries, Farmer, Learn */}
            <nav className="flex items-center gap-2">
              {auth.user?.isFarmer && (
                <TabBtn
                  icon={<Sprout className="h-4 w-4" />}
                  label="Farmer"
                  active={tab === "farmer"}
                  onClick={() => setTab("farmer")}
                />
              )}
              <TabBtn
                icon={<Search className="h-4 w-4" />}
                label="Marketplace"
                active={tab === "market"}
                onClick={() => setTab("market")}
              />
              <TabBtn
                icon={<MapIcon className="h-4 w-4" />}
                label="Deliveries Map"
                active={tab === "deliveries"}
                onClick={() => setTab("deliveries")}
              />
              <TabBtn
                icon={<PlaySquare className="h-4 w-4" />}
                label="Learn (Videos)"
                active={tab === "learn"}
                onClick={() => setTab("learn")}
              />
            </nav>
          </div>
        </div>
      </header>

      {/* Content by tab */}
      {tab === "market" && (
        <Marketplace
          listings={market}
          onAdd={(l, qty) => addToCart(l, qty)}
          cart={cart}
          onRemove={removeFromCart}
          onCheckout={() => {
            setShowCart(false)
            placeOrder()
          }}
        />
      )}

      {tab === "deliveries" && (
        <DeliveriesMap
          orders={orders}
          showOrderPopup={showOrderPopup}
          onClosePopup={() => setShowOrderPopup(null)}
          pickups={pickups}
        />
      )}

      {tab === "farmer" && (
        <FarmerHub
          auth={auth}
          setAuth={setAuth}
          farmerTab={farmerTab}
          setFarmerTab={setFarmerTab}
          listings={listings}
          setListings={setListings}
          orders={orders}
          setPickups={setPickups}
        />
      )}

      {tab === "learn" && <LearnVideos videos={videos} setVideos={setVideos} />}

      {/* Global Cart Drawer */}
      {showCart && (
        <CartDrawer onClose={() => setShowCart(false)}>
          <CartSummary
            listings={listings}
            cart={cart}
            onRemove={removeFromCart}
            onCheckout={() => {
              setShowCart(false)
              placeOrder()
            }}
          />
        </CartDrawer>
      )}

      <footer className="border-t py-6 text-sm text-emerald-700/80 mt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>© {new Date().getFullYear()} Home Grown — Healthy, local, accessible.</div>
        </div>
      </footer>
    </div>
  )
}
