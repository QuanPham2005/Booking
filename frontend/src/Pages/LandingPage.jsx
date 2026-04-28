import React from "react";
const student = "/assets/students.jpg";
const teacher = "/assets/teachers.jpg";
const admin = "/assets/admin.jpg";
import HomeCard from "../components/Cards/HomeCard";

function Home() {
  return (
    <>
      <div className="flex flex-col gap-12 items-center px-6 py-4 min-h-screen justify-center dark:bg-slate-900 text-gray-900 dark:text-gray-200">
      <h1 className="font-bold text-3xl text-center">Welcome To Student-Teacher Booking</h1>
        <div className="sm:flex">
          <HomeCard img={student} name="student" />
          <HomeCard img={teacher} name="teacher" />
          <HomeCard img={admin} name="admin" />
        </div>
      </div>
    </>
  );
}

export default Home;
