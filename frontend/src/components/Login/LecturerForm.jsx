import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

import Spinner from "../UI/Spinner";
import toast from "react-hot-toast";
import LockoutModal from "../UI/LockoutModal";

function Lecturer() {
  const navigate = useNavigate();
  const [spinner, setSpinner] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [lockedAccount, setLockedAccount] = useState(null);

  function changeHandler(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  async function submitHandler(event) {
    event.preventDefault();

    try {
      setSpinner(true);
      const identifier = formData.email.trim();
      const requestBody = { password: formData.password };
      if (identifier.includes("@")) {
        requestBody.email = identifier;
      } else {
        requestBody.username = identifier;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/teachers/login`,
        requestBody
      );
      const role = (response.data.data.user?.roles ?? response.data.data.user?.Role ?? "").toString().toLowerCase();
      if (role !== "teacher" && role !== "lecturer") {
        toast.error("Access denied. Only teachers are allowed to log in.");
        setSpinner(false);
        return;
      }
      setSpinner(false);
      const { token } = response.data;
      const name = response.data.data.user.name;
      localStorage.setItem("Teacher jwtToken", token);
      localStorage.setItem("Teacher Name", name);
      navigate("/lecturer/dashboard");
      toast.success("Logged in");
    } catch (error) {
      console.error(error);
      setSpinner(false);
      if (error.response) {
        const errorData = error.response.data;
        if (errorData?.data?.locked) {
          setLockedAccount({
            email: errorData.data.email || formData.email,
            reason: errorData.data.reason || "Vượt quá 3 lần đăng nhập sai",
          });
          return;
        }

        const errorMessage = errorData?.message || "Login failed";
        toast.error(errorMessage);
      } else {
        toast.error("Login failed");
      }
    }
  }

  return (
    <>
      {spinner ? (
        <Spinner />
      ) : (
        <>
          <section className="bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-gray-200 dark:border-gray-200 min-h-screen flex items-center justify-center p-8 w-full">
            <div className="bg-white rounded-lg dark:bg-slate-800 text-gray-900 dark:text-gray-200 dark:border-gray-200 dark:border shadow-lg p-8 w-full max-w-md">
              <div className="flex flex-col items-center">
                <h2 className="font-bold text-2xl">Lecturer Login</h2>
                <p className="text-sm mt-4">If you are already a member, easy login</p>
                <form className="flex flex-col gap-3 mt-4 w-full" onSubmit={submitHandler}>
                  <input
                    className="mt-3 p-2 border rounded dark:bg-slate-700"
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={changeHandler}
                    placeholder="Tên đăng nhập hoặc Email"
                  />
                  <label>Email: gv001@udck.udn.vn</label>
                  <div className="relative mt-3">
                    <input
                      className="w-full p-2 pr-10 border rounded dark:bg-slate-700"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={changeHandler}
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <label>Password: pass123</label>
                  <div className="flex mt-4 gap-3 w-full">
                    <input
                      type="submit"
                      value="Login"
                      className="btn-udck w-full cursor-pointer"
                    />

                  </div>
                </form>
              </div>
            </div>
          </section>
          <LockoutModal
            open={Boolean(lockedAccount)}
            accountValue={lockedAccount?.email || formData.email}
            reason={lockedAccount?.reason}
            contact="admin@udck.edu.vn - 0260.123.4567"
            onClose={() => setLockedAccount(null)}
          />
        </>
      )}
    </>
  );
}

export default Lecturer;
