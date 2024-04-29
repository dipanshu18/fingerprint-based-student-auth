import axios from "axios";
import { useEffect, useState } from "react";
import RegisteredStudentTable from "../components/RegisteredStudentTable";
import { Link } from "react-router-dom";

export interface Student {
  _id: string;
  fullName: string;
  email: string;
  rollNo: string;
  fingerprintId: string;
}

export default function Students() {
  const [students, setUsers] = useState<Student[]>([]);

  useEffect(() => {
    async function fetchStudents() {
      const request = await axios.get("http://localhost:7777/api/v1/students");

      const response = await request.data;

      if (request.status === 200) {
        setUsers(response);
      }
    }

    fetchStudents();
  }, []);

  if (students.length === 0) {
    return (
      <div className="my-10 flex flex-col justify-center items-center">
        <h1 className="text-3xl font-extrabold">No students registered :(</h1>

        <div className="my-10">
          <h1 className="text-2xl font-bold">
            If not registered kindly register by clicking below⬇️
          </h1>
          <div className="flex justify-center items-center my-5">
            <Link to="/register">
              <button className="btn btn-primary">Register Student</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-10 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-extrabold mb-10">Registered Students</h1>

      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Roll Number</th>
              <th>Fingerprint ID</th>
              <th></th>
            </tr>
          </thead>
          {students &&
            students.map((student: Student) => {
              return (
                <RegisteredStudentTable student={student} key={student._id} />
              );
            })}
        </table>
      </div>

      <div className="my-10">
        <h1 className="text-2xl font-bold">
          If not registered kindly register by clicking below⬇️
        </h1>
        <div className="flex justify-center items-center my-5">
          <Link to="/register">
            <button className="btn btn-primary">Register Student</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
