import { RequestHandler, Request, Response } from 'express'
import {
  get_items_service,
  add_item_service,
  delete_item_service
} from '../services/items_service'
import { Item } from '../../types/Item.types';

export const get_items: RequestHandler<
  never,
  Response,
  never,
  never
> = async (req, res: Response) => {
  try {
    const respond = await get_items_service();
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}


export const add_item: RequestHandler<
  never,
  Response,
  Omit<Item, "id">,
  never
> = async (req, res: Response) => {
  try {
    const respond = await add_item_service(req.body);
    res.status(201).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}

export const delete_item: RequestHandler<
  never,
  Response,
  { item_id: number },
  never
> = async (req, res: Response) => {
  try {
    const respond = await delete_item_service(req.body.item_id);
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}

// export const get_warehouse_documents: RequestHandler<
//   never,
//   Response,
//   { warehouse_id: number },
//   never
// > = async (req, res: Response) => {
//   try {
//     const respond = await get_warehouse_documents_service(req.body.warehouse_id);
//     res.status(200).json(respond);
//   } catch (error) {
//     console.log(`server is running into an error \n${error}`);
//     res.status(500).json({ error: "Server error" });
//   }
// }

// export const get_warehouse_item_documents_based_on_barcode: RequestHandler<
//   never,
//   Response,
//   { warehouse_id: number, barcode: string },
//   never
// > = async (req, res: Response) => {
//   try {
//     const respond = await get_warehouse_item_documents_based_on_barcode_service(req.body.warehouse_id, req.body.barcode);
//     res.status(200).json(respond);
//   } catch (error) {
//     console.log(`server is running into an error \n${error}`);
//     res.status(500).json({ error: "Server error" });
//   }
// }

// export const get_all_items: RequestHandler<
//   never,
//   Response,
//   never,
//   never
// > = async (req, res: Response) => {
//   try {
//     const respond = await get_all_items_service();
//     res.status(200).json(respond);
//   } catch (error) {
//     console.log(`server is running into an error \n${error}`);
//     res.status(500).json({ error: "Server error" });
//   }
// }

// export const get_item: RequestHandler<
//   { id: string },
//   Response,
//   never,
//   never
// > = async (req, res: Response) => {
//   try {
//     const respond = await get_item_service(Number(req.params.id));
//     res.status(200).json(respond);
//   } catch (error) {
//     console.log(`server is running into an error \n${error}`);
//     res.status(500).json({ error: "Server error" });
//   }
// }


// export const update_item: RequestHandler<
//   never,
//   Response,
//   Item,
//   never
// > = async (req, res: Response) => {
//   try {
//     const respond = await update_item_service(req.body);
//     res.status(200).json(respond);
//   } catch (error) {
//     console.log(`server is running into an error \n${error}`);
//     res.status(500).json({ error: "Server error" });
//   }
// }

// export const update_removed_amount: RequestHandler<
//   never,
//   Response,
//   {id: number, removed: number},
//   never
// > = async (req, res: Response) => {
//   try {
//     const respond = await update_removed_amount_service(Number(req.body.id), Number(req.body.removed));
//     res.status(200).json(respond);
//   } catch (error) {
//     console.log(`server is running into an error \n${error}`);
//     res.status(500).json({ error: "Server error" });
//   }
// }

// export const clean_damaged_goods: RequestHandler<
//   never,
//   Response,
//   {id: number, removed: number},
//   never
// > = async (req, res: Response) => {
//   try {
//     const respond = await clean_damaged_goods_service(Number(req.body.id), Number(req.body.removed));
//     res.status(200).json(respond);
//   } catch (error) {
//     console.log(`server is running into an error \n${error}`);
//     res.status(500).json({ error: "Server error" });
//   }
// }

// export const move_changed_to_damaged: RequestHandler<
//   never,
//   Response,
//   {id: number, changed: number, damaged: number},
//   never
// > = async (req, res: Response) => {
//   try {
//     const respond = await move_changed_to_damaged_service(Number(req.body.id), Number(req.body.changed), Number(req.body.damaged));
//     res.status(200).json(respond);
//   } catch (error) {
//     console.log(`server is running into an error \n${error}`);
//     res.status(500).json({ error: "Server error" });
//   }
// }

// export const remove_item: RequestHandler<
//   { id: string },
//   Response,
//   never,
//   never
// > = async (req, res: Response) => {
//   try {
//     const respond = await remove_item_service(Number(req.params.id));
//     res.status(200).json(respond);
//   } catch (error) {
//     console.log(`server is running into an error \n${error}`);
//     res.status(500).json({ error: "Server error" });
//   }
// }
