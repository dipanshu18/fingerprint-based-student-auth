import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      min: 3,
      required: true,
      message: "Full name required",
    },
    email: {
      type: String,
      unique: true,
      required: true,
      message: "Email required",
    },
    rollNo: {
      type: String,
      unique: true,
      required: true,
      message: "Roll number required",
    },
    fingerprintId: {
      type: String,
      unique: true,
      required: true,
      message: "Fingerprint id required for verification",
    },
  },
  { timestamps: true }
);

const studentModel = mongoose.model("Student", studentSchema);

export { studentModel };
