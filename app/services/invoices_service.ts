import { Invoice, InvoiceRequestBody } from "../../types/Invoice.types";
import { StockState } from "../../types/State.types";
import { Stock } from "../../types/Stock.types";
import { db } from "../database/db";
import {
  get_nonzero_stock_states_by_item_id_service,
  get_stock_states_by_item_id_service,
} from "./states_service";
import { get_stock_by_stocking_id_service } from "./stocks_service";

export const insert_invoice_service: any = async (invoice: Invoice) => {
  console.log(`Inserting invoice...`);
  try {
    const query = `INSERT INTO ${process.env.DB_SCHEMA}.invoices(
                    invoice_date, paid_price, user_id, payment_method_id, 
                    gifted_amount, invoice_price, invoice_cost, invoice_type) 
                    VALUES ($<invoice_date>, $<paid_price>, $<user_id>, 
                    $<payment_method_id>, $<gifted_amount>, $<invoice_price>, 
                    $<invoice_cost>, $<invoice_type>) RETURNING invoice_id`;
    const resp = await db.one(query, invoice);
    console.log(`Passed: invoice inserted`);
    return resp;
  } catch (error) {
    console.log(`Failed: inserting invoice ==> ${error}`);
    return { error: `DB error` };
  }
};

export const add_invoice_and_items_service = async (
  model: InvoiceRequestBody
) => {
  console.log(`Adding invoice and items`);
  try {
    // insert invoice
    const resp = await insert_invoice_service({
      invoice_cost: model.invoice_cost, 
      invoice_date: model.invoice_date,
      invoice_price: model.invoice_price, // total price or returned money
      // if this is a returned invoice (paid_price column) will represent returned money to customer
      paid_price: model.paid_price, // or returned money to customer when invoice is return
      user_id: model.user_id,
      gifted_amount: model.gifted_amount, // this fiels will represent cut_amount if it is return invoice
      payment_method_id: model.payment_method_id,
      invoice_type: model.invoice_type,
    });

    // for invoice of type sale
    if (resp?.invoice_id && model.invoice_type === "sale") {
      model.items.forEach(async (item) => {
        // step 1: add invoice item
        const query = `INSERT INTO ${process.env.DB_SCHEMA}.invoice_items(
                        invoice_id, item_id, quantity, total_price, 
                        total_cost, cost, price) 
                        VALUES ($<invoice_id>, $<item_id>, 
                        $<quantity>, $<total_price>, $<total_cost>,
                        $<cost>, $<price>) 
                        RETURNING invoice_item_id`;
        try {
          const invoiceItemResp = await db.one(query, {
            invoice_id: resp?.invoice_id,
            ...item,
          });
          console.log(
            `Passed: invoice item ${invoiceItemResp?.invoice_item_id} added `
          );
        } catch (err) {
          console.log(`Failed: failed adding invoice item ==> ${err}`);
          return { error: `DB error` };
        }
        // step 2: update item state
        try {
          const itemState = await db.one(
            `SELECT total_available_pcs 
                                            FROM ${process.env.DB_SCHEMA}.items_state 
                                            WHERE item_id = $<item_id> 
                                            `,
            { item_id: item.item_id }
          );
          let tap; // tap => total available pcs
          if (itemState) {
            tap = itemState?.total_available_pcs - item.quantity;
            try {
              await db.none(
                `UPDATE ${process.env.DB_SCHEMA}.items_state 
                  SET total_available_pcs = $<tap> 
                  WHERE item_id = $<item_id>`,
                {
                  item_id: item.item_id,
                  tap: tap,
                }
              );

              console.log(`Passed: item state successfully updated`);
            } catch (err) {
              console.log(
                `Failed: updating item state for item ${item.item_id} ==> ${err}`
              );
              return { error: `DB error` };
            }
          } else {
            console.log(
              `Failed: fetching item't total available units and pcs ${itemState}`
            );
            return { error: `DB error` };
          }
        } catch (error) {
          console.log(
            `Failed: fetching total available pcs for item ==> ${error}`
          );
          return { error: `DB error` };
        }

        // step 3: update stock state
        try {
          const stockStatesRes =
            await get_nonzero_stock_states_by_item_id_service(item.item_id);

          let stopFlag = false;
          let index = 0;

          if (Array.isArray(stockStatesRes)) {
            let newQuantity = 0;
            while (!stopFlag && index < stockStatesRes.length) {
              const state: StockState = stockStatesRes[index];

              let diff = 0;
              if (index == 0) diff = state.current_pcs - item.quantity;
              else diff = state.current_pcs + newQuantity;

              if (diff >= 0) {
                const pcs = diff;
                // const units = Number(Math.floor(pcs / item.pcs_per_unit) + '.' + (pcs % item.pcs_per_unit))
                // const units = pcs / item.pcs_per_unit

                const updateStateQuery = `UPDATE ${process.env.DB_SCHEMA}.stocks_state 
                    SET current_pcs = $<pcs> 
                    WHERE state_id = $<state_id> RETURNING stocking_id`;

                try {
                  const updateStateResp = await db.one(updateStateQuery, {
                    pcs,
                    state_id: state.state_id,
                  });
                  console.log(
                    `Passed: stock state updated for stocking id ${updateStateResp?.stocking_id}`
                  );
                } catch (error) {
                  console.log(`Failed: updating stock state for 
                    item ${item.item_id} and state id ${state.state_id} ==> ${error}`);
                  return { error: `DB error` };
                }
                stopFlag = true;
              } else {
                index = index + 1;
                // const units = 0
                const pcs = 0;
                const updateStateQuery = `UPDATE ${process.env.DB_SCHEMA}.stocks_state 
                    SET current_pcs = $<pcs> 
                    WHERE state_id = $<state_id> RETURNING stocking_id`;
                try {
                  const updateStateResp = await db.one(updateStateQuery, {
                    pcs,
                    state_id: state.state_id,
                  });
                  console.log(
                    `Passed: stock state updated for stocking id ${updateStateResp?.stocking_id}`
                  );
                  newQuantity = diff;
                } catch (error) {
                  console.log(`Failed: updating stock state for 
                    item ${item.item_id} and state id ${state.state_id} ==> ${error}`);
                  return { error: `DB error` };
                }
              }
            }
          }
        } catch (error) {
          console.log(
            `Failed: fetching non zero stock states for item ${item.item_id} ==> ${error}`
          );
          return { error: `DB error` };
        }
      });
      console.log(`Passed: invoice and invoice items have been added.`);
    }
    // for invoice of type return
    else if (resp?.invoice_id && model.invoice_type === "return") {
      model.items.forEach(async (item) => {
        // step 1: add invoice item
        const query = `INSERT INTO ${process.env.DB_SCHEMA}.invoice_items(
                        invoice_id, item_id, quantity, total_price, 
                        total_cost, cost, price) 
                        VALUES ($<invoice_id>, $<item_id>, 
                        $<quantity>, $<total_price>, $<total_cost>,
                        $<cost>, $<price>) 
                        RETURNING invoice_item_id`;
        try {
          const invoiceItemResp = await db.one(query, {
            invoice_id: resp?.invoice_id,
            ...item,
          });
          console.log(
            `Passed: invoice item ${invoiceItemResp?.invoice_item_id} added `
          );
        } catch (err) {
          console.log(`Failed: failed adding invoice item ==> ${err}`);
          return { error: `DB error` };
        }
        /*
          amount in pcs from all stocking rows for an item 
          must be greater or equal to 
          total available pcs for the item 
          plus returned quantity
          
          total_amount_in_pcs >= (total available pcs + returned quantity)
        */
        // step 2: update item state
        let itemState;
        try {
          const totalItemPcsQuery = `SELECT item_id, SUM(amount_in_pcs) as total_amount_in_pcs 
                                    FROM ${process.env.DB_SCHEMA}.stocking 
                                    WHERE item_id = $<item_id> 
                                    GROUP BY item_id `;
          itemState = await db.one(totalItemPcsQuery, {
            item_id: item.item_id,
          });
          const totalAvailablePcsQuery = await db.one(
            `SELECT total_available_pcs 
                                            FROM ${process.env.DB_SCHEMA}.items_state 
                                            WHERE item_id = $<item_id> `,
            { item_id: item.item_id }
          );
          if (itemState && totalAvailablePcsQuery) {
            const newTotalAvailablePcs =
              totalAvailablePcsQuery.total_available_pcs + item.quantity;
            if (newTotalAvailablePcs <= itemState.total_amount_in_pcs) {
              // update total available pcs
              try {
                await db.none(
                  `UPDATE ${process.env.DB_SCHEMA}.items_state SET total_available_pcs = $<tap> 
                  WHERE item_id = $<item_id>`,
                  { item_id: item.item_id, tap: newTotalAvailablePcs }
                );
                console.log(
                  `Passed: total available pcs successfully updated for item ${item.item_id}`
                );
              } catch (error) {
                console.log(
                  `Failed: updating total available pcs for item ${item.item_id} ==> ${error}`
                );
                return { error: `DB error` };
              }
            }
          } else {
            console.log(
              "Error: item state or total available pcs is unknown inorder to update Total Available Pcs"
            );
            return { error: "DB error" };
          }
        } catch (error) {
          console.log(
            `Failed: fetching total available pcs for item ==> ${error}`
          );
          return { error: `DB error` };
        }

        //step 3: update current_pcs for each stocks_state
        try {
          const stockStatesRes = await get_stock_states_by_item_id_service(
            item.item_id
          );

          let stopFlag = false;
          let index = 0;

          if (Array.isArray(stockStatesRes)) {
            let newQuantity = 0;
            while (!stopFlag && index < stockStatesRes.length) {
              const stockState: StockState = stockStatesRes[index];
              let sum = 0;

              if (index === 0) sum = stockState.current_pcs + item.quantity;
              else sum = stockState.current_pcs + newQuantity; // 1cp + 5nq = sum6  (amount_in_pc=3)

              try {
                const stock: Stock | any =
                  await get_stock_by_stocking_id_service(
                    stockState.stocking_id
                  );

                if (stock) {
                  if (sum <= stock.amount_in_pcs) {
                    const updateStateQuery = `UPDATE ${process.env.DB_SCHEMA}.stocks_state SET current_pcs = $<sum> 
                                              WHERE state_id = $<state_id> RETURNING stocking_id`;
                    try {
                      const updateStateResp = await db.one(updateStateQuery, {
                        state_id: stockState.state_id,
                        sum,
                      });
                      console.log(
                        `Passed: stock state updated for stocking id ${updateStateResp?.stocking_id}`
                      );
                    } catch (error) {
                      console.log(
                        `Failed: updating stock state for item ${item.item_id} and state id ${stockState.state_id} ==> ${error}`
                      );
                      return { error: `DB error` };
                    }

                    stopFlag = true;
                  } else {
                    const updateStateQuery = `UPDATE ${process.env.DB_SCHEMA}.stocks_state SET current_pcs = $<amount_in_pcs> 
                                              WHERE state_id = $<state_id> RETURNING stocking_id`;
                    try {
                      const updateStateResp = await db.one(updateStateQuery, {
                        state_id: stockState.state_id,
                        amount_in_pcs: stock.amount_in_pcs,
                      });
                      console.log(
                        `Passed: stock state updated for stocking id ${updateStateResp?.stocking_id}`
                      );
                    } catch (error) {
                      console.log(
                        `Failed: updating stock state for item ${item.item_id} and state id ${stockState.state_id} ==> ${error}`
                      );
                      return { error: `DB error` };
                    }

                    index = index + 1;
                    newQuantity = sum - stock.amount_in_pcs;
                  }
                }
              } catch (error) {
                console.log(
                  `Failed: updating stock state for item ${item.item_id} and state id ${stockState.state_id} ==> ${error}`
                );
                return { error: "DB error" };
              }
            }
          }
        } catch (error) {
          console.log(
            `Failed: fetching all stock states for item ${item.item_id} ==> ${error}`
          );
          return { error: `DB error` };
        }
      });
    }

    console.log("Passed: invoice and invoice items have been added");
    return resp;
  } catch (error) {
    console.log(`Failed: adding invoice ==> ${error}`);
    return { error: `DB error` };
  }
};

