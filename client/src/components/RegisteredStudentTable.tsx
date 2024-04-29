import { FormEvent, useState } from "react";
import { Student } from "../pages/Students";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Spinner from "./Spinner";

export default function RegisteredStudentTable({
  student,
}: {
  student: Student;
}) {
  const [loading, setLoading] = useState(false);

  async function handleStudentVerify(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const request = await axios.post(
        "http://localhost:7777/api/v1/fingerprint/verify",
        {
          fingerprintId: student.fingerprintId,
        }
      );

      const response = await request.data;

      if (request.status === 200) {
        setLoading(false);

        toast.success(response.message);

        return toast.success(
          "Mail send on the registered email for marked attendance"
        );
      }
    } catch (error: any) {
      setLoading(false);
      if (error.response) {
        const errorMessage =
          error.response.data.message ||
          "An error occurred while verifying fingerprint";

        toast.error(errorMessage);
        return toast.error("Please re-verify");
      } else {
        return toast.error("Network Error");
      }
    } finally {
      setLoading(false);
    }

    return toast.error("An error occurred while verifying fingerprint");
  }

  return (
    <>
      <tbody>
        {/* row 2 */}
        <tr className="hover">
          <th>{student._id}</th>
          <td>{student.fullName}</td>
          <td>{student.email}</td>
          <td>{student.rollNo}</td>
          <td>{student.fingerprintId}</td>
          <td>
            <button
              disabled={loading}
              onClick={handleStudentVerify}
              className="btn btn-success"
            >
              {loading ? <Spinner /> : ""}
              {loading ? "Checking and verifying your fingerprint" : "Verify"}
            </button>
          </td>
        </tr>
      </tbody>
      <ToastContainer />
    </>
  );
}
