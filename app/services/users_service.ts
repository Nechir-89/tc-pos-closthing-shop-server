import { db } from "../database/db";
import { User } from "../../types/user.types";
const bcrypt = require('bcryptjs');
// import bcrypt from 'bcryptjs'

export const get_users_service = async () => {
  console.log(`Looking all users...`);
  try {
    const respond = await db.any(`SELECT * FROM ${process.env.DB_SCHEMA}.users`);
    console.log(`Passed: all users found`);
    return respond;
  } catch (error) {
    console.log(`Failed: Looking users ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const get_user_service = async (user_id: number) => {
  console.log(`Looking user id: ${user_id}`)
  try {
    const query = `SELECT * FROM ${process.env.DB_SCHEMA}.users WHERE user_id = $<user_id>`;
    const respond: User | null = await db.oneOrNone(query, { user_id });

    if (respond?.user_name)
      console.log(`Passed: user found`);
    else
      console.log(`Passed: found no user with user id ${user_id}`)

    return respond;
  } catch (error) {
    console.log(`Failed: Looking user ==> ${error}`);
    return ({ error: `DB error` });
  }
}


export const get_user_by_name_service = async (user_name: string) => {
  console.log(`Looking user ${user_name}`)
  try {
    const query = `SELECT * FROM ${process.env.DB_SCHEMA}.users WHERE user_name = $<user_name>`;
    const respond: User | null = await db.oneOrNone(query, { user_name });

    if (respond?.user_name)
      console.log(`Passed: user found`);
    else
      console.log(`Passed: found no user with user name ${user_name}`)

    return respond;
  } catch (error) {
    console.log(`Failed: looking user ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const add_user_service = async (user: Omit<User, 'user_id'>) => {
  console.log(`Creating new user ${user.user_name}`)
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.passcode, salt);
  user.passcode = hashedPassword;

  try {
    const query = `INSERT INTO ${process.env.DB_SCHEMA}.users (user_name, role, passcode) 
    VALUES($<user_name>, $<role>, $<passcode>)`;
    const respond: null = await db.none(query, { ...user });
    console.log(`Passed: user ${user.user_name} created`)
    return respond;
  } catch (error) {
    console.log(`Failed: creating user ==> ${error}`);
    return ({ error: `DB error` });
  }
}

// export const add_return_service = async (model: Omit<Return, "id">) => {
//   console.log(`Add new return for: ${model.employee_id}`);
//   try {
//     const query = `INSERT INTO returns (employee_id,item_id,returned_amount,date, note, username, barcode)
//                     VALUES ($<employee_id>,$<item_id>,$<returned_amount>,$<date>,$<note>,$<username>,$<barcode>)`
//     const q2 = `
//                     UPDATE items
//                     SET returned = $<returned_amount> + (SELECT returned FROM items WHERE id = $<item_id>),
//                         current = (SELECT current FROM items WHERE id = $<item_id>) + $<returned_amount>
//                     WHERE id = $<item_id>
//                   `;

//     await db.any(q2, { ...model });
//     const respond = await db.any(query, { ...model });
//     return respond;
//   } catch (error) {
//     console.log(`failed adding a return ${error}`);
//     return ({ error: `DB error` });
//   }
// }

// export const update_return_service = async (model: Return) => {
//   console.log(`Updating return ${model.id}`);
//   try {
//     const query = `UPDATE returns 
//                     SET employee_id = $<employee_id>, item_id = $<item_id>,
//                     returned_amount = $<returned_amount>, date = $<date>, note = $<note>
//                     WHERE id = $<id>`;
//     // returned = returned - oldamount + newAmount
//     // current = current + oldamount + newAmount  90 + 5 - 
//     const q2 = `
//     UPDATE items
//     SET returned = (SELECT returned FROM items WHERE id = $<item_id>) - (SELECT returned_amount From returns WHERE id=$<id>) + $<returned_amount>,
//         current = (SELECT current FROM items WHERE id = $<item_id>) - ((SELECT returned_amount From returns WHERE id=$<id>) - $<returned_amount>)
//     WHERE id = $<item_id>
//   `;
//     // first update items then borrows
//     await db.any(q2, { ...model });
//     const respond = await db.none(query, { ...model });
//     return respond;
//   } catch (error) {
//     console.log(`failed updating a return ${error}`);
//     return ({ error: `DB error` });
//   }
// }

// export const remove_return_service = async (id: number, item_id: number, returned_amount: number) => {
//   console.log(`Deleting return ${id}`);
//   try {
//     const query = `DELETE FROM returns WHERE id = $<id>`;
//     const q2 = `
//     UPDATE items
//     SET returned = (SELECT returned FROM items WHERE id = $<item_id>) - $<returned_amount>,
//         current = (SELECT current FROM items WHERE id = $<item_id>) - $<returned_amount>
//     WHERE id = $<item_id>
//   `;
//     // first update items then borrows
//     await db.any(q2, { item_id, returned_amount });
//     const respond = await db.none(query, { id });
//     return respond;
//   } catch (error) {
//     console.log(`failed deleting a return ${error}`);
//     return ({ error: `DB error` });
//   }
// }


// export const returned_documents_for_warehouse_service = async (warehouse_id: number) => {
//   console.log(`Getting borrow documents for warehouse ${warehouse_id}`)
//   try {
//     const q = `SELECT returns.*, 
//                 items.name as item_name, items.cates_id, items.warehouse_id, items.inuse, items.current, items.returned, 
//                 cates.name as cates_name, cates.unit_type, 
//                 employees.name as employee_name, 
//                 warehouse.name as warehouse_name 
//                 FROM returns, items, cates, employees, warehouse 
//                 WHERE returns.item_id = items.id 
//                 and items.cates_id = cates.id 
//                 and items.warehouse_id = warehouse.id 
//                 and items.warehouse_id = $<warehouse_id>  
//                 and returns.employee_id = employees.id`
//     const documents = await db.any(q, { warehouse_id });
//     return documents;
//   } catch (error) {
//     console.log(`failed getting borrow documents ${error}`);
//     return ({ error: `DB error` });
//   }
// }
