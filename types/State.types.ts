export type StockState = {
  state_id?: number, 
  item_id: number, 
  stocking_id: number, 
  current_units?: number, 
  current_pcs: number, 
  pcs_per_unit?: number, 
  solid_units?: number,
  solid_pcs?: number, 
  total_cost?: number, 
  total_price?: number, 
  approx_profit?: number, 
  gifted_units?: number, 
  gifted_pcs?: number, 
  damaged_units?: number, 
  damaged_pcs?: number, 
  expired_units?: number, 
  expired_pcs?: number, 
  returned_units_to_supplier?: number, 
  returned_pcs_to_supplier?: number 
}
