import { Category } from "./Category.types"
import { Pcs } from "./Pcs.types"
import { StockState } from "./State.types"
import { Unit } from "./unit.types"

export type Item = {
  item_id?: number,
  item_name: string,
  pcs_per_unit: number,
  user_id: number,
  category_id: number,
  item_note: string,
  unit_id: number,
  archived: boolean,
  pc_unit_id: number
}

export type ItemDocument = Item & StockState & Category & Unit & Pcs & {
  barcode?: string, 
  pc_barcode?: string
}

