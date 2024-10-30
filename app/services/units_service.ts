import { Unit } from "../../types/unit.types";
import { db } from "../database/db";

export const get_units_service = async () => {
  console.log(`Looking all units...`);
  try {
    const query = `SELECT * FROM ${process.env.DB_SCHEMA}.units`
    const result: Unit[] | null = await db.any(query)
    console.log(`Passed: all units found`);
    return result;
  } catch (error) {
    console.log(`Failed: Looking units ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const add_unit_service = async (name: string) => {
  console.log(`Creating new unit ${name}`)
  try {
    const query = `INSERT INTO ${process.env.DB_SCHEMA}.units (unit_name) 
    VALUES($<name>) RETURNING unit_id`;
    const respond = await db.one(query, { name });
    console.log(`Passed: unit ${name} created`)
    return respond
  } catch (error) {
    console.log(`Failed: creating unit ==> ${error}`);
    return ({ error: `DB error` });
  }
}
