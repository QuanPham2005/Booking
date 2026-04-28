import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ConfirmedAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const jwt = () => localStorage.getItem("Teacher jwtToken");

  useEffect(() => {
    if (!jwt()) {
      navigate("/teacher/login");
      return;
    }
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/teachers/appointments`, {
        headers: { Authorization: `Bearer ${jwt()}` },
      })
      .then((res) => setAppointments(res.data.data?.appointments || []))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, [navigate]);

  const user = { name: localStorage.getItem("Teacher Name") };

  const statusLabel = (s) =>
    s === "Pending" ? "Pending" : s === "Approved" ? "Approved" : "Rejected";

  return (
    <div className="container mx-auto px-6 py-8">
      {loading && <p>Loading...</p>}
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Student</th>
                <th className="px-4 py-2 text-left">Reason</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a, i) => (
                <tr key={a.Appoint_ID || i} className="border-b">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{a.AppointmentStudent?.Full_Name || a.Student_ID}</td>
                  <td className="px-4 py-2">{a.Reason || "-"}</td>
                  <td className="px-4 py-2">{statusLabel(a.Status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && appointments.length === 0 && (
          <p className="text-gray-500 mt-4">No appointments.</p>
        )}
      </div>
  );
};

export default ConfirmedAppointments;
