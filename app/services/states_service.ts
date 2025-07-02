import { StockState } from '../../types/State.types';
import { db } from '../database/db';

export const get_non_zero_stock_states_service = async () => {
  console.log(`Looking all non zero stock states`);
  try {
    const respond = await db.any(`SELECT * 
    FROM ${process.env.DB_SCHEMA}.stocks_state 
    WHERE current_pcs > 0`);

    console.log(`Passed: all stocks states found`);
    return respond;
  } catch (error) {
    console.log(`Failed: Looking stocks states ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const get_nonzero_stock_states_by_item_id_service = async (item_id: number) => {
  console.log(`Looking all non zero stock states for item ${item_id}`);
  try {
    const respond = await db.any(`SELECT * 
    FROM ${process.env.DB_SCHEMA}.stocks_state 
    WHERE item_id = $<item_id> AND current_pcs > 0
    ORDER BY state_id ASC`, { item_id });

    console.log(`Passed: all non zero stock states found for item ${item_id}`);

    return respond;
  } catch (error) {
    console.log(`Failed: Looking non zero stock states for item ${item_id} ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const get_stock_states_by_item_id_service = async (item_id: number) => {
  console.log(`Looking all stock states for item ${item_id}`);
  try {
    const respond = await db.any(`SELECT * 
    FROM ${process.env.DB_SCHEMA}.stocks_state 
    WHERE item_id = $<item_id> 
    ORDER BY state_id DESC`, { item_id });

    console.log(`Passed: all stock states found for item ${item_id}`);

    return respond;
  } catch (error) {
    console.log(`Failed: Looking all stock states for item ${item_id} ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const add_stock_state_service = async (model: Omit<StockState, 'state_id'>) => {
  console.log(`Creating new stock state for item id ${model.item_id}`)

  try {
    const query = `INSERT INTO ${process.env.DB_SCHEMA}.stocks_state(item_id, stocking_id, current_units, current_pcs, pcs_per_unit, solid_units, solid_pcs, total_cost, total_price, approx_profit, gifted_units, gifted_pcs, damaged_units, damaged_pcs, expired_units, expired_pcs, returned_units_to_supplier, returned_pcs_to_supplier)
      VALUES ( $<item_id>, $<stocking_id>, $<current_units>, $<current_pcs>, $<pcs_per_unit>, $<solid_units>, $<solid_pcs>, $<total_cost>, $<total_price>, $<approx_profit>, $<gifted_units>, $<gifted_pcs>, $<damaged_units>, $<damaged_pcs>, $<expired_units>, $<expired_pcs>, $<returned_units_to_supplier>, $<returned_pcs_to_supplier>)
      RETURNING state_id`;
    const respond = await db.one(query, model);
    console.log(`Passed: new stock state created for item id ${model.item_id}`)
    return respond;
  } catch (error) {
    console.log(`Failed: creating stock state ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const delete_stock_state_service = async (state_id: number) => {
  console.log(`Deleting stock state of id ${state_id}`)

  try {
    const query = `DELETE FROM ${process.env.DB_SCHEMA}.stocks_state WHERE state_id = $<state_id>`;
    const respond = await db.one(query, { state_id });
    console.log(`Passed: stock state of id ${state_id} deleted`)
    return respond;
  } catch (error) {
    console.log(`Failed: deleting stock state ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const get_stocks_states_docs_service = async () => {
  console.log(`Looking all stocks states documents...`);
  try {
    const query = `SELECT 
                    stocks_state.*, 
                    s.pc_cost, s.pc_price, 
                    s.pc_barcode, s.stocking_note, 
                    s.date, s.production_date, 
                    s.expire_date, s.amount_in_pcs, s.has_discount, 
                    categories.category_name, 
                    items.item_name, 
                    users.user_name  
                  FROM 
                    ${process.env.DB_SCHEMA}.stocks_state, 
                    ${process.env.DB_SCHEMA}.stocking AS s, 
                    ${process.env.DB_SCHEMA}.items, 
                    ${process.env.DB_SCHEMA}.users, 
                    ${process.env.DB_SCHEMA}.categories  
                  WHERE 
                    stocks_state.stocking_id = s.stocking_id 
                    AND stocks_state.current_pcs > 0 
                    AND s.item_id = items.item_id 
                    AND s.user_id = users.user_id 
                    AND items.category_id = categories.category_id  
                    ORDER BY stocks_state.state_id DESC`;

    const respond = await db.any(query);
    console.log(`Passed: all stocks states documents found`);
    return respond;
  } catch (error) {
    console.log(`Failed: Looking stocks states documents ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const get_stocks_states_docs_by_barcode_service = async (barcode: string) => {
  console.log(`Looking all stocks states documents for barcode ${barcode}`);
  try {
    const query = `SELECT 
                    stocks_state.*, 
                    s.pc_cost, s.pc_price, 
                    s.pc_barcode, s.stocking_note, 
                    s.date, s.production_date, 
                    s.expire_date, s.amount_in_pcs, s.has_discount, 
                    categories.category_name, 
                    items.item_name, 
                    users.user_name 

                  FROM 
                    ${process.env.DB_SCHEMA}.stocks_state, 
                    ${process.env.DB_SCHEMA}.stocking AS s, 
                    ${process.env.DB_SCHEMA}.items, 
                    ${process.env.DB_SCHEMA}.users, 
                    ${process.env.DB_SCHEMA}.categories 

                  WHERE 
                    stocks_state.stocking_id = s.stocking_id 
                    AND s.item_id = items.item_id 
                    AND s.user_id = users.user_id 
                    AND items.category_id = categories.category_id  
                    AND (s.barcode = $<barcode> OR s.pc_barcode = $<barcode>) 
                  
                    ORDER BY stocks_state.state_id DESC`;
                    
    const respond = await db.any(query, { barcode });
    console.log(`Passed: all stocks states documents for barcode ${barcode} found`);
    return respond;
  } catch (error) {
    console.log(`Failed: Looking stocks states documents for barcode ${barcode} ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const get_stocks_states_docs_by_item_name_service = async (item_name: string) => {
  console.log(`Looking all stocks states documents for item ${item_name}`);
  try {
    const query = `SELECT 
                    stocks_state.*, 
                    s.unit_cost, s.unit_price, s.pc_cost, s.pc_price, s.barcode, s.pc_barcode, 
                    s.amount_in_units, s.stocking_note, s.date, s.production_date, s.expire_date, 
                    s.has_discount, 
                    categories.category_name, 
                    units.unit_name, 
                    pcs_units.pc_unit_name, 
                    items.item_name, 
                    users.user_name 
                  FROM 
                    ${process.env.DB_SCHEMA}.stocks_state, 
                    ${process.env.DB_SCHEMA}.stocking AS s, 
                    ${process.env.DB_SCHEMA}.items, 
                    ${process.env.DB_SCHEMA}.users, 
                    ${process.env.DB_SCHEMA}.categories, 
                    ${process.env.DB_SCHEMA}.units, 
                    ${process.env.DB_SCHEMA}.pcs_units 
                  WHERE
                    stocks_state.stocking_id = s.stocking_id 
                    AND s.item_id = items.item_id 
                    AND s.user_id = users.user_id 
                    AND items.category_id = categories.category_id 
                    AND items.unit_id = units.unit_id 
                    AND items.pc_unit_id = pcs_units.pc_unit_id  
                    AND items.item_name = $<item_name> 
                  ORDER BY stocks_state.state_id DESC`
    const respond = await db.any(query, { item_name });
    console.log(`Passed: all stocks states documents found for item ${item_name}`);
    return respond;
  } catch (error) {
    console.log(`Failed: Looking stocks states documents found for item ${item_name} ==> ${error}`);
    return ({ error: `DB error` });
  }
}


export const set_stock_state_expire_service = async (
  item_id: number,
  state_id: number,
  current_units: number,
  current_pcs: number
) => {
  console.log(`Setting stock expire quantity for stock state id ${state_id}`)

  try {
    const updateStocksStateQuery = `UPDATE ${process.env.DB_SCHEMA}.stocks_state 
                    SET current_units = 0, 
                        current_pcs = 0, 
                        expired_units = $<current_units>, 
                        expired_pcs = $<current_pcs> WHERE state_id = $<state_id> 
                    RETURNING state_id`;

    const UpdateItemStateQuery = `UPDATE ${process.env.DB_SCHEMA}.items_state 
                    SET total_available_units = (SELECT total_available_units 
                                                  FROM ${process.env.DB_SCHEMA}.items_state 
                                                WHERE item_id = $<item_id> ) - $<current_units>, 
                        total_available_pcs = (SELECT total_available_pcs 
                                                  FROM ${process.env.DB_SCHEMA}.items_state 
                                                WHERE item_id = $<item_id> )  - $<current_pcs> 
                    WHERE item_id = $<item_id> 
                    RETURNING item_state_id`

    await db.one(UpdateItemStateQuery, {
      item_id,
      current_units,
      current_pcs
    })

    const respond = await db.one(updateStocksStateQuery, {
      state_id,
      current_units,
      current_pcs
    });

    console.log(`Passed: stock state has been set to expire`)
    return respond;
  } catch (error) {
    console.log(`Failed: updating stock state ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const set_stock_state_damaged_items_service = async (
  item_id: number,
  state_id: number,
  damaged_units: number,
  damaged_pcs: number
) => {
  console.log(`Setting stock damaged quantity for stock state id ${state_id}`)

  try {
    const updateStocksStateQuery = `UPDATE ${process.env.DB_SCHEMA}.stocks_state 
                    SET current_units = (SELECT current_units 
                                          FROM ${process.env.DB_SCHEMA}.stocks_state 
                                          WHERE state_id = $<state_id>) - ( $<damaged_units> - (SELECT damaged_units 
                                            FROM ${process.env.DB_SCHEMA}.stocks_state 
                                            WHERE state_id = $<state_id>) ), 
                        current_pcs = (SELECT current_pcs 
                                          FROM ${process.env.DB_SCHEMA}.stocks_state 
                                          WHERE state_id = $<state_id>) - ( $<damaged_pcs> - (SELECT damaged_pcs 
                                            FROM ${process.env.DB_SCHEMA}.stocks_state 
                                            WHERE state_id = $<state_id>) ), 
                        damaged_units = $<damaged_units>, 
                        damaged_pcs = $<damaged_pcs> 
                        WHERE state_id = $<state_id> 
                    RETURNING state_id`;

    const UpdateItemStateQuery = `UPDATE ${process.env.DB_SCHEMA}.items_state 
                    SET total_available_units = (SELECT total_available_units 
                                                  FROM ${process.env.DB_SCHEMA}.items_state 
                                                WHERE item_id = $<item_id> ) - ($<damaged_units> - (SELECT damaged_units 
                                                  FROM ${process.env.DB_SCHEMA}.stocks_state 
                                                  WHERE state_id = $<state_id>)), 
                        total_available_pcs = (SELECT total_available_pcs 
                                                  FROM ${process.env.DB_SCHEMA}.items_state 
                                                WHERE item_id = $<item_id> )  - ($<damaged_pcs> - (SELECT damaged_pcs 
                                                  FROM ${process.env.DB_SCHEMA}.stocks_state 
                                                  WHERE state_id = $<state_id>))
                    WHERE item_id = $<item_id> 
                    RETURNING item_state_id`

    await db.one(UpdateItemStateQuery, {
      item_id,
      state_id,
      damaged_units,
      damaged_pcs
    })

    const respond = await db.one(updateStocksStateQuery, {
      state_id,
      damaged_units,
      damaged_pcs
    });

    console.log(`Passed: damaged quantity has been set to stock state ${state_id}`)
    return respond;
  } catch (error) {
    console.log(`Failed: updating damaged quantity for stock state ${state_id} : ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const returned_to_wholesaler_service = async (
  item_id: number,
  state_id: number,
  returned_units_to_supplier: number,
  returned_pcs_to_supplier: number
) => {
  console.log(`Setting stock damaged quantity for stock state id ${state_id}`)

  try {
    const updateStocksStateQuery = `UPDATE ${process.env.DB_SCHEMA}.stocks_state 
                    SET current_units = (SELECT current_units 
                                          FROM ${process.env.DB_SCHEMA}.stocks_state 
                                          WHERE state_id = $<state_id>) - ( $<returned_units_to_supplier> - (SELECT returned_units_to_supplier 
                                            FROM ${process.env.DB_SCHEMA}.stocks_state 
                                            WHERE state_id = $<state_id>) ), 
                        current_pcs = (SELECT current_pcs 
                                          FROM ${process.env.DB_SCHEMA}.stocks_state 
                                          WHERE state_id = $<state_id>) - ( $<returned_pcs_to_supplier> - (SELECT returned_pcs_to_supplier 
                                            FROM ${process.env.DB_SCHEMA}.stocks_state 
                                            WHERE state_id = $<state_id>) ), 
                        returned_units_to_supplier = $<returned_units_to_supplier>, 
                        returned_pcs_to_supplier = $<returned_pcs_to_supplier> 
                        WHERE state_id = $<state_id> 
                    RETURNING state_id`;

    const UpdateItemStateQuery = `UPDATE ${process.env.DB_SCHEMA}.items_state 
                    SET total_available_units = (SELECT total_available_units 
                                                  FROM ${process.env.DB_SCHEMA}.items_state 
                                                WHERE item_id = $<item_id> ) - ($<returned_units_to_supplier> - (SELECT returned_units_to_supplier 
                                                  FROM ${process.env.DB_SCHEMA}.stocks_state 
                                                  WHERE state_id = $<state_id>)), 
                        total_available_pcs = (SELECT total_available_pcs 
                                                  FROM ${process.env.DB_SCHEMA}.items_state 
                                                WHERE item_id = $<item_id> )  - ($<returned_pcs_to_supplier> - (SELECT returned_pcs_to_supplier 
                                                  FROM ${process.env.DB_SCHEMA}.stocks_state 
                                                  WHERE state_id = $<state_id>))
                    WHERE item_id = $<item_id> 
                    RETURNING item_state_id`

    await db.one(UpdateItemStateQuery, {
      item_id,
      state_id,
      returned_units_to_supplier,
      returned_pcs_to_supplier
    })

    const respond = await db.one(updateStocksStateQuery, {
      state_id,
      returned_units_to_supplier,
      returned_pcs_to_supplier
    });

    console.log(`Passed: retrurned to supplier has been set to stock state ${state_id}`)
    return respond;
  } catch (error) {
    console.log(`Failed: retrurned to supplier for stock state ${state_id} : ==> ${error}`);
    return ({ error: `DB error` });
  }
}
