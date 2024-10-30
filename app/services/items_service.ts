import { Item } from '../../types/Item.types';
import { db } from '../database/db';

export const get_items_service = async () => {
  console.log(`Looking all items...`);
  try {
    const respond = await db.any(`SELECT * FROM ${process.env.DB_SCHEMA}.items`);
    console.log(`Passed: all items found`);
    return respond;
  } catch (error) {
    console.log(`Failed: Looking items ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const add_item_service = async (model: Item) => {
  console.log(`Creating new item ${model.item_name}`)

  try {
    const query = `INSERT INTO ${process.env.DB_SCHEMA}.items 
    (item_name, pcs_per_unit, user_id, category_id, item_note, unit_id, archived, pc_unit_id) 
    VALUES($<item_name>, $<pcs_per_unit>, $<user_id>, $<category_id>, $<item_note>, $<unit_id>, $<archived>, $<pc_unit_id>) 
    RETURNING item_id`;
    const respond = await db.one(query, model);
    console.log(`Passed: item ${model.item_name} created`)
    return respond;
  } catch (error) {
    console.log(`Failed: creating new item ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const delete_item_service = async (item_id: number) => {
  console.log(`Deleting item with item id ${item_id}`)

  try {
    const query = `DELETE FROM ${process.env.DB_SCHEMA}.items WHERE item_id=$<item_id>`;
    const respond = await db.none(query, { item_id });
    console.log(`Passed: deleting item with item id ${item_id}`)
    return respond;
  } catch (error) {
    console.log(`Failed: deleting item with item id ${item_id} ==> ${error}`);
    return ({ error: `DB error` });
  }
}


// export const get_warehouse_documents_service = async (warehouse_id: number) => {
//   console.log(`Getting documents of warehouse ${warehouse_id}`);
//   try {
//     const query = `SELECT items.*, cates.name as cates_name, cates.unit_type
//                     FROM items, cates
//                     WHERE items.warehouse_id = $<warehouse_id> and items.cates_id=cates.id`;
//     const items: ItemDocument[] = warehouse_id ? await db.any(query, { warehouse_id }) : await db.any(query);
//     return items;
//   } catch (error) {
//     console.log(`failed getting items for warehouse ${warehouse_id} because ${error}`);
//     return ({ error: `DB error` });
//   }
// }

// export const get_warehouse_item_documents_based_on_barcode_service = async (warehouse_id: number, barcode: string) => {
//   console.log(`Getting item document/s in warehouse ${warehouse_id}`);
//   try {
//     const query = `SELECT items.*, cates.name as cates_name, cates.unit_type
//                     FROM items, cates
//                     WHERE items.warehouse_id = $<warehouse_id> and items.barcode=$<barcode> and items.cates_id = cates.id`;
//     const items: ItemDocument[] = warehouse_id ? await db.any(query, { warehouse_id, barcode }) : await db.any(query);
//     return items;
//   } catch (error) {
//     console.log(`failed getting items for warehouse ${warehouse_id} because ${error}`);
//     return ({ error: `DB error` });
//   }
// }

// export const get_all_items_service = async () => {
//   console.log(`Getting items items`);
//   try {
//     const query = `SELECT * FROM items`;
//     const items: Item[] = await db.any(query);
//     return items;
//   } catch (error) {
//     console.log(`failed getting items because ${error}`);
//     return ({ error: `DB error` });
//   }
// }

// export const get_item_service = async (id: number) => {
//   console.log(`Getting item ${id}`);
//   try {
//     const query = `SELECT * FROM items WHERE id=$<id>`;
//     const project: Item | null = await db.oneOrNone(query, { id });
//     return project;
//   } catch (error) {
//     console.log(`failed getting an item ${error}`);
//     return ({ error: `DB error` });
//   }
// }

// export const add_item_service = async (model: Omit<Item, "id">) => {
//   console.log(`Adding new item ${model.name} in warehouse ${model.warehouse_id} ==> ${model.date}`);

//   try {
//     const query = `INSERT INTO items (name,cates_id,warehouse_id,first_entery,date,added,inuse,removed,current, barcode, username, changed, exchange, price, note)
//                     VALUES ($<name>, $<cates_id>, $<warehouse_id>, $<first_entery>,$<date>, $<added>, $<inuse>, $<removed>, $<current>, $<barcode>, $<username>, $<changed>, $<exchange>, $<price>, $<note>)`;
//     const respond = await db.none(query, { ...model });
//     console.log(`Item added to warehouse ${model.warehouse_id}`);
//     console.log()
//     return respond;
//   } catch (error) {
//     console.log(`failed adding new item ${error}`);
//     return ({ error: `DB error` });
//   }
// }

// export const update_item_service = async (model: Item) => {
//   console.log(`Update item ${model.id}`);
//   try {
//     const query = `UPDATE items
//                     SET name=$<name>,
//                     barcode=$<barcode>,
//                     cates_id=$<cates_id>,
//                     first_entery=$<first_entery>,
//                     date=$<date>,
//                     exchange=$<exchange>,
//                     price=$<price>,
//                     note=$<note>,
//                     current=$<current>
//                     WHERE id = $<id>`;


//     // const q2 = `UPDATE items SET current = (SELECT current FROM items WHERE id = $<id>) - ($<removed> - (SELECT removed FROM items WHERE id=$<id>)) WHERE id = $<id>`;
//     // first update items then borrows
//     // await db.any(q2, { ...model });

//     // const q3 = `UPDATE items SET current = (SELECT current FROM items WHERE id = $<id>) - ((SELECT added From items WHERE id=$<id>) - $<added>) WHERE id = $<id>`;
//     // first update items then borrows
//     // await db.any(q3, { ...model });

//     // const q4 = `UPDATE items SET current = (SELECT current FROM items WHERE id = $<id>) - ((SELECT first_entery From items WHERE id=$<id>) - $<first_entery>) WHERE id = $<id>`;
//     // first update items then borrows
//     // await db.any(q4, { ...model });

//     console.log(`Item has been updated ${model.id}`);
//     console.log()

//     const respond = await db.none(query, { ...model });
//     return respond;
//   } catch (error) {
//     console.log(`failed updating item ${error}`);
//     return ({ error: `DB error` });
//   }
// }

// export const update_removed_amount_service = async (id: number, removed: number) => {
//   console.log(`Update damaged amount for item ${id}`);
//   try {
//     const query = `UPDATE items
//                     SET removed=$<removed>
//                     WHERE id = $<id>`;

//     console.log(`Damaged amount has been updated ${id}`);
//     console.log()

//     const respond = await db.none(query, { id, removed });
//     return respond;
//   } catch (error) {
//     console.log(`failed updating damaged amount ${error}`);
//     return ({ error: `DB error` });
//   }
// }

// export const clean_damaged_goods_service = async (id: number, removed: number) => {
//   console.log(`Update damaged amount for item ${id}`);
//   try {
//     const query = `UPDATE items
//                     SET removed=0,
//                     current = (select current from items where id=$<id>) - $<removed>
//                     WHERE id = $<id>`;

//     console.log(`Damaged amount has been updated ${id}`);
//     console.log()

//     const respond = await db.none(query, { id, removed });
//     return respond;
//   } catch (error) {
//     console.log(`failed updating damaged amount ${error}`);
//     return ({ error: `DB error` });
//   }
// }

// export const move_changed_to_damaged_service = async (id: number, changed: number, damaged: number) => {
//   console.log(`Update damaged and changed items for item ${id}`);
//   try {
//     const query = `UPDATE items
//                     SET removed=$<damaged>,
//                     changed=$<changed>
//                     WHERE id = $<id>`;

//     console.log(`Damaged and changed have been updated ${id}`);
//     console.log()

//     const respond = await db.none(query, { id, changed, damaged });
//     return respond;
//   } catch (error) {
//     console.log(`failed updating damaged amount ${error}`);
//     return ({ error: `DB error` });
//   }
// }

// export const remove_item_service = async (id: number) => {
//   console.log(`Deleting item ${id}`);
//   try {
//     const query = `DELETE FROM items
//                     WHERE id = $<id>`;
//     const respond = await db.none(query, { id });
//     return respond;
//   } catch (error) {
//     console.log(`failed at deleting a project ${error}`);
//     return ({ error: `DB error` });
//   }
// }
