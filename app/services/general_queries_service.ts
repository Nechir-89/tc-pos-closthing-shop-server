import { db } from "../database/db";

export const search_last_stock_barcode_service = async (barcode: string) => {
  console.log(`Looking last stock data for barcode ${barcode}`);
  try {
    const query = `SELECT 
    stocking.*, 
    items.*, 
    categories.category_name, 
    items_state.total_available_units, 
    items_state.total_available_pcs 

  FROM 
    ${process.env.DB_SCHEMA}.stocking,
    ${process.env.DB_SCHEMA}.items,
    ${process.env.DB_SCHEMA}.categories,
    ${process.env.DB_SCHEMA}.items_state 

  WHERE 
    stocking.item_id = items.item_id
    and items.category_id = categories.category_id
    and items.item_id = items_state.item_id
    and ( stocking.barcode = $<barcode> or stocking.pc_barcode = $<barcode> ) 

  ORDER BY stocking.date DESC 
  LIMIT 1`

    const result = await db.any(query, { barcode })

    console.log(`Passed: last stock data found`);
    return result;
  } catch (error) {
    console.log(`Failed: Looking last stock data ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const sum_amount_in_pcs_service = async (item_id: number) => {
  console.log(`Getting sum of amount in pcs for item ${item_id}`);
  try {
    const query = `SELECT SUM(amount_in_pcs) as sum_amount_in_pcs 
  FROM 
    ${process.env.DB_SCHEMA}.stocking

  WHERE 
    item_id = $<item_id> 
  
  GROUP BY item_id  `

    const result = await db.any(query, { item_id })

    console.log(`Passed: found sum of amount in pcs for ${item_id}`);
    return result;
  } catch (error) {
    console.log(`Failed: finding sum of amount in pcs for ${item_id} ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const search_last_stock_by_item_name_service = async (item_name: string) => {
  console.log(`Looking last stock data for item ${item_name}`);
  try {
    const query = `SELECT 
    stocking.*, 
    items.*, 
    units.unit_name, 
    categories.category_name, 
    pcs_units.pc_unit_name, 
    items_state.total_available_units, 
    items_state.total_available_pcs 
  FROM 
    ${process.env.DB_SCHEMA}.stocking,
    ${process.env.DB_SCHEMA}.items,
    ${process.env.DB_SCHEMA}.units,
    ${process.env.DB_SCHEMA}.categories,
    ${process.env.DB_SCHEMA}.pcs_units,
    ${process.env.DB_SCHEMA}.items_state 
  WHERE 
    stocking.item_id = items.item_id
    and items.unit_id = units.unit_id
    and items.category_id = categories.category_id
    and items.pc_unit_id = pcs_units.pc_unit_id
    and items.item_id = items_state.item_id
    and items.item_name = $<item_name> 

  ORDER BY stocking.date DESC 
  LIMIT 1`

    const result = await db.any(query, { item_name })
    console.log(`Passed: last stock data found`);
    return result;
  } catch (error) {
    console.log(`Failed: Looking last stock data ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const search_last_stock_by_item_id_service = async (item_id: string) => {
  console.log(`Looking last stock data for item ${item_id}`);
  try {
    const query = `SELECT 
                      stocking.*, 
                      items.*, 
                      units.unit_name, 
                      categories.category_name, 
                      pcs_units.pc_unit_name, 
                      items_state.total_available_units, 
                      items_state.total_available_pcs 
                    FROM 
                      ${process.env.DB_SCHEMA}.stocking,
                      ${process.env.DB_SCHEMA}.items,
                      ${process.env.DB_SCHEMA}.units,
                      ${process.env.DB_SCHEMA}.categories,
                      ${process.env.DB_SCHEMA}.pcs_units,
                      ${process.env.DB_SCHEMA}.items_state 
                    WHERE 
                      stocking.item_id = items.item_id
                      and items.unit_id = units.unit_id
                      and items.category_id = categories.category_id
                      and items.pc_unit_id = pcs_units.pc_unit_id
                      and items.item_id = items_state.item_id
                      and items.item_id = $<item_id> 
                      and items_state.total_available_pcs > 0 
                      ORDER BY stocking.date DESC 
                      LIMIT 1`

    const result = await db.any(query, { item_id })
    console.log(`Passed: last stock data found`);
    return result;
  } catch (error) {
    console.log(`Failed: Looking last stock data ==> ${error}`);
    return ({ error: `DB error` });
  }
}


