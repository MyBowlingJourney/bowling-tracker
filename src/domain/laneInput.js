// What a lane-number field is allowed to hold.
//
// Lanes are numbered from 1. The fields were type="number", which accepts
// a minus sign, a decimal point and an exponent -- so "-8" was a starting
// lane, and every lane the app worked out from it for the rest of the
// night was negative too.
//
// Returns digits only, no leading zeros, at most three characters (no
// centre has a thousand lanes). "" means "not set", as before.
export function laneDigits(value) {
  return String(value ?? "").replace(/\D/g, "").replace(/^0+/, "").slice(0, 3);
}
