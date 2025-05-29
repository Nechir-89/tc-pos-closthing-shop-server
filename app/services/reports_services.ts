// import { RequestHandler, Response } from "express";
import { db } from "../database/db";

export const get_reports_service = async () => {
  try {
    const respond = await db.any(`SELECT * 
        FROM ${process.env.DB_SCHEMA}.reports 
        ORDER BY report_id DESC`);

    console.log(`Passed: all reports found`);
    return respond;
  } catch (error) {
    console.log(`Failed: finding all reports ==> ${error}`);
    return { error: `DB error` };
  }
};

export const get_reports_expenses_service = async (reportId: number) => {
  try {
    const respond = await db.any(
      `SELECT * 
        FROM ${process.env.DB_SCHEMA}.expenses
        WHERE report_id = $<reportId> 
        ORDER BY id DESC`,
      { reportId }
    );

    console.log(`Passed: report expenses found`);
    return respond;
  } catch (error) {
    console.log(`Failed: finding report expenses ==> ${error}`);
    return { error: `DB error` };
  }
};

export const get_report_documents_service = async () => {
  try {
    const respond = await db.any(`SELECT * 
        FROM ${process.env.DB_SCHEMA}.reports, ${process.env.DB_SCHEMA}.expenses
        WHERE reports.report_id = expenses.report_id 
        ORDER BY reports.report_id DESC`);

    console.log(`Passed: all report documents found`);
    return respond;
  } catch (error) {
    console.log(`Failed: finding all report documents ==> ${error}`);
    return { error: `DB error` };
  }
};

export const search_report_documents_service = async (title: string) => {
  try {
    const respond = await db.any(
      `SELECT r.*, e.title as expense_title, e.description as expense_description, e.amount as expense_amount 
        FROM ${process.env.DB_SCHEMA}.reports r, ${process.env.DB_SCHEMA}.expenses e 
        WHERE r.title LIKE '%' || $<title> || '%' and r.report_id = e.report_id 
        ORDER BY r.report_id DESC`,
      { title }
    );

    console.log(`Passed: all report documents found`);
    return respond;
  } catch (error) {
    console.log(`Failed: finding all report documents ==> ${error}`);
    return { error: `DB error` };
  }
};

export const search_report_service = async (title: string) => {
  try {
    const respond = await db.any(
      `SELECT * 
        FROM ${process.env.DB_SCHEMA}.reports 
        WHERE title LIKE '%' || $<title> || '%' 
        ORDER BY report_id DESC`,
      { title }
    );

    console.log(`Passed: all report documents found`);
    return respond;
  } catch (error) {
    console.log(`Failed: finding all report documents ==> ${error}`);
    return { error: `DB error` };
  }
};

export const get_report_with_id_service = async (report_id: number) => {
  try {
    const respond = await db.one(
      `SELECT * 
        FROM ${process.env.DB_SCHEMA}.reports 
        WHERE report_id = $<report_id>`,
      { report_id }
    );

    console.log(`Passed: report found`);
    return respond;
  } catch (error) {
    console.log(`Failed: finding report with ID ==> ${error}`);
    return { error: `DB error` };
  }
};

export const get_report_document_by_id_service = async (report_id: number) => {
  try {
    const respond = await db.one(
      `SELECT * 
        FROM ${process.env.DB_SCHEMA}.reports r, ${process.env.DB_SCHEMA}.expenses  
        WHERE r.report_id = $<report_id>`,
      { report_id }
    );

    console.log(`Passed: report document found`);
    return respond;
  } catch (error) {
    console.log(`Failed: finding report document by ID ==> ${error}`);
    return { error: `DB error` };
  }
};

export const get_report_with_name_service = async (report_name: string) => {
  try {
    const respond = await db.any(
      `SELECT * 
        FROM ${process.env.DB_SCHEMA}.reports  
        WHERE title = $<report_name>`,
      { report_name }
    );

    console.log(`Passed: report found`);
    return respond;
  } catch (error) {
    console.log(`Failed: finding report ==> ${error}`);
    return { error: `DB error` };
  }
};

