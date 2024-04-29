import { Request, Response } from "express";
import { studentModel } from "../models/student.model";
import { serialPort, parser } from "../index";

// import axios from "axios";

import nodemailer from "nodemailer";

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "noreply.landf@gmail.com",
    pass: "wyrjmielenhqefnn",
  },
});

export async function getUniqueFingerprint(req: Request, res: Response) {
  try {
    const { fingerprintId } = await req.body;
    const fingerprintIdExists = await studentModel.findOne({ fingerprintId });

    if (fingerprintIdExists) {
      return res.status(400).json({
        message: "Fingerprint ID already exists please use different one...",
      });
    }

    return res.status(200);
  } catch (error) {
    console.log("Error while getting fingerprintID:\n", error);
    return res
      .status(500)
      .json({ message: "Error while getting fingerprintId..." });
  }
}

// Function to send command to Arduino and handle response
function sendCommandToArduino(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    serialPort.write(`${command}\n`, (error) => {
      if (error) {
        reject(error);
      } else {
        let responseData = "";

        // Listen for data from the parser
        parser.on("data", (data: string) => {
          responseData += data;

          // Check if the response contains the expected string
          if (
            responseData.includes("SUCCESS") ||
            responseData.includes("FAILED")
          ) {
            // If the expected string is found, resolve the promise
            resolve(responseData.trim());
          }
        });

        // Handle errors from the parser
        parser.once("error", (error) => {
          reject(error);
        });
      }
    });
  });
}

export async function getAllStudents(req: Request, res: Response) {
  try {
    const studentsArr = await studentModel.find();

    if (studentsArr.length === 0) {
      return res.status(404).json({ message: "No students data found..." });
    }

    res.status(200).json(studentsArr);
  } catch (error) {
    console.log("Error while getting students:\n", error);
    return res.status(500).json({ message: "Error while getting students..." });
  }
}

export async function createStudent(req: Request, res: Response) {
  try {
    const { fullName, email, rollNo, fingerprintId } = req.body;

    const studentExists = await studentModel.findOne({ email, rollNo });

    if (studentExists) {
      return res
        .status(400)
        .json({ message: "Student already exists. Kindly verify fingerprint" });
    }

    // const request = await axios.post(
    //   "http://localhost:7777/api/v1/fingerprint/enroll",
    //   {
    //     fingerprintId,
    //   }
    // );

    // if (request.data.message === "Fingerprint enrolled successfully") {
    const newStudent = await studentModel.create({
      fullName,
      email,
      rollNo,
      fingerprintId,
    });

    if (newStudent) {
      newStudent.save();

      return res
        .status(201)
        .json({ message: "Student created...", ...newStudent });
    }
    // } else {
    //   return res
    //     .status(400)
    //     .json({ message: "Re-register user with fingerprint and data" });
    // }
  } catch (error) {
    console.log("Error while creating student:\n", error);
    return res.status(500).json({ message: "Error while creating student..." });
  }
}

export async function enrollFingerprint(req: Request, res: Response) {
  try {
    const { fingerprintId } = req.body;

    const response = await sendCommandToArduino(`ENROLL:${fingerprintId}`);
    console.log(response);

    if (response.includes("SUCCESS")) {
      return res
        .status(201)
        .json({ message: "Fingerprint enrolled successfully" });
    } else {
      return res.status(500).json({ message: "Fingerprint enrollment failed" });
    }
  } catch (error) {
    console.error("Error while enrolling fingerprint:", error);
    res.status(500).json({ message: "Error while enrolling fingerprint" });
  }
}

export async function verifyFingerprint(req: Request, res: Response) {
  try {
    const { fingerprintId } = req.body;
    const student = await studentModel.findOne({ fingerprintId });

    const date = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const attnDate = `${date}/${month}/${year}`;

    if (!student) {
      return res
        .status(404)
        .json({ message: "No Fingerprint found. Kindly register" });
    }

    const response = await sendCommandToArduino(`VERIFY:${fingerprintId}`);
    console.log(response);

    if (response.includes("SUCCESS")) {
      var mailOptions = {
        from: "noreply.landf@gmail.com",
        to: student?.email,
        subject: "Exam Attendace marked",
        text: `${student?.fullName} is marked present on ${attnDate} for the exam.`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      return res.status(200).json({ message: "Fingerprint verified" });
    } else {
      return res
        .status(404)
        .json({ message: "Fingerprint verification failed" });
    }
  } catch (error) {
    console.error("Error verifying fingerprint:", error);
    res.status(500).json({ message: "Error verifying fingerprint" });
  }
}
