import { db } from "../database/db";

export const get_sowtare_registration_details_service = async () => {
  console.log(`Fetching for software registration details...`);
  try {
    const query = `SELECT * FROM ${process.env.DB_SCHEMA}.software_registration`;
    const result = await db.one(query);
    console.log(`Success: Software registration details found`);
    return result;
  } catch (error) {
    console.log(`Failed: fetching software registration details ==> ${error}`);
    return { error: `DB error` };
  }
};
