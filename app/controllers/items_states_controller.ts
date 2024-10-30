import { RequestHandler, Response } from 'express'
import { ItemState } from '../../types/ItemState.types';
import { add_item_state_service, get_items_states_service, update_item_state_service } from '../services/items_state_service';

export const get_items_states: RequestHandler<
  never,
  Response,
  never,
  never
> = async (req, res: Response) => {
  try {
    const respond = await get_items_states_service();
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}

export const add_item_state: RequestHandler<
  never,
  Response,
  Omit<ItemState, "item_state_id">,
  never
> = async (req, res: Response) => {
  try {
    const respond = await add_item_state_service(req.body);
    res.status(201).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}

export const update_item_state: RequestHandler<
  never,
  Response,
  Omit<ItemState, "item_state_id">,
  never
> = async (req, res: Response) => {
  try {
    const respond = await update_item_state_service(req.body);
    res.status(200).json(respond);
  } catch (error) {
    console.log(`server is running into an error \n ${error}`);
    res.status(500).json({ error: "Server error" });
  }
}
