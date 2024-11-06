import { ItemState } from '../../types/ItemState.types';
import { db } from '../database/db';

export const get_items_states_service = async () => {
  console.log(`Looking all items states...`);
  try {
    const respond = await db.any(`SELECT * FROM ${process.env.DB_SCHEMA}.items_state`);
    console.log(`Passed: all itmes states found`);
    return respond;
  } catch (error) {
    console.log(`Failed: Looking items states ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const add_item_state_service = async (model: Omit<ItemState, 'item_state_id'>) => {
  console.log(`Creating new item state for item id ${model.item_id}`)

  try {
    const query = `INSERT INTO ${process.env.DB_SCHEMA}.items_state(item_id, total_available_units, total_available_pcs)
      VALUES ( $<item_id>, $<total_available_units>, $<total_available_pcs>) 
      RETURNING item_state_id`;
    const respond = await db.one(query, model);
    console.log(`Passed: new item state created for item id ${model.item_id}`)
    return respond;
  } catch (error) {
    console.log(`Failed: creating item state ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const update_item_state_service = async (model: Omit<ItemState, 'item_state_id'>) => {
  console.log(`Updating item state for item id ${model.item_id}`)

  try {
    const query = `UPDATE ${process.env.DB_SCHEMA}.items_state 
                    SET total_available_units = 0, 
                        total_available_pcs = (SELECT total_available_pcs FROM ${process.env.DB_SCHEMA}.items_state WHERE item_id = $<item_id>) + $<total_available_pcs> 
                    WHERE item_id = $<item_id> 
                    RETURNING item_state_id`;

    const respond = await db.one(query, model);
    console.log(`Passed: item state updated for item id ${model.item_id}`)
    return respond;
  } catch (error) {
    console.log(`Failed: Updating item state for item id ${model.item_id} ==> ${error}`);
    return ({ error: `DB error` });
  }
}
