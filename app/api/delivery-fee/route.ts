import { NextResponse } from "next/server"

const SHOP_LAT = 7.3775 // replace with Anu's real shop/base coordinates
const SHOP_LNG = 3.9470

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export async function POST(request: Request) {
  const { lat, lng } = await request.json()
  const km = distanceKm(SHOP_LAT, SHOP_LNG, lat, lng)

  let fee = 0
  if (km <= 2) fee = 0
  else if (km <= 5) fee = 500
  else if (km <= 10) fee = 1000
  else fee = 1500

  return NextResponse.json({ fee, km: Math.round(km * 10) / 10 })
}