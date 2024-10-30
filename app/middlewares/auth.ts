import { RequestHandler, Response } from "express";
import { User } from "../../types/user.types";
import { add_user_service, get_user_by_name_service } from "../services/users_service";
const bcrypt = require('bcryptjs');

export const register: RequestHandler<
  never,
  Response,
  Omit<User, 'user_id'>,
  never
> = async (req, res: Response) => {
  try {
    const { user_name, passcode, role } = req.body;
    
    if(passcode?.length < 4 || passcode?.length > 16){
      console.log(`Failed: creating new user, passcode too short or too long`)
      return res.status(400).json({ error: `Client error` });
    }
    
    if(!(role === 'admin' || role === 'cashier')){
      console.log(`Failed: creating new user, role must be admin or cashier`)
      return res.status(400).json({ error: `Client error` });
    }
    
    const existingUser = await get_user_by_name_service(user_name);
    if (existingUser) {
      console.log(`Failed: creating new user, user ${user_name} already exist!`)
      return res.status(400).json({ error: `Client error` });
    }

    const newUser = await add_user_service({ user_name, passcode, role });
    res.status(201).json(newUser);
  } catch (error) {
    console.log(`server running into an error: ${error}`)
    res.status(500).json({ error: `Server error` });
  }
};

export const login: RequestHandler<
  never,
  Response,
  { user_name: string, passcode: string },
  never
> = async (req, res: Response) => {
  try {
    const { user_name, passcode } = req.body;
    const user: User | { error: string } | null = await get_user_by_name_service(user_name);

    if (!user) {
      console.log(`Failed: logging to user ${user_name}, ${user_name} does not exist!`)
      return res.status(401).json({ error: `Client error, incorrect user name or passcode` });
    }

    // @ts-ignore
    const isMatch = await bcrypt.compare(passcode, user?.passcode);

    if (!isMatch) {
      console.log(`Failed: logging to user, incorrect passcode for user ${user_name}`)
      return res.status(401).json({ error: `Client error, incorrect user name or passcode` });
    }

    // Generate JWT token (optional)

    return res.status(200).json({
      // @ts-ignore
      user_id: user?.user_id,
      // @ts-ignore
      user_name: user?.user_name,
      // @ts-ignore
      role: user?.role
    });

  } catch (error) {
    console.log(`server running into an error: ${error}`)
    res.status(500).json({ error: `Server error` });
  }
};
