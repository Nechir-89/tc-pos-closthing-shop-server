import { Pcs } from '../../types/Pcs.types';
import { db } from '../database/db';


export const get_pcs_units_service = async () => {
  console.log(`Looking all pcs units...`);
  try {
    const query = `SELECT * FROM ${process.env.DB_SCHEMA}.pcs_units`
    const result: Pcs[] | null = await db.any(query)
    console.log(`Passed: all pcs units found`);
    return result;
  } catch (error) {
    console.log(`Failed: Looking pcs units ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const add_pc_unit_service = async (name: string) => {
  console.log(`Creating new pc unit ${name}`)
  try {
    const query = `INSERT INTO ${process.env.DB_SCHEMA}.pcs_units (pc_unit_name) 
    VALUES($<name>)`;
    const respond = await db.any(query, { name });
    console.log(`Passed: pc unit ${name} created`)
    return respond
  } catch (error) {
    console.log(`Failed: creating pc unit ==> ${error}`);
    return ({ error: `DB error` });
  }
}

