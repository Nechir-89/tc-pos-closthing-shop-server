import { Category } from "../../types/Category.types";
import { db } from "../database/db";

export const get_categories_service = async () => {
  console.log(`Looking all categories...`);
  try {
    const query = `SELECT * FROM ${process.env.DB_SCHEMA}.categories`
    const result: Category[] | null = await db.any(query)
    console.log(`Passed: all categories found`);
    return result;
  } catch (error) {
    console.log(`Failed: Looking categories ==> ${error}`);
    return ({ error: `DB error` });
  }
}

export const add_category_service = async (name: string) => {
  console.log(`Creating new category ${name}`)
  try {
    const query = `INSERT INTO ${process.env.DB_SCHEMA}.categories (category_name) 
    VALUES($<name>)`;
    const respond = await db.none(query, { name });
    console.log(`Passed: category ${name} created`)
    return respond
  } catch (error) {
    console.log(`Failed: creating category ==> ${error}`);
    return ({ error: `DB error` });
  }
}
