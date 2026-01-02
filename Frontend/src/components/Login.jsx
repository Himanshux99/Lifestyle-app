import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/authContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { accessToken, login } = useAuth();

  const baseUrl = "http://localhost:3000";
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      console.log("Username and password are required");
      return;
    }

    console.log("called");
    const response = await axios.post(
      `${baseUrl}/api/auth/login`,
      {
        username,
        password,
      },
      { withCredentials: true }
    );
    login(response.data.data.accessToken);
    console.log(accessToken);
    console.log("Username :", username, "Password :", password);
  };

  return (
    <>
      <div className="flex h-[100vh] justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 justify-center items-center bg-slate-900 text-white rounded-lg p-4"
        >
          <h2 className="text-2xl">Login</h2>
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

export default Login;
