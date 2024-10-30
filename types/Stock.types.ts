export type Stock = {
  stocking_id?: number,
  date?: Date, 
  unit_cost: number, 
  unit_price: number, 
  pc_cost: number, 
  pc_price: number, 
  amount_in_units: number, 
  expire_date: Date, 
  user_id: number, 
  item_id: number, 
  stocking_note: string, 
  production_date?: Date, 
  barcode?: string, 
  pc_barcode?: string
}