export const get_invoice_documents_service = async () => {
  console.log("Getting all invoice documents");
  try {
    const query = `SELECT invoices.*, invoice_items.*, 
                          items.item_name, units.unit_name, 
                          pcs_units.pc_unit_name 
                    FROM  ${process.env.DB_SCHEMA}.invoices, 
                          ${process.env.DB_SCHEMA}.invoice_items, 
                          ${process.env.DB_SCHEMA}.items, 
                          ${process.env.DB_SCHEMA}.units, 
                          ${process.env.DB_SCHEMA}.pcs_units 
                    WHERE invoices.invoice_id = invoice_items.invoice_id 
                        AND invoice_items.item_id = items.item_id 
                        AND items.unit_id = units.unit_id  
                        AND items.pc_unit_id = pcs_units.pc_unit_id 
                        
                    ORDER BY invoices.invoice_id DESC`;
    const response = await db.any(query);
    return response;
  } catch (error) {
    console.log(`Failed: getting all invoice documents ==> ${error}`);
    return { error: `DB error` };
  }
};

export const get_invoice_document_by_offset_service = async (
  offset: number
) => {
  console.log(`Getting invoice document by offset ${offset}`);
  try {
    const query = `SELECT invoices.*, invoice_items.*, 
                          items.item_name 
                    FROM ${process.env.DB_SCHEMA}.invoices, ${process.env.DB_SCHEMA}.invoice_items, 
                          ${process.env.DB_SCHEMA}.items 
                    WHERE invoice_items.item_id = items.item_id 
                          AND invoices.invoice_id = invoice_items.invoice_id 
                          AND invoice_items.invoice_id = (
                                        SELECT invoices.invoice_id 
                                        FROM ${process.env.DB_SCHEMA}.invoices 
                                        ORDER BY invoice_id DESC 
                                        LIMIT 1 OFFSET $<offset>) `;

    const response = await db.any(query, { offset });
    console.log(`Passed: found invoice document of offset ${offset}`);
    return response;
  } catch (error) {
    console.log(`Failed: getting invoice document by offset ==> ${error}`);
    return { error: `DB error` };
  }
};

