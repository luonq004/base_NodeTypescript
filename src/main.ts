import express from "express";
import { userRouter } from "./users/user.router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", userRouter);

app.listen(3012, () => {
  console.log("API is started");
});
