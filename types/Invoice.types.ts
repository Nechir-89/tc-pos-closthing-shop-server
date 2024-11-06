
export type Invoice = {
  invoice_id?: number,
  invoice_date: string,
  payment_method_id?: number,
  user_id: number,
  gifted_amount?: number,
  paid_price: number,
  invoice_price: number,
  invoice_cost: number,
  invoice_type?: string
}

export type InvoiceItem = {
  invoice_item_id?: number,
  invoice_id?: number,
  item_id: number,
  is_unit: Boolean,
  quantity: number,
  total_price: number,
  total_cost: number,
  cost: number,
  price: number,
  pcs_per_unit: number
}

export type InvoiceRequestBody = {
  invoice_date: string,
  invoice_price: number,
  gifted_amount: number,
  paid_price: number,
  invoice_cost: number,
  payment_method_id: number,
  user_id: number,
  items: InvoiceItem[],
  invoice_type?: string
}
