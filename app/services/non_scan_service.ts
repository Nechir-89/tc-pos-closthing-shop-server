import { db } from "../database/db";
import { search_last_stock_by_item_id_service } from "./general_queries_service";

export const get_all_categories_for_non_scaned_items_service = async () => {
  console.log(`Geting all categories for non scaned items`)
  try {
    const query = `SELECT DISTINCT categories.* 
                    FROM ${process.env.DB_SCHEMA}.stocking, 
                          ${process.env.DB_SCHEMA}.items, 
                          ${process.env.DB_SCHEMA}.categories 
                    WHERE stocking.item_id = items.item_id 
                          AND items.category_id = categories.category_id 
                          AND stocking.pc_barcode = ''  
                          AND stocking.barcode = '' `;
    const resp = await db.any(query)
    console.log(`Passed: found all categories for non scaned items`)
    return resp;
  } catch (error) {
    console.log(`Failed: finding all categories for non scaned items ==> ${error}`);
    return ({ error: `DB error` });
  }
}


export const search_non_scan_items_based_category_id_service = async (cat_id: number) => {
  console.log(`Looking non scan items based on category id ${cat_id}`);
  try {
    const query = `select items.item_id 

                    from ${process.env.DB_SCHEMA}.items, 
                          ${process.env.DB_SCHEMA}.categories, 
                          ${process.env.DB_SCHEMA}.stocking 

                    Where stocking.item_id = items.item_id 
                            and stocking.barcode = '' 
                            and stocking.pc_barcode = '' 
                            and categories.category_id = items.category_id 
                            and categories.category_id = $<cat_id> 
                    group by items.item_id `
    const result = await db.any(query, { cat_id })

    if (result && Array.isArray(result)) {
      const req = result.map(async (e) =>
        await search_last_stock_by_item_id_service(e.item_id));
      const last_stocks = Promise.all(req)
      return last_stocks;
    }
    return ({ message: `No items found for category id: ${cat_id}` });
  } catch (error) {
    console.log(`Failed: Looking last stock data ==> ${error}`);
    return ({ error: `DB error` });
  }
}
