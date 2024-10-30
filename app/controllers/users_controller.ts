import { RequestHandler, Response } from "express";
import {
  get_users_service,
  get_user_service,
  // add_return_service,
  // update_return_service,
  // remove_return_service,
  // returned_documents_for_warehouse_service
} from "../services/users_service";
// import { Return } from "../../types/return.types";

export const get_users: RequestHandler<
  never,
  Response,
  never,
  never
> = async (req, res: Response) => {

  try {
    const respond = await get_users_service();
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server running into an error: ${error}`)
    res.status(500).json({ error: `Server error` });
  }
}

export const get_user: RequestHandler<
  { id: string },
  Response,
  never,
  never
> = async (req, res: Response) => {
  try {
    const respond = await get_user_service(Number(req.params.id));
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server running into an error: ${error}`)
    res.status(500).json({ error: `Server error` });
  }
}

// export const add_return: RequestHandler<
//   never,
//   Response,
//   Omit<Return, "id">,
//   never
// > = async (req, res: Response) => {
//   try {
//     const respond = await add_return_service(req.body);
//     res.status(200).json(respond);
//   } catch (error) {
//     console.log(`server running into an error: ${error}`)
//     res.status(500).json({ error: `Server error` });
//   }
// }

// export const update_return: RequestHandler<
//   never,
//   Response,
//   Return,
//   never
// > = async (req, res: Response) => {
//   try {
//     const respond = await update_return_service(req.body);
//     res.status(200).json(respond);
//   } catch (error) {
//     console.log(`server running into an error: ${error}`)
//     res.status(500).json({ error: `Server error` });
//   }
// }

// export const remove_return: RequestHandler<
//   { id: string },
//   Response,
//   never,
//   { item_id: number, returned_amount: number }
// > = async (req, res: Response) => {
//   try {
//     const respond = await remove_return_service(Number(req.params.id), Number(req.query.item_id), Number(req.query.returned_amount));
//     res.status(200).json(respond);
//   } catch (error) {
//     console.log(`Server runnign into an error: ${error}`);
//     res.status(500).json({ error: `Server error` });
//   }
// }

// export const returned_documents_for_warehouse: RequestHandler<
//   never,
//   Response,
//   { warehouse_id: number },
//   never
// > = async (req, res: Response) => {
//   try {
//     const respond = await returned_documents_for_warehouse_service(Number(req.body.warehouse_id));
//     res.status(200).json(respond);
//   } catch (error) {
//     console.log(`Server runnign into an error: ${error}`);
//     res.status(500).json({ error: `Server error` });
//   }
// }