export const get_report_document_by_name_service = async (
  report_name: string
) => {
  try {
    const respond = await db.any(
      `SELECT * 
        FROM ${process.env.DB_SCHEMA}.reports r, ${process.env.DB_SCHEMA}.expenses  
        WHERE r.title = $<report_name>`,
      { report_name }
    );

    console.log(`Passed: report found`);
    return respond;
  } catch (error) {
    console.log(`Failed: finding report ==> ${error}`);
    return { error: `DB error` };
  }
};

export const create_report_service = async (
  title: string,
  description: string,
  start_date: string,
  end_date: string,
  note: string,
  sum_of_expenses: number
) => {
  try {
    const respond = await db.one(
      `SELECT * 
        FROM ${process.env.DB_SCHEMA}.create_report(
        $<start_date>, $<end_date>, $<title>, $<description>, $<note>, $<sum_of_expenses>
        ) 
        `,
      { start_date, end_date, title, description, note, sum_of_expenses }
    );

    console.log(`Passed: report created`);
    return respond;
  } catch (error) {
    console.log(`Failed: creating report ==> ${error}`);
    return { error: `DB error` };
  }
};

export const update_report_service = async (
  title: string,
  description: string,
  notes: string,
  sum_of_expenses: number,
  reportId: number
) => {
  //! send two requests separetly for updating report one for updating report and another for updating expenses
  try {
    const respond = await db.none(
      `UPDATE ${process.env.DB_SCHEMA}.reports 
        SET title = $<title>, description = $<description>, notes = $<notes>, sum_of_expenses = $<sum_of_expenses> 
        WHERE report_id = $<reportId>
        `,
      { title, description, notes, sum_of_expenses, reportId }
    );

    console.log(`Passed: report updated`);
    return respond;
  } catch (error) {
    console.log(`Failed: updating report ==> ${error}`);
    return { error: `DB error` };
  }
};

export const create_expense_service = async (
  title: string,
  description: string,
  amount: number,
  reportId: number
) => {
  // console.log("reportId", reportId);
  try {
    const respond = await db.none(
      `insert into ${process.env.DB_SCHEMA}.expenses(report_id, exp_title, exp_description, exp_amount)
      VALUES ($<reportId>, $<title>, $<description>, $<amount>)`,
      { reportId, title, description, amount }
    );

    console.log(`Passed: expense created`);
    return respond;
  } catch (error) {
    console.log(`Failed: creating expense ==> ${error}`);
    return { error: `DB error` };
  }
};

export const update_expense_service = async (
  title: string,
  description: string,
  amount: number,
  expenseId: number
) => {
  try {
    const respond = await db.none(
      `UPDATE ${process.env.DB_SCHEMA}.expenses 
      SET title = $<title>, description = $<description>, amount = $<amount> 
      WHERE id=$<expenseId>`,
      { title, description, amount, expenseId }
    );

    console.log(`Passed: expense updated`);
    return respond;
  } catch (error) {
    console.log(`Failed: updating expense ==> ${error}`);
    return { error: `DB error` };
  }
};

export const delete_report_service = async (reportId: number) => {
  try {
    await db.none(
      `DELETE FROM ${process.env.DB_SCHEMA}.expenses
      WHERE report_id=$<reportId>`,
      { reportId }
    );
    await db.none(
      `DELETE FROM ${process.env.DB_SCHEMA}.reports 
      WHERE report_id=$<reportId>`,
      { reportId }
    );

    console.log(`Passed: report and expenses deleted`);
  } catch (error) {
    console.log(`Failed: deleting report and expenses ==> ${error}`);
    return { error: `DB error` };
  }
};

export const delete_expenses_service = async (expenseId: number) => {
  //! from front end send a request to update report before deleting expenses
  try {
    await db.none(
      `DELETE FROM ${process.env.DB_SCHEMA}.expense 
      WHERE id=$<expenseId>`,
      { expenseId }
    );
    console.log(`Passed: expense deleted`);
  } catch (error) {
    console.log(`Failed: deleting expense ==> ${error}`);
    return { error: `DB error` };
  }
};
