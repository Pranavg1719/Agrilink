// Route Optimization Algorithm for Cold Fleet & Delivery Partners
// Zero-cost mathematical optimization using Haversine Distance + Nearest Neighbor + 2-Opt TSP Heuristic

export interface Waypoint {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  type: 'depot' | 'pickup' | 'delivery'
  quantityKg: number
  timeWindow?: string
  contact?: string
}

export interface RouteOptimizationResult {
  originalTour: Waypoint[]
  optimizedTour: Waypoint[]
  originalDistanceKm: number
  optimizedDistanceKm: number
  distanceSavedKm: number
  percentageSaved: number
  fuelSavedLiters: number
  costSavedINR: number
  co2SavedKg: number
  estimatedDurationMins: number
}

// Haversine formula to compute distance between two latitude/longitude coordinates in kilometers
export function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Calculate total length of a tour given waypoints in sequential order
export function calculateTourDistance(tour: Waypoint[]): number {
  if (tour.length < 2) return 0
  let total = 0
  for (let i = 0; i < tour.length - 1; i++) {
    total += haversineDistanceKm(tour[i].lat, tour[i].lng, tour[i + 1].lat, tour[i + 1].lng)
  }
  return total
}

// Nearest Neighbor Heuristic starting from depot (index 0)
export function nearestNeighborTour(waypoints: Waypoint[]): Waypoint[] {
  if (waypoints.length <= 2) return [...waypoints]

  const unvisited = [...waypoints]
  const tour: Waypoint[] = [unvisited.shift()!] // Start at depot

  while (unvisited.length > 0) {
    const current = tour[tour.length - 1]
    let nearestIdx = 0
    let minDistance = Infinity

    for (let i = 0; i < unvisited.length; i++) {
      const dist = haversineDistanceKm(current.lat, current.lng, unvisited[i].lat, unvisited[i].lng)
      if (dist < minDistance) {
        minDistance = dist
        nearestIdx = i
      }
    }

    tour.push(unvisited.splice(nearestIdx, 1)[0])
  }

  return tour
}

// 2-Opt Iterative Improvement to eliminate crossing paths
export function twoOpt(tour: Waypoint[], maxIterations = 50): Waypoint[] {
  let improved = true
  let bestTour = [...tour]
  let iterations = 0

  while (improved && iterations < maxIterations) {
    improved = false
    iterations++

    // Keep depot at index 0 and optionally at end if closed loop
    for (let i = 1; i < bestTour.length - 2; i++) {
      for (let k = i + 1; k < bestTour.length - 1; k++) {
        const delta =
          -haversineDistanceKm(bestTour[i - 1].lat, bestTour[i - 1].lng, bestTour[i].lat, bestTour[i].lng) -
          haversineDistanceKm(bestTour[k].lat, bestTour[k].lng, bestTour[k + 1].lat, bestTour[k + 1].lng) +
          haversineDistanceKm(bestTour[i - 1].lat, bestTour[i - 1].lng, bestTour[k].lat, bestTour[k].lng) +
          haversineDistanceKm(bestTour[i].lat, bestTour[i].lng, bestTour[k + 1].lat, bestTour[k + 1].lng)

        if (delta < -0.01) {
          // Reverse sub-sequence from i to k
          const reversed = bestTour.slice(i, k + 1).reverse()
          bestTour = [...bestTour.slice(0, i), ...reversed, ...bestTour.slice(k + 1)]
          improved = true
        }
      }
    }
  }

  return bestTour
}

// Full Optimization Pipeline
export function optimizeLogisticsRoute(rawWaypoints: Waypoint[]): RouteOptimizationResult {
  const originalDistance = calculateTourDistance(rawWaypoints)
  
  // 1. Initial nearest neighbor
  const nnTour = nearestNeighborTour(rawWaypoints)
  // 2. 2-Opt refinement
  const optimizedTour = twoOpt(nnTour)
  const optimizedDistance = calculateTourDistance(optimizedTour)

  const distanceSaved = Math.max(0, originalDistance - optimizedDistance)
  const percentageSaved = originalDistance > 0 ? (distanceSaved / originalDistance) * 100 : 0

  // Economic & Ecological impact constants for light commercial diesel vans in India:
  // Avg 9.5 km per litre of diesel
  // Diesel price approx ₹90 / litre
  // 2.68 kg CO2 emitted per litre
  const fuelSavedLiters = distanceSaved / 9.5
  const costSavedINR = fuelSavedLiters * 90
  const co2SavedKg = fuelSavedLiters * 2.68

  // Average vehicle speed 42 km/h in regional/rural corridors + 12 mins per loading stop
  const travelTimeMins = (optimizedDistance / 42) * 60
  const stopHandlingMins = (optimizedTour.length - 1) * 12
  const estimatedDurationMins = Math.round(travelTimeMins + stopHandlingMins)

  return {
    originalTour: rawWaypoints,
    optimizedTour,
    originalDistanceKm: Number(originalDistance.toFixed(1)),
    optimizedDistanceKm: Number(optimizedDistance.toFixed(1)),
    distanceSavedKm: Number(distanceSaved.toFixed(1)),
    percentageSaved: Number(percentageSaved.toFixed(1)),
    fuelSavedLiters: Number(fuelSavedLiters.toFixed(1)),
    costSavedINR: Number(costSavedINR.toFixed(0)),
    co2SavedKg: Number(co2SavedKg.toFixed(1)),
    estimatedDurationMins
  }
}
