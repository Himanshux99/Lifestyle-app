import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/authContext";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { registered } = useAuth();
  const baseUrl = "http://localhost:3000";
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      console.log("Username and password are required");
      return;
    }
    console.log("called");
    const data = await axios.post(`${baseUrl}/api/auth/register`, {
      username,
      password,
    });
    if (data) {
      console.log(data);
      console.log("Username :", username, "Password :", password);
      registered();
    }
  };
  return (
    <>
      <div className="flex w-full h-[100vh] justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 justify-center items-center bg-slate-900 text-white rounded-lg p-4"
        >
          <h2 className="text-2xl">Register</h2>
          <label>Username : </label>
          <input
            placeholder="Username"
            type="text"
            className="border-gray-500 border-1 rounded-lg w-full h-8 mb-2 p-2"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <label>Password : </label>
          <input
            placeholder="Password"
            type="password"
            className="border-gray-500 border-1 rounded-lg w-full h-8 mb-2 p-2"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button
            type="submit"
            className="hover:bg-cyan-700 bg-cyan-600 p-1 rounded-sm w-full"
          >
            Register
          </button>
        </form>
      </div>
    </>
  );
}

export default Register;
