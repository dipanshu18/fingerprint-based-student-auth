import express from "express";
import {
  createStudent,
  enrollFingerprint,
  getAllStudents,
  getUniqueFingerprint,
  verifyFingerprint,
} from "../controllers/student.controller";

const studentRouter = express.Router();

studentRouter.get("/students", getAllStudents);

studentRouter.post("/students", createStudent);

studentRouter.post("/fingerprint/unique", getUniqueFingerprint);

studentRouter.post("/fingerprint/enroll", enrollFingerprint);

studentRouter.post("/fingerprint/verify", verifyFingerprint);

export { studentRouter };
