import express, { Request, Response } from "express";
import * as database from "./user.database";
import { StatusCodes } from "http-status-codes";
import { compare } from "bcrypt";

export const userRouter = express.Router();

userRouter.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await database.findAll();
    res.json(users);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
});

userRouter.post("/users", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Please provide all required parameters" });
    }
    const user = await database.findByEmail(email);
    if (user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "This email is already been taken" });
    }
    const newUser = await database.create({ username, email, password });
    res.json(newUser);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
});

userRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Please provide all required parameters" });
    }
    const user = await database.findByEmail(email);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User doesnt exist" });
    }
    const isSamePassword = await compare(password, user.password);
    if (!isSamePassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Incorrect password" });
    }
    res.json(user);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
});

userRouter.put("/users/:id", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const user = await database.findById(req.params.id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "No found" });
    }
    const updatedUser = await database.update(req.params.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
});

userRouter.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await database.remove(id);
    res.status(StatusCodes.OK).json({ msg: "User deleted" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
});
