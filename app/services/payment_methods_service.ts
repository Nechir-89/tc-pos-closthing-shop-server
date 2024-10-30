import { db } from "../database/db";
import { User } from "../../types/user.types";
const bcrypt = require('bcryptjs');
// import bcrypt from 'bcryptjs'

export const get_service = async () => {
  console.log(`Looking all payment methods...`);
  try {
    const respond = await db.any(`SELECT * FROM ${process.env.DB_SCHEMA}.payment_methods ORDER BY active DESC`);
    console.log(`Passed: all payment methods found`);
    return respond;
  } catch (error) {
    console.log(`Failed: Looking all payment methods ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const active_service = async () => {
  console.log(`Looking active payment methods...`)
  try {
    const respond = await db.any(`SELECT * FROM ${process.env.DB_SCHEMA}.payment_methods 
                                    WHERE active=true`);
    console.log(`Passed: found active payment methods`);
    return respond;
  } catch (error) {
    console.log(`Failed: Looking active payment methods ==> ${error}`);
    return ({ error: `DB error` });
  }
}


export const add_service = async (name: string, def: boolean, active: boolean) => {
  console.log(`Adding new payment method ${name}...`)
  try {
    const query = `INSERT INTO ${process.env.DB_SCHEMA}.payment_methods (payment_method_name, def, active) 
                    VALUES($<name>, $<def>, $<active>) 
                    RETURNING payment_method_id`;
    const respond = await db.one(query, { name, def, active });
    return respond;
  } catch (error) {
    console.log(`Failed: adding new payment method ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const toggle_service = async (payment_method_id: number, active: boolean) => {
  console.log(`Setting payment method id (${payment_method_id}) to ${active}...`)

  try {
    const query = `UPDATE ${process.env.DB_SCHEMA}.payment_methods 
                    SET active=$<active> 
                    WHERE payment_method_id = $<payment_method_id> 
                    RETURNING payment_method_id`

    const respond = await db.one(query, { payment_method_id, active });
    console.log(`Passed: payment method (${payment_method_id}) set to ${active}`)
    return respond;
  } catch (error) {
    console.log(`Failed: setting payment method id to ${active} ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const default_service = async (payment_method_id: number) => {
  console.log(`Setting ${payment_method_id} default...`)
  try {
    const query = `UPDATE ${process.env.DB_SCHEMA}.payment_methods 
                    SET def=false`;
    await db.none(query)

    const query2 = `UPDATE ${process.env.DB_SCHEMA}.payment_methods 
                    SET def=true 
                    WHERE payment_method_id = $<payment_method_id> 
                    RETURNING payment_method_id`
    const respond = await db.one(query2, { payment_method_id })
    console.log(`Passed: payment method (${payment_method_id}) set to default`)
    return respond;
  } catch (error) {
    console.log(`Failed: setting payment method (${payment_method_id}) to default ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const change_name_service = async (payment_method_id: number, payment_method_name: string) => {
  console.log(`Updating payment method name...`)

  try {
    const query = `UPDATE ${process.env.DB_SCHEMA}.payment_methods 
                    SET payment_method_name = $<payment_method_name>
                    WHERE payment_method_id = $<payment_method_id> 
                    RETURNING payment_method_id`;
    const respond = await db.one(query, { payment_method_id, payment_method_name});

    console.log(`Passed: payment method name changed to ${payment_method_name}`)
    return respond;
  } catch (error) {
    console.log(`Failed: changing payment method name ==> ${error}`);
    return ({ error: `DB error` });
  }
}