export const get_invoice_document_by_invoice_id_service = async (
  invoice_id: number
) => {
  console.log(`Getting invoice document by invoice id ${invoice_id}`);
  try {
    const query = `SELECT invoices.*, invoice_items.*, 
                          items.item_name 
                    FROM ${process.env.DB_SCHEMA}.invoices, ${process.env.DB_SCHEMA}.invoice_items, 
                          ${process.env.DB_SCHEMA}.items 
                    WHERE invoice_items.item_id = items.item_id 
                          AND invoices.invoice_id = invoice_items.invoice_id 
                          AND invoice_items.invoice_id = $<invoice_id>

                    ORDER BY invoices.invoice_id DESC `;
    const response = await db.any(query, { invoice_id });
    console.log(`Passed: found invoice document of id ${invoice_id}`);
    return response;
  } catch (error) {
    console.log(`Failed: getting invoice document by invoice id ==> ${error}`);
    return { error: `DB error` };
  }
};

export const total_profit_service = async () => {
  console.log(`Getting total of profit from beginnign to this moment`);
  try {
    const query = `SELECT COUNT(*), SUM(paid_price) as total_price, 
                    SUM(invoice_cost) as total_cost, SUM(gifted_amount) as total_gifted  
                    FROM ${process.env.DB_SCHEMA}.invoices WHERE invoice_type='sale'`;
    const response = await db.one(query);
    console.log(`Passed: found sum of total price and total cost`);
    return response;
  } catch (error) {
    console.log(
      `Failed: getting total of profit from beginnign to this moment ==> ${error}`
    );
    return { error: `DB error` };
  }
};

