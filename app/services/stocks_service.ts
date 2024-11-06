import { Stock } from '../../types/Stock.types';
import { db } from '../database/db';
import { delete_stock_state_service } from './states_service';

export const get_stocks_service = async () => {
  console.log(`Looking all stocks...`);
  try {
    const respond = await db.any(`SELECT * FROM ${process.env.DB_SCHEMA}.stocking`);
    console.log(`Passed: all stocks found`);
    return respond;
  } catch (error) {
    console.log(`Failed: Looking stocks ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const add_stock_service = async (model: Omit<Stock, 'stocking_id'>) => {
  console.log(`Creating new stock for item id ${model.item_id}`)

  try {
    // const query = `INSERT INTO ${process.env.DB_SCHEMA}.stocking(
    //   unit_cost, unit_price, pc_cost, pc_price, amount_in_units, expire_date, user_id, item_id, stocking_note, production_date, barcode, pc_barcode)
    //   VALUES ( $<unit_cost>, $<unit_price>, $<pc_cost>, $<pc_price>, $<amount_in_units>, $<expire_date>, $<user_id>, $<item_id>, $<stocking_note>, $<production_date>, $<barcode>, $<pc_barcode>) 
    //   RETURNING stocking_id`;
    const query = `INSERT INTO ${process.env.DB_SCHEMA}.stocking(
      pc_cost, pc_price, amount_in_pcs, expire_date, user_id, item_id, stocking_note, pc_barcode)
      VALUES ( $<pc_cost>, $<pc_price>, $<amount_in_pcs>, $<expire_date>, $<user_id>, $<item_id>, $<stocking_note>, $<pc_barcode>) 
      RETURNING stocking_id`;
    const respond = await db.one(query, model);
    console.log(`Passed: stock created for item id ${model.item_id}`)
    return respond;
  } catch (error) {
    console.log(`Failed: creating stock ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const delete_stock_service = async (stocking_id: number) => {
  console.log(`Deleting stock with stocking id ${stocking_id}`)

  try {
    const query = `DELETE FROM ${process.env.DB_SCHEMA}.stocking WHERE stocking_id=$<stocking_id>`;
    const respond = await db.none(query, { stocking_id });
    console.log(`Passed: deleting stock with stocking id ${stocking_id}`)
    return respond;
  } catch (error) {
    console.log(`Failed: deleting stock with stocking id ${stocking_id} ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const delete_stock_service_2 = async (
  item_id: number,
  stocking_id: number,
  state_id: number) => {
  console.log(`Deleting stock with stocking id ${stocking_id}`)

  try {
    const itemStateQuery = `UPDATE ${process.env.DB_SCHEMA}.items_state 
                              SET total_available_units = (SELECT total_available_units 
                                                            FROM ${process.env.DB_SCHEMA}.items_state 
                                                          WHERE item_id=$<item_id>) - (SELECT current_units  
                                                            FROM ${process.env.DB_SCHEMA}.stocks_state 
                                                          WHERE state_id=$<state_id>),
                                  total_available_pcs = (SELECT total_available_pcs 
                                                          FROM ${process.env.DB_SCHEMA}.items_state 
                                                        WHERE item_id=$<item_id>) - (SELECT current_pcs  
                                                          FROM ${process.env.DB_SCHEMA}.stocks_state 
                                                        WHERE state_id=$<state_id>) 
                              WHERE item_id=$<item_id> 
                              RETURNING item_id`
    await db.one(itemStateQuery, { item_id, state_id })
    await delete_stock_state_service(state_id)
    const query = `DELETE FROM ${process.env.DB_SCHEMA}.stocking WHERE stocking_id=$<stocking_id>`;
    const respond = await db.none(query, { stocking_id });
    console.log(`Passed: Updating item state and deleting stock, and stock state for stocking id ${stocking_id}`)
    return respond;
  } catch (error) {
    console.log(`Failed: Updating item state and deleting stock, and stock state for stocking id ${stocking_id} ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const update_stock_expire_date_service = async (stocking_id: number, expire_date: string) => {
  console.log(`Updating stock expire date for stocking id ${stocking_id}`)

  try {
    const query = `UPDATE ${process.env.DB_SCHEMA}.stocking 
                    SET expire_date = $<expire_date> 
                    WHERE stocking_id = $<stocking_id> 
                    RETURNING stocking_id`;
    const respond = await db.one(query, { stocking_id, expire_date });
    console.log(`Passed: stock expire date updated`)
    return respond;
  } catch (error) {
    console.log(`Failed: updating stock expire date ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const update_stock_barcodes_service = async (stocking_id: number, pc_barcode: string | null) => {
  console.log(`Updating stock barcods for stocking id ${stocking_id}`)

  try {
    const query = `UPDATE ${process.env.DB_SCHEMA}.stocking 
                    SET pc_barcode = $<pc_barcode> 
                    WHERE stocking_id = $<stocking_id> 
                    RETURNING stocking_id`;
    const respond = await db.one(query, { stocking_id, pc_barcode });
    console.log(`Passed: stock barcode updated`)
    return respond;
  } catch (error) {
    console.log(`Failed: updating stock expire date ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const update_stock_amount_in_pcs_service = async (
  item_id: number,
  stocking_id: number,
  state_id: number,
  newAmountInPcs: number,
  old_quantity_in_pcs: number,
  newCurrentPcs: number
) => {
  console.log(`Updating stock amount in pcs for stocking id ${stocking_id}`)

  try {
    // Update current units and pcs in stocks state table
    const updateStocksStateQuery = `UPDATE ${process.env.DB_SCHEMA}.stocks_state 
                                    SET current_pcs = $<newCurrentPcs> 
                                    WHERE state_id = $<state_id> 
                                    RETURNING state_id`
    await db.one(updateStocksStateQuery, { state_id, newCurrentPcs })

    // Update amount_in_units in stocking table
    const updateStockQuery = `UPDATE ${process.env.DB_SCHEMA}.stocking 
                              SET amount_in_pcs = $<newAmountInPcs> 
                              WHERE stocking_id = $<stocking_id> 
                              RETURNING stocking_id`
    await db.one(updateStockQuery, { stocking_id, newAmountInPcs })

    // Update total available units and pcs in items_state table
    const UpdateItemStateQuery = `UPDATE ${process.env.DB_SCHEMA}.items_state 
                                  SET total_available_pcs = ((SELECT total_available_pcs FROM ${process.env.DB_SCHEMA}.items_state WHERE item_id = $<item_id>) 
                                                                  + ($<newAmountInPcs> - $<old_quantity_in_pcs>)) 
                                  WHERE item_id = $<item_id> 
                                  RETURNING item_id`

    const respond = await db.one(UpdateItemStateQuery, {
      item_id,
      newAmountInPcs,
      old_quantity_in_pcs
    })

    console.log(`Passed: amount in pcs has been updated`)
    return respond;
  } catch (error) {
    console.log(`Failed: updating amount in pcs  ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const update_stock_cost_and_price_service = async (
  stocking_id: number,
  pc_cost: number,
  pc_price: number
) => {
  console.log(`Updating stock cost and price for stocking id ${stocking_id}`)

  try {
    const updateStockQuery = `UPDATE ${process.env.DB_SCHEMA}.stocking 
                              SET pc_cost = $<pc_cost>, 
                                  pc_price = $<pc_price> 
                              WHERE stocking_id = $<stocking_id> 
                              RETURNING stocking_id`
    const respond = await db.one(updateStockQuery, {
      stocking_id,
      pc_cost,
      pc_price
    })

    console.log(`Passed: cost and price has been updated`)
    return respond;
  } catch (error) {
    console.log(`Failed: updating cost and price  ==> ${error}`);
    return ({ error: `DB error` });
  }
}
