import axios from "axios";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Spinner from "./Spinner";

export default function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [fingerprintId, setFingerprintId] = useState("");

  const [fingerprintEnrollLoading, setFingerprintEnrollLoading] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleEnrollFingerprint(e: FormEvent) {
    e.preventDefault();

    if (!fullName || !email || !rollNo || !fingerprintId) {
      setFingerprintEnrollLoading(false);
      return toast.error(
        "Please fill the form before enrolling for fingerprint :("
      );
    }

    try {
      setFingerprintEnrollLoading(true);
      const request = await axios.post(
        "http://localhost:7777/api/v1/fingerprint/enroll",
        {
          fingerprintId,
        }
      );

      const response = await request.data;
      if (request.status === 201) {
        setFingerprintEnrollLoading(false);
        return toast.success(response.message);
      }
    } catch (error: any) {
      setFingerprintEnrollLoading(false);
      if (error.response) {
        const errorMessage =
          error.response.data.message ||
          "An error occurred while enrolling fingerprint";

        toast.error(errorMessage);
        setFingerprintEnrollLoading(false);

        setFullName("");
        setEmail("");
        setRollNo("");
        setFingerprintId("");
        return toast.error("Please re-register the form with fingerprint");
      } else {
        return toast.error("Network Error");
      }
    } finally {
      setFingerprintEnrollLoading(false);
    }
  }

  async function handleRegisterStudent(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const request = await axios.post(
        "http://localhost:7777/api/v1/students",
        {
          fullName,
          email,
          rollNo,
          fingerprintId,
        }
      );

      const response = await request.data;

      if (request.status === 201) {
        setFullName("");
        setEmail("");
        setRollNo("");
        setFingerprintId("");

        setLoading(false);

        toast.success(response.message);

        navigate("/");
        return;
      }
    } catch (error: any) {
      setLoading(false);
      if (error.response) {
        const errorMessage =
          error.response.data.message ||
          "An error occurred while registering student";
        return toast.error(errorMessage);
      } else {
        return toast.error("Network Error");
      }
    }

    return toast.error("An error occurred while registering student");
  }

  return (
    <>
      <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body">
          <div className="form-control">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="Moin Hossain"
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
                className="input input-bordered placeholder-slate-500"
                required
              />
            </div>

            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="moin.hossain@vit.edu.in"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="input input-bordered placeholder-slate-500"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Roll Number</span>
            </label>
            <input
              type="text"
              placeholder="21101A0042"
              onChange={(e) => setRollNo(e.target.value)}
              value={rollNo}
              className="input input-bordered placeholder-slate-500"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Fingerprint ID</span>
            </label>
            <input
              type="text"
              placeholder="1"
              onChange={(e) => setFingerprintId(e.target.value)}
              value={fingerprintId}
              className="input input-bordered placeholder-slate-500"
              required
            />
          </div>

          <div className="form-control mt-6">
            <button
              disabled={fingerprintEnrollLoading}
              onClick={handleEnrollFingerprint}
              className="btn btn-info"
            >
              {fingerprintEnrollLoading ? <Spinner /> : ""}Enroll Fingerprint
            </button>
          </div>

          <div className="form-control mt-6">
            <button
              disabled={loading}
              onClick={handleRegisterStudent}
              className="btn btn-primary"
            >
              {loading ? <Spinner /> : ""}
              Register
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </>
  );
}
