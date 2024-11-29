import express from "express";
import morgan from "morgan";

import { userRouter } from "./users/user.router";

const app = express();
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", userRouter);

app.listen(3012, () => {
  console.log("API is started");
});
