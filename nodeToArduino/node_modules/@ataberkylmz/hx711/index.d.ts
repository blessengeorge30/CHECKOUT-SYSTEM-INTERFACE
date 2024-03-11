declare class HX711 {
  constructor(clockPin: number, dataPin: number, gain?: number)

  read(): number
  setScale(scale: number): void
  setOffset(offset: number): void
  tare(times?: number): void
  getUnits(times?: number): number
  getOffset(): number
  getScale(): number
  powerUp(): void
  powerDown(): void
}

export = HX711
