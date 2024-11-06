import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as database from "./user.database";
import { compare } from "bcrypt";

export const userRouter = express.Router();

userRouter.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await database.findAll();
    res.json(users);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
});

userRouter.post("/users", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: `Please provide all the required parameters` });
    }

    const user = await database.findByEmail(email);

    if (user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: `This email has already been registered` });
    }

    const newUser = await database.create(req.body);

    return res.json(newUser);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
});

userRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Please provide all the required parameters" });
    }

    const user = await database.findByEmail(email);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "No user exists with the email provided" });
    }

    const isSamePassword = await compare(password, user.password);

    if (!isSamePassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Incorrect Password" });
    }

    return res.json({ user });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
});

userRouter.put("/users/:id", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const getUser = await database.findById(req.params.id);

    if (!username || !email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: `Please provide all the required parameters..` });
    }

    if (!getUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: `No user with id ${req.params.id}` });
    }

    const updatedUser = await database.update(req.params.id, req.body);

    return res.json(updatedUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
});

userRouter.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const user = await database.findById(id);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User does not exist" });
    }

    await database.remove(id);

    return res.status(StatusCodes.OK).json({ msg: "User deleted" });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
});
