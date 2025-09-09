import { useEffect, useRef } from "react"
import { Package2, X } from "lucide-react"
import { WAREHOUSE } from '../../constants/warehouse.js'

export function DeliveriesMap({ orders, showOrderPopup, onClosePopup, pickups = [] }) {
  const mapRef = useRef(null)
  const mapDiv = useRef(null)
  const mapLoadedRef = useRef(false)

  // init map and wait for style to load
  useEffect(() => {
    const ensureAssets = () => {
      return new Promise((resolve) => {
        const haveCss = document.querySelector('link[href*="maplibre-gl.css"]')
        if (!haveCss) {
          const link = document.createElement("link")
          link.rel = "stylesheet"
          link.href = "https://unpkg.com/maplibre-gl@3.6.1/dist/maplibre-gl.css"
          document.head.appendChild(link)
        }
        const afterWindowLoad = () => resolve()
        if (!window.maplibregl) {
          const s = document.createElement("script")
          s.src = "https://unpkg.com/maplibre-gl@3.6.1/dist/maplibre-gl.js"
          s.onload = () => {
            if (document.readyState === "complete") afterWindowLoad()
            else window.addEventListener("load", afterWindowLoad, { once: true })
          }
          document.body.appendChild(s)
        } else {
          if (document.readyState === "complete") afterWindowLoad()
          else window.addEventListener("load", afterWindowLoad, { once: true })
        }
      })
    }

    let destroyed = false
    ensureAssets().then(() => {
      if (destroyed || !mapDiv.current) return
      const maplibregl = window.maplibregl
      const map = new maplibregl.Map({
        container: mapDiv.current,
        style: "https://demotiles.maplibre.org/style.json",
        center: [WAREHOUSE.coords[1], WAREHOUSE.coords[0]],
        zoom: 12.1,
      })
      map.addControl(new maplibregl.NavigationControl({ showZoom: true }))
      map.on("load", () => {
        mapLoadedRef.current = true
      })
      mapRef.current = map
    })

    return () => {
      destroyed = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        mapLoadedRef.current = false
      }
    }
  }, [])

  // draw orders + pickups when style loaded
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const draw = () => {
      if (!map || !mapLoadedRef.current) return

      // Safely clear our sources/layers
      try {
        const style = map.getStyle()
        const sources = style?.sources ? Object.keys(style.sources) : []
        sources
          .filter((k) => k.startsWith("order-") || k.startsWith("pickup-") || k === "warehouse-src")
          .forEach((k) => {
            const layers = (style.layers || []).filter((l) => l.source === k)
            layers.forEach((l) => map.getLayer(l.id) && map.removeLayer(l.id))
            map.getSource(k) && map.removeSource(k)
          })
      } catch (e) {
        // style not ready; bail
        return
      }

      // Warehouse point
      const wsrc = {
        type: "FeatureCollection",
        features: [
          { type: "Feature", geometry: { type: "Point", coordinates: [WAREHOUSE.coords[1], WAREHOUSE.coords[0]] } },
        ],
      }
      map.addSource("warehouse-src", { type: "geojson", data: wsrc })
      map.addLayer({
        id: "warehouse-pt",
        type: "circle",
        source: "warehouse-src",
        paint: {
          "circle-radius": 7,
          "circle-color": "#065f46",
          "circle-stroke-color": "#10b981",
          "circle-stroke-width": 2,
        },
      })

      // Active pickups (warehouse ↔ farm)
      pickups.forEach((p) => {
        const srcId = `pickup-${p.id}`
        const line = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [WAREHOUSE.coords[1], WAREHOUSE.coords[0]],
                  [p.farmCoords[1], p.farmCoords[0]],
                ],
              },
            },
          ],
        }
        map.addSource(srcId, { type: "geojson", data: line })
        map.addLayer({
          id: `${srcId}-line`,
          type: "line",
          source: srcId,
          paint: { "line-color": "#2563eb", "line-width": 3, "line-opacity": 0.6, "line-dasharray": [2, 2] },
        })
        if (p.driverPos) {
          const dsrc = `${srcId}-driver`
          map.addSource(dsrc, {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                { type: "Feature", geometry: { type: "Point", coordinates: [p.driverPos[1], p.driverPos[0]] } },
              ],
            },
          })
          map.addLayer({
            id: `${dsrc}-pt`,
            type: "circle",
            source: dsrc,
            paint: {
              "circle-radius": 6,
              "circle-color": "#3b82f6",
              "circle-stroke-color": "#1e40af",
              "circle-stroke-width": 2,
            },
          })
        }
      })

      // Customer deliveries
      orders.forEach((o) => {
        const srcId = `order-${o.id}`
        const line = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [WAREHOUSE.coords[1], WAREHOUSE.coords[0]],
                  [o.dropoffCoords[1], o.dropoffCoords[0]],
                ],
              },
            },
          ],
        }
        map.addSource(srcId, { type: "geojson", data: line })
        map.addLayer({
          id: `${srcId}-line`,
          type: "line",
          source: srcId,
          paint: { "line-color": "#059669", "line-width": 4, "line-opacity": 0.7 },
        })

        if (o.driverPos) {
          const dsrc = `${srcId}-driver`
          map.addSource(dsrc, {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                { type: "Feature", geometry: { type: "Point", coordinates: [o.driverPos[1], o.driverPos[0]] } },
              ],
            },
          })
          map.addLayer({
            id: `${dsrc}-pt`,
            type: "circle",
            source: dsrc,
            paint: {
              "circle-radius": 7,
              "circle-color": "#22c55e",
              "circle-stroke-color": "#064e3b",
              "circle-stroke-width": 2,
            },
          })
        }
      })
    }

    if (!mapLoadedRef.current) {
      map.once("load", draw)
    } else {
      draw()
    }
  }, [orders, pickups])

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
      <section className="min-h-[540px]">
        <div className="rounded-2xl border border-emerald-200 bg-white shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">Live Deliveries</div>
            <div className="text-xs text-emerald-700/70">Origin: {WAREHOUSE.name}</div>
          </div>
          <div ref={mapDiv} className="w-full h-[560px] rounded-xl overflow-hidden border border-emerald-200" />
          <p className="mt-2 text-xs text-emerald-700/80">
            Demo: straight-line routes; marker moves once order/pickup is created.
          </p>
        </div>
      </section>

      <aside className="lg:sticky lg:top-[100px] h-fit">
        <div className="rounded-2xl border border-emerald-200 bg-white shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Package2 className="h-5 w-5 text-emerald-700" />
            <div className="font-semibold">Orders & Pickups</div>
          </div>
          {orders.length === 0 && pickups.length === 0 ? (
            <div className="text-sm text-emerald-700/80">No activity yet.</div>
          ) : (
            <div className="space-y-5">
              {pickups.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Active Pickups</div>
                  <div className="space-y-3">
                    {pickups.map((p) => (
                      <div key={p.id} className="rounded-xl border border-emerald-100 p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">Pickup #{p.id}</div>
                          <div className="text-xs text-emerald-700/80">
                            {p.phase === 0 ? "Heading to farm" : "Returning to warehouse"}
                          </div>
                        </div>
                        <div className="text-xs text-emerald-700/80 mt-1">Farm: {p.farm}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {orders.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Customer Deliveries</div>
                  <div className="space-y-3">
                    {orders.map((o) => (
                      <div key={o.id} className="rounded-xl border border-emerald-100 p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">Order #{o.id}</div>
                          <div className="text-xs text-emerald-700/80">{new Date(o.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="mt-2 text-sm space-y-1">
                          {o.items.map((it, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                              <span>
                                {it.title} · {it.qty} {it.unit} · Grown by {it.farm}
                              </span>
                              <span className="text-emerald-700/80">From: {WAREHOUSE.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Order placed popup */}
      {showOrderPopup && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={onClosePopup} />
          <div className="relative z-10 w-[92vw] max-w-md rounded-2xl bg-white border border-emerald-200 p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Order placed!</div>
              <button onClick={onClosePopup} className="p-1 rounded-lg hover:bg-emerald-50">
                <X className="h-5 w-5 text-emerald-800" />
              </button>
            </div>
            <p className="mt-2 text-sm text-emerald-800">
              We're routing your delivery from <b>{WAREHOUSE.name}</b>. Watch the driver on the map.
            </p>
          </div>
        </div>
      )}
    </main>
  )
}


