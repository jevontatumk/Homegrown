import { useState } from "react"
import { currency } from '../../utils/helpers.js'

export function FarmerHub({ auth, setAuth, farmerTab, setFarmerTab, listings, setListings, orders, setPickups }) {
  const [newListing, setNewListing] = useState({
    title: "",
    type: "Vegetables",
    pricePerUnit: "",
    unit: "lb",
    availableQty: "",
    farm: auth.user?.name || "Your Farm",
  })

  const handleAddListing = () => {
    if (newListing.title && newListing.pricePerUnit && newListing.availableQty) {
      const listing = {
        id: Date.now(),
        title: newListing.title,
        type: newListing.type,
        pricePerUnit: Number.parseFloat(newListing.pricePerUnit),
        availableQty: Number.parseInt(newListing.availableQty),
        unit: newListing.unit,
        farm: auth.user?.name || "Your Farm",
        status: "pending",
        image: "/fresh-produce-display.png",
        pickupRequested: false,
      }

      setListings((prev) => [listing, ...prev])
      setNewListing({
        title: "",
        type: "Vegetables",
        pricePerUnit: "",
        unit: "lb",
        availableQty: "",
        farm: auth.user?.name || "Your Farm",
      })
    }
  }

  const handlePickup = (listing) => {
    const pickup = {
      id: Date.now(),
      listingId: listing.id,
      farm: listing.farm,
      farmCoords: [37.7749 + (Math.random() - 0.5) * 0.1, -122.4194 + (Math.random() - 0.5) * 0.1],
      driverPos: null,
      phase: 0,
    }
    setPickups((prev) => [...prev, pickup])
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-4 border-b border-emerald-200">
          {["dashboard", "listings", "orders"].map((t) => (
            <button
              key={t}
              onClick={() => setFarmerTab(t)}
              className={`px-4 py-3 font-medium capitalize ${
                farmerTab === t
                  ? "text-emerald-700 border-b-2 border-emerald-500"
                  : "text-emerald-600 hover:text-emerald-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {farmerTab === "dashboard" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-emerald-200 bg-white p-6">
            <h3 className="font-semibold text-lg mb-2">Total Listings</h3>
            <p className="text-3xl font-bold text-emerald-700">
              {listings.filter((l) => l.farm === auth.user?.name).length}
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-white p-6">
            <h3 className="font-semibold text-lg mb-2">Active Orders</h3>
            <p className="text-3xl font-bold text-emerald-700">{orders.length}</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-white p-6">
            <h3 className="font-semibold text-lg mb-2">Revenue</h3>
            <p className="text-3xl font-bold text-emerald-700">$0</p>
          </div>
        </div>
      )}

      {farmerTab === "listings" && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Your Listings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {listings
                .filter((l) => l.farm === auth.user?.name)
                .map((listing) => (
                  <div key={listing.id} className="rounded-2xl border border-emerald-200 bg-white p-4">
                    <div className="aspect-[16/9] overflow-hidden rounded-xl mb-3">
                      <img
                        src={listing.image || "/placeholder.svg"}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{listing.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          listing.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {listing.status}
                      </span>
                    </div>
                    <p className="text-sm text-emerald-700">{listing.type}</p>
                    <p className="font-bold text-emerald-900">
                      {currency(listing.pricePerUnit)} / {listing.unit}
                    </p>
                    <p className="text-xs text-emerald-700/70">{listing.availableQty} available</p>
                    <button
                      onClick={() => handlePickup(listing)}
                      className="mt-2 w-full px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm"
                      disabled={listing.status === "pending"}
                    >
                      {listing.status === "pending" ? "Pending Approval" : "Request Pickup"}
                    </button>
                  </div>
                ))}
            </div>
          </section>

          <aside>
            <div className="rounded-2xl border border-emerald-200 bg-white p-6">
              <h3 className="font-semibold text-lg mb-4">Add New Listing</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Product name"
                  value={newListing.title}
                  onChange={(e) => setNewListing((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <select
                  value={newListing.type}
                  onChange={(e) => setNewListing((prev) => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Herbs">Herbs</option>
                  <option value="Grains">Grains</option>
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Price"
                    value={newListing.pricePerUnit}
                    onChange={(e) => setNewListing((prev) => ({ ...prev, pricePerUnit: e.target.value }))}
                    className="px-3 py-2 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <select
                    value={newListing.unit}
                    onChange={(e) => setNewListing((prev) => ({ ...prev, unit: e.target.value }))}
                    className="px-3 py-2 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="lb">lb</option>
                    <option value="oz">oz</option>
                    <option value="bunch">bunch</option>
                    <option value="each">each</option>
                  </select>
                </div>
                <input
                  type="number"
                  placeholder="Available quantity"
                  value={newListing.availableQty}
                  onChange={(e) => setNewListing((prev) => ({ ...prev, availableQty: e.target.value }))}
                  className="w-full px-3 py-2 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button
                  onClick={handleAddListing}
                  className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium"
                >
                  Add Listing
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {farmerTab === "orders" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-emerald-700/80">
              No orders yet. Your products will appear here when customers place orders.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-emerald-200 bg-white p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Order #{order.id}</h3>
                    <span className="text-sm text-emerald-700/80">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-sm">
                        {item.title} - {item.qty} {item.unit} @ {currency(item.pricePerUnit)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  )
}
