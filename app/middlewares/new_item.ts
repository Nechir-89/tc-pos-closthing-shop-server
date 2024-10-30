import { RequestHandler, Response } from "express";
import { Item } from "../../types/Item.types";
import { Stock } from "../../types/Stock.types";
import { add_item_service, delete_item_service } from "../services/items_service";
import { add_stock_service, delete_stock_service } from "../services/stocks_service";
import { StockState } from "../../types/State.types";
import { add_stock_state_service, delete_stock_state_service } from "../services/states_service";
import { ItemState } from "../../types/ItemState.types";
import { add_item_state_service } from "../services/items_state_service";

export const new_item: RequestHandler<
  never,
  Response,
  Item & Stock,
  never
> = async (req, res: Response) => {

  const itemData: Item = {
    archived: req.body.archived,
    category_id: req.body.category_id,
    item_name: req.body.item_name,
    item_note: req.body.item_note,
    pc_unit_id: req.body.pc_unit_id,
    pcs_per_unit: req.body.pcs_per_unit,
    unit_id: req.body.unit_id,
    user_id: req.body.user_id,
  }

  try {
    const item = await add_item_service(itemData)
    if (item?.item_id) {
      const stockData: Stock = {
        amount_in_units: req.body.amount_in_units,
        expire_date: req.body.expire_date,
        production_date: req.body.production_date,
        item_id: item.item_id,
        stocking_note: req.body.stocking_note,
        pc_cost: req.body.pc_cost,
        pc_price: req.body.pc_price,
        unit_cost: req.body.unit_cost,
        unit_price: req.body.unit_price,
        user_id: req.body.user_id,
        barcode: req.body.barcode,
        pc_barcode: req.body.pc_barcode,
      }

      try {
        const stock = await add_stock_service(stockData)
        if (stock?.stocking_id) {
          const stateData: StockState = {
            item_id: item.item_id,
            stocking_id: stock.stocking_id,
            current_units: stockData.amount_in_units,
            current_pcs: stockData.amount_in_units * itemData.pcs_per_unit,
            pcs_per_unit: itemData.pcs_per_unit,
            solid_units: 0,
            solid_pcs: 0,
            // total cost of sold pcs and units
            total_cost: 0,
            total_price: 0,
            approx_profit: 0,
            gifted_units: 0,
            gifted_pcs: 0,
            damaged_units: 0,
            damaged_pcs: 0,
            expired_units: 0,
            expired_pcs: 0,
            returned_units_to_supplier: 0,
            returned_pcs_to_supplier: 0
          }

          try {
            const state = await add_stock_state_service(stateData)
            if (!state.state_id) {
              // roll back and delete item and stock
              await delete_stock_service(stock.stocking_id)
              await delete_item_service(item.item_id)
              console.log(`There is an error with stock state id ${state?.state_id}`);
              res.status(500).json({ error: "Error" });
            } else {
              const itemStateData: Omit<ItemState, 'item_state_id'> = {
                item_id: item.item_id,
                total_available_pcs: stateData.current_pcs,
                total_available_units: stateData.current_units
              }
              try {
                const itemState = await add_item_state_service(itemStateData)
                if (!itemState?.item_state_id) {
                  await delete_stock_state_service(state?.state_id)
                  await delete_stock_service(stock.stocking_id)
                  await delete_item_service(item.item_id)
                  console.log(`There is an error with item state id ${itemState?.item_state_id}`);
                  res.status(500).json({ error: "Error" });
                }
                
                res.status(201).json({ message: 'New item added' });
              } catch (error) {
                console.log(`server is running into an error \n ${error}`);
                res.status(500).json({ error: "Server error" });
              }
            }
          } catch (error) {
            console.log(`server is running into an error \n ${error}`);
            res.status(500).json({ error: "Server error" });
          }
        } else {
          // roll back and delete item
          await delete_item_service(item.item_id)
          console.log(`There is an error with stocking_id ${stock?.stocking_id}`);
          res.status(500).json({ error: "Error" });
        }
      } catch (error) {
        console.log(`server is running into an error \n ${error}`);
        res.status(500).json({ error: "Server error" });
      }
    } else {
      console.log(`There is an error with item_id ${item?.item_id}`);
      res.status(500).json({ error: "Error" });
    }
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}
