# Home Grown - Local Farm Marketplace

A React-based marketplace connecting local farmers with urban consumers, featuring real-time delivery tracking and farmer management tools.

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── AuthScreens.jsx          # Authentication components (sign in/up)
│   ├── deliveries/
│   │   └── DeliveriesMap.jsx        # MapLibre-based delivery tracking
│   ├── farmer/
│   │   └── FarmerHub.jsx            # Farmer dashboard and listing management
│   ├── learn/
│   │   └── LearnVideos.jsx          # Video learning section
│   ├── marketplace/
│   │   ├── Marketplace.jsx          # Product listings and shopping
│   │   └── CartSummary.jsx          # Shopping cart component
│   └── ui/
│       ├── FormComponents.jsx       # Reusable form elements
│       └── UIComponents.jsx         # Common UI components
├── constants/
│   ├── theme.js                     # Design system and theme
│   ├── warehouse.js                 # Warehouse location data
│   ├── farms.js                     # Farm names
│   └── seedListings.js              # Sample product data
├── utils/
│   ├── helpers.js                   # Pure utility functions
│   └── seedData.js                  # Data generation utilities
├── App.jsx                          # Main application component
├── main.jsx                         # React entry point
└── index.css                        # Global styles
```

## Features

### For Shoppers
- Browse local farm products with real-time pricing
- Add items to cart with quantity selection
- Place orders with delivery tracking
- View live delivery map with driver positions
- Upload and watch educational videos

### For Farmers
- Create and manage product listings
- Track order history and revenue
- Request product pickups from warehouse
- Monitor pickup and delivery status

### Core Functionality
- **Authentication**: Separate flows for shoppers and farmers
- **Marketplace**: Dynamic pricing and inventory management
- **Real-time Tracking**: Live delivery and pickup tracking on interactive map
- **Cart System**: Persistent shopping cart with checkout flow
- **Video Learning**: Upload and manage educational content

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **MapLibre GL** - Interactive maps
- **Lucide React** - Icons

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Key Components

### App.jsx
Main application component managing:
- Authentication state
- Shopping cart
- Order management
- Real-time driver simulation
- Tab navigation

### Marketplace
- Product grid with images and pricing
- Add to cart functionality
- Sidebar cart summary
- Checkout flow

### DeliveriesMap
- MapLibre integration
- Real-time driver tracking
- Order and pickup visualization
- Interactive map controls

### FarmerHub
- Dashboard with statistics
- Product listing management
- Order history
- Pickup request system

## Data Flow

1. **Authentication**: Users sign up as shoppers or farmers
2. **Marketplace**: Shoppers browse products, add to cart
3. **Checkout**: Orders are placed and drivers are dispatched
4. **Tracking**: Real-time updates show delivery progress
5. **Farmer Management**: Farmers can list products and track orders

## Development Notes

- Uses pure helper functions for easy testing
- Real-time simulation runs on 1.2s intervals
- MapLibre assets loaded dynamically
- Responsive design with mobile-first approach
- Green and white color scheme throughout


