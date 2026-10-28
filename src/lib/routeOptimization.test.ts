import { describe, it, expect } from 'vitest'
import {
  haversineDistanceKm,
  calculateTourDistance,
  nearestNeighborTour,
  twoOpt,
  optimizeLogisticsRoute,
  type Waypoint
} from './routeOptimization'

const depot: Waypoint = {
  id: 'w0', name: 'Cold Hub', address: 'Nashik APMC', lat: 20.0, lng: 73.79, type: 'depot', quantityKg: 0
}

const makeWaypoint = (id: string, name: string, lat: number, lng: number, quantityKg = 10): Waypoint => ({
  id, name, address: `Address ${id}`, lat, lng, type: id.startsWith('p') ? 'pickup' : 'delivery', quantityKg
})

describe('haversineDistanceKm', () => {
  it('returns 0 for identical coordinates', () => {
    expect(haversineDistanceKm(20.0, 73.79, 20.0, 73.79)).toBeCloseTo(0, 5)
  })

  it('returns a positive distance for distinct points', () => {
    const d = haversineDistanceKm(20.0, 73.79, 19.99, 73.80)
    expect(d).toBeGreaterThan(0)
    expect(d).toBeLessThan(10)
  })

  it('handles the antimeridian-scale distance sanely (Delhi to Mumbai ~1100km)', () => {
    const d = haversineDistanceKm(28.61, 77.20, 19.07, 72.87)
    expect(d).toBeGreaterThan(1000)
    expect(d).toBeLessThan(1250)
  })

  it('is symmetric', () => {
    const ab = haversineDistanceKm(20.1, 73.9, 20.3, 74.1)
    const ba = haversineDistanceKm(20.3, 74.1, 20.1, 73.9)
    expect(ab).toBeCloseTo(ba, 9)
  })
})

describe('calculateTourDistance', () => {
  it('returns 0 for tours with fewer than 2 waypoints', () => {
    expect(calculateTourDistance([])).toBe(0)
    expect(calculateTourDistance([depot])).toBe(0)
  })

  it('sums segment distances (triangle inequality sanity)', () => {
    const a = makeWaypoint('p1', 'Farm A', 20.0, 73.8)
    const b = makeWaypoint('d1', 'Shop B', 20.1, 73.9)
    const c = makeWaypoint('d2', 'Shop C', 20.15, 73.95)
    const ab = haversineDistanceKm(a.lat, a.lng, b.lat, b.lng)
    const bc = haversineDistanceKm(b.lat, b.lng, c.lat, c.lng)
    expect(calculateTourDistance([a, b, c])).toBeCloseTo(ab + bc, 6)
  })
})

describe('nearestNeighborTour', () => {
  it('keeps the depot first and visits every waypoint exactly once', () => {
    const waypoints = [
      depot,
      makeWaypoint('d3', 'Far Stop', 20.9, 74.5),
      makeWaypoint('d1', 'Near Stop', 20.05, 73.85),
      makeWaypoint('d2', 'Mid Stop', 20.4, 74.1)
    ]
    const tour = nearestNeighborTour(waypoints)
    expect(tour[0].id).toBe('w0')
    expect(tour).toHaveLength(waypoints.length)
    expect(new Set(tour.map(w => w.id))).toEqual(new Set(waypoints.map(w => w.id)))
  })

  it('output is never longer than the nearest-neighbor baseline route', () => {
    const waypoints = [
      depot,
      makeWaypoint('d3', 'Far Stop', 20.9, 74.5),
      makeWaypoint('d1', 'Near Stop', 20.05, 73.85),
      makeWaypoint('d2', 'Mid Stop', 20.4, 74.1)
    ]
    const nn = nearestNeighborTour(waypoints)
    const naive = calculateTourDistance(waypoints)
    expect(calculateTourDistance(nn)).toBeLessThanOrEqual(naive + 1e-6)
  })
})

describe('twoOpt', () => {
  it('never increases the tour distance', () => {
    const tour = nearestNeighborTour([
      depot,
      makeWaypoint('d3', 'Far Stop', 20.9, 74.5),
      makeWaypoint('d1', 'Near Stop', 20.05, 73.85),
      makeWaypoint('d2', 'Mid Stop', 20.4, 74.1),
      makeWaypoint('d4', 'Extra Stop', 20.6, 73.7)
    ])
    const optimized = twoOpt(tour)
    expect(calculateTourDistance(optimized)).toBeLessThanOrEqual(calculateTourDistance(tour) + 1e-6)
  })

  it('preserves all waypoints and the depot position', () => {
    const tour = nearestNeighborTour([depot, makeWaypoint('d1', 'A', 20.1, 73.8), makeWaypoint('d2', 'B', 20.3, 73.9)])
    const optimized = twoOpt(tour)
    expect(optimized.map(w => w.id).sort()).toEqual(tour.map(w => w.id).sort())
    expect(optimized[0].type).toBe('depot')
  })
})

describe('optimizeLogisticsRoute', () => {
  const sample = [
    depot,
    makeWaypoint('d3', 'Far Stop', 20.9, 74.5, 40),
    makeWaypoint('d1', 'Near Stop', 20.05, 73.85, 15),
    makeWaypoint('d2', 'Mid Stop', 20.4, 74.1, 25),
    makeWaypoint('d4', 'Extra Stop', 20.6, 73.7, 20)
  ]

  it('returns a fully populated result object', () => {
    const result = optimizeLogisticsRoute(sample)
    expect(result.originalTour).toHaveLength(sample.length)
    expect(result.optimizedTour[0].type).toBe('depot')
    expect(result.originalDistanceKm).toBeGreaterThan(0)
    expect(result.optimizedDistanceKm).toBeGreaterThan(0)
    expect(result.optimizedDistanceKm).toBeLessThanOrEqual(result.originalDistanceKm)
    expect(result.estimatedDurationMins).toBeGreaterThan(0)
  })

  it('never reports negative savings', () => {
    const result = optimizeLogisticsRoute(sample)
    expect(result.distanceSavedKm).toBeGreaterThanOrEqual(0)
    expect(result.percentageSaved).toBeGreaterThanOrEqual(0)
    expect(result.fuelSavedLiters).toBeGreaterThanOrEqual(0)
    expect(result.costSavedINR).toBeGreaterThanOrEqual(0)
    expect(result.co2SavedKg).toBeGreaterThanOrEqual(0)
  })

  it('rounds monetary values to integers', () => {
    const result = optimizeLogisticsRoute(sample)
    expect(Number.isInteger(result.costSavedINR)).toBe(true)
  })

  it('counts 12 minutes of handling per stop beyond the depot', () => {
    const result = optimizeLogisticsRoute(sample)
    const travelMins = (result.optimizedDistanceKm / 42) * 60
    expect(result.estimatedDurationMins).toBe(Math.round(travelMins + (sample.length - 1) * 12))
  })

  it('handles a single-depot route gracefully', () => {
    const result = optimizeLogisticsRoute([depot])
    expect(result.originalDistanceKm).toBe(0)
    expect(result.optimizedDistanceKm).toBe(0)
    expect(result.estimatedDurationMins).toBe(0)
  })
})
