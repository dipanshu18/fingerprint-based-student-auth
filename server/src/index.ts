import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";

import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

import { studentRouter } from "./routes/student.route";

// Serial port config
const serialPort = new SerialPort({
  path: "COM3",
  baudRate: 9600,
});
const parser = serialPort.pipe(new ReadlineParser({ delimiter: "\r\n" }));

// parser.on("data", function (data) {
//   return console.log(data);
// });

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/students")
  .then((val: any) => {
    console.log("DB connected...");
  })
  .catch((error: any) => console.log("Error:\n", error));

app.use("/api/v1", studentRouter);

app.listen(7777, () => {
  console.log("Server listening on port 7777");
});

export { serialPort, parser };