export const total_profit_for_today_service = async () => {
  console.log(`Getting total of profit for today`);
  try {
    const query = `SELECT COUNT(*), SUM(paid_price) as total_price, 
                    SUM(invoice_cost) as total_cost, SUM(gifted_amount) as total_gifted 
                    FROM ${process.env.DB_SCHEMA}.invoices 
                    WHERE invoice_date > CURRENT_DATE 
                    AND invoice_type='sale'`;
    const response = await db.one(query);
    console.log(`Passed: found sum of total price and total cost for today`);
    return response;
  } catch (error) {
    console.log(`Failed: getting total of profit for today ==> ${error}`);
    return { error: `DB error` };
  }
};

export const total_profit_for_last_week_service = async () => {
  console.log(`Getting total of profit for last week`);
  try {
    const query = `SELECT COUNT(*), SUM(paid_price) as total_price, 
                    SUM(invoice_cost) as total_cost, SUM(gifted_amount) as total_gifted 
                    FROM ${process.env.DB_SCHEMA}.invoices 
                    WHERE invoice_date > (CURRENT_DATE - 7) 
                    AND invoice_type='sale'`;
    const response = await db.one(query);
    console.log(
      `Passed: found sum of total price and total cost for last week`
    );
    return response;
  } catch (error) {
    console.log(`Failed: getting total of profit for last week ==> ${error}`);
    return { error: `DB error` };
  }
};

export const total_profit_for_last_month_service = async () => {
  console.log(`Getting total of profit for last month`);
  try {
    const query = `SELECT COUNT(*), SUM(paid_price) as total_price, 
                    SUM(invoice_cost) as total_cost, SUM(gifted_amount) as total_gifted 
                    FROM ${process.env.DB_SCHEMA}.invoices 
                    WHERE invoice_date > (CURRENT_DATE - 30) 
                    AND invoice_type='sale'`;
    const response = await db.one(query);
    console.log(
      `Passed: found sum of total price and total cost for last month`
    );
    return response;
  } catch (error) {
    console.log(`Failed: getting total of profit for last month ==> ${error}`);
    return { error: `DB error` };
  }
};
