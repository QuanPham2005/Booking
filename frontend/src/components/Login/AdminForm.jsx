import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import Spinner from "../UI/Spinner";
import LockoutModal from "../UI/LockoutModal";

function AdminLogin() {
  const navigate = useNavigate();

  const [spinner, setSpinner] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
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
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/login`,
        {
          username: formData.username,
          password: formData.password,
        }
      );
      const role = (response.data.data.user?.roles ?? response.data.data.user?.Role ?? "").toString().toLowerCase();
      if (role !== "admin") {
        toast.error("Access denied. Only Admin are allowed to log in.");
        setSpinner(false);
        return;
      }
      setSpinner(false);
      const { token } = response.data;
      const name = response.data.data.user.name;
      localStorage.setItem("Admin Name", name);
      localStorage.setItem("jwtToken", token);
      navigate("/admin/dashboard");
      toast.success("Logged in");
    } catch (error) {
      setSpinner(false);
      if (error.response) {
        const errorData = error.response.data;
        if (errorData?.data?.locked) {
          setLockedAccount({
            email: errorData.data.email || formData.username,
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
        <section className="bg-gray-100 dark:bg-slate-900  min-h-screen flex items-center justify-center p-8 w-full">
          <div className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-200 dark:border-gray-200 rounded-lg shadow-lg p-8 w-full max-w-md">
            <div className="flex flex-col items-center">
              <h2 className="font-bold text-2xl">Admin Login</h2>
              <p className="text-sm mt-4">If you are already a member, easy login</p>
              <form className="flex flex-col gap-3 mt-4 w-full" onSubmit={submitHandler}>
                <input
                  className="mt-3 p-2 border rounded dark:bg-slate-700"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={changeHandler}
                  placeholder="Username"
                  autoComplete="username"
                />
                <label className="text-sm text-gray-500 dark:text-gray-400">VD: admin01</label>
                <div className="relative mt-3">
                  <input
                    className="w-full p-2 pr-10 border rounded dark:bg-slate-700"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={changeHandler}
                    placeholder="Password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <label className="text-sm text-gray-500 dark:text-gray-400">VD: adminpass</label>
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
      )}
      <LockoutModal
        open={Boolean(lockedAccount)}
        accountValue={lockedAccount?.email || formData.username}
        reason={lockedAccount?.reason}
        contact="admin@udck.edu.vn - 0260.123.4567"
        onClose={() => setLockedAccount(null)}
      />
    </>
  );
}

export default AdminLogin;
