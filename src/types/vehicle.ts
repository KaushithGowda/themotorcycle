export type Vehicle = {
  id: string
  make: string
  model: string
  color: string
  dateOfReg: string // or Date if it's parsed already
  odoReading: string
  regNumber: string
  image?: string
  coverImage?: string
  cubicCapacity?: string
  horsePower?: string
  torque?: string
  kerbWeight?: string
}