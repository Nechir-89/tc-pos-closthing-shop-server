import { RequestHandler, Response } from "express";
import {
  create_expense_service,
  create_report_service,
  delete_expenses_service,
  delete_report_service,
  get_report_document_by_id_service,
  get_report_document_by_name_service,
  get_report_documents_service,
  get_report_with_id_service,
  get_report_with_name_service,
  get_reports_expenses_service,
  get_reports_service,
  search_report_documents_service,
  search_report_service,
  update_expense_service,
  update_report_service,
} from "../services/reports_services";

export const get_reports: RequestHandler<
  never,
  Response,
  never,
  never
> = async (req, res: Response) => {
  try {
    const response = await get_reports_service();
    res.status(200).json(response);
  } catch (error) {
    console.log(`server running into an error: ${error}`);
    res.status(500).json({ error: `Server error` });
  }
};

export const get_reports_expenses: RequestHandler<
  never,
  Response,
  { reportId: number },
  never
> = async (req, res: Response) => {
  try {
    const response = await get_reports_expenses_service(
      req.body.reportId as number
    );
    res.status(200).json(response);
  } catch (error) {
    console.log(`server running into an error: ${error}`);
    res.status(500).json({ error: `Server error` });
  }
};

export const get_report_documents: RequestHandler<
  never,
  Response,
  never,
  never
> = async (req, res: Response) => {
  try {
    const response = await get_report_documents_service();
    res.status(200).json(response);
  } catch (error) {
    console.log(`server running into an error: ${error}`);
    res.status(500).json({ error: `Server error` });
  }
};

export const search_report_documents: RequestHandler<
  never,
  Response,
  { title: string },
  never
> = async (req, res: Response) => {
  console.log("Searching for reports: ", req.body.title);
  try {
    const response = await search_report_documents_service(req.body.title);
    res.status(200).json(response);
  } catch (error) {
    console.log(`server running into an error: ${error}`);
    res.status(500).json({ error: `Server error` });
  }
};

export const search_reports: RequestHandler<
  never,
  Response,
  { title: string },
  never
> = async (req, res: Response) => {
  console.log("Searching for reports: ", req.body.title);
  try {
    const response = await search_report_service(req.body.title);
    res.status(200).json(response);
  } catch (error) {
    console.log(`server running into an error: ${error}`);
    res.status(500).json({ error: `Server error` });
  }
};

export const get_report_with_id: RequestHandler<
  never,
  Response,
  { id: string },
  never
> = async (req, res: Response) => {
  try {
    const response = await get_report_with_id_service(Number(req.body.id));
    res.status(200).json(response);
  } catch (error) {
    console.log(`server running into an error: ${error}`);
    res.status(500).json({ error: `Server error` });
  }
};

export const get_report_document_by_id: RequestHandler<
  never,
  Response,
  { id: string },
  never
> = async (req, res: Response) => {
  try {
    const response = await get_report_document_by_id_service(
      Number(req.body.id)
    );
    res.status(200).json(response);
  } catch (error) {
    console.log(`server running into an error: ${error}`);
    res.status(500).json({ error: `Server error` });
  }
};

export const get_report_with_name: RequestHandler<
  never,
  Response,
  { name: string },
  never
> = async (req, res: Response) => {
  try {
    const response = await get_report_with_name_service(req.body.name);
    res.status(200).json(response);
  } catch (error) {
    console.log(`server running into an error: ${error}`);
    res.status(500).json({ error: `Server error` });
  }
};

export const get_report_document_by_name: RequestHandler<
  never,
  Response,
  { name: string },
  never
> = async (req, res: Response) => {
  try {
    const response = await get_report_document_by_name_service(req.body.name);
    res.status(200).json(response);
  } catch (error) {
    console.log(`server running into an error: ${error}`);
    res.status(500).json({ error: `Server error` });
  }
};

export const create_report: RequestHandler<
  never,
  Response,
  {
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    note: string;
    sum_of_expenses: number;
    expenses:
      | {
          exp_title?: string;
          exp_description?: string;
          exp_amount?: number;
        }[]
      | [];
  },
  never
> = async (req, res: Response) => {
  try {
    const response = await create_report_service(
      req.body.title,
      req.body.description,
      req.body.start_date,
      req.body.end_date,
      req.body.note,
      req.body.sum_of_expenses
    );
    if (response) {
      if (Array.isArray(req.body.expenses) && req.body.expenses.length > 0) {
        await Promise.all(
          req.body.expenses.map((expense) =>
            create_expense_service(
              expense.exp_title || "",
              expense.exp_description || "",
              Number(expense.exp_amount),
              Number(response.create_report)
            )
          )
        );
        res.status(201).json(response.create_report);
      } else {
        // If no expenses are provided, just return the reportId
        res.status(201).json(response.create_report);
      }
    }
  } catch (error) {
    console.log(`server running into an error: ${error}`);
    res.status(500).json({ error: `Server error` });
  }
};

export const update_report: RequestHandler<
  never,
  Response,
  {
    title: string;
    description: string;
    notes: string;
    sum_of_expenses: number;

    reportId: number;
  },
  never
> = async (req, res: Response) => {
  try {
    const response = await update_report_service(
      req.body.title,
      req.body.description,
      req.body.notes,
      Number(req.body.sum_of_expenses),
      Number(req.body.reportId)
    );
    res.status(201).json(response);
  } catch (error) {
    console.log(`server running into an error: ${error}`);
    res.status(500).json({ error: `Server error` });
  }
};

export const update_expense: RequestHandler<
  never,
  Response,
  {
    title: string;
    description: string;
    amount: number;
    expenseId: number;
  },
  never
> = async (req, res: Response) => {
  try {
    const response = await update_expense_service(
      req.body.title,
      req.body.description,
      Number(req.body.amount),
      Number(req.body.expenseId)
    );
    res.status(201).json(response);
  } catch (error) {
    console.log(`server running into an error: ${error}`);
    res.status(500).json({ error: `Server error` });
  }
};

export const delete_report: RequestHandler<
  never,
  Response,
  { reportId: number },
  never
> = async (req, res: Response) => {
  try {
    const response = await delete_report_service(Number(req.body.reportId));
    res.status(200).json(response);
  } catch (error) {
    console.log(`server running into an error: ${error}`);
    res.status(500).json({ error: `Server error` });
  }
};

export const delete_expense: RequestHandler<
  never,
  Response,
  { expenseId: number },
  never
> = async (req, res: Response) => {
  try {
    const response = await delete_expenses_service(Number(req.body.expenseId));
    res.status(200).json(response);
  } catch (error) {
    console.log(`server running into an error: ${error}`);
    res.status(500).json({ error: `Server error` });
  }
};
