import { Category } from "./Category.types"
import { Pcs } from "./Pcs.types"
import { StockState } from "./State.types"
import { Unit } from "./unit.types"

export type Item = {
  item_id?: number,
  item_name: string,
  pcs_per_unit?: number, // no longer needed
  user_id: number,
  category_id: number,
  item_note?: string, // no longer needed
  unit_id?: number, // no longer needed
  archived?: boolean,
  pc_unit_id?: number // no longer needed
}

export type ItemDocument = Item & StockState & Category & Unit & Pcs & {
  barcode?: string, 
  pc_barcode?: string
}

