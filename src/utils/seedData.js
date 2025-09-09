import { seedListingsBase } from '../constants/seedListings.js'
import { farms } from '../constants/farms.js'
import { randBetween, round2 } from './helpers.js'

export function seedWithRandomPricesAndFarms() {
  return seedListingsBase.map((l, i) => {
    const pricePerUnit = round2(l.basePrice * randBetween(0.9, 1.3))
    const farm = farms[i % farms.length]
    return { ...l, pricePerUnit, farm }
  })
}


