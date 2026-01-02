import React, { useState } from "react";
import axios from "axios";

function Home() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("other");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  function toDateTimeLocalString(date = new Date()) {
    const pad = (n) => String(n).padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hour}:${minute}`; // add :${pad(date.getSeconds())} if you need seconds
  }
  const baseUrl = "http://localhost:3000";

  const nowLocal = toDateTimeLocalString(); // e.g., "2025-12-31T09:45"

  const addExpense = async (e) => {
    //add expense
    e.preventDefault();
    if (!amount) {
      console.log("please enter the amount");
      return;
    }
    let tempDate = date;
    if (!tempDate) {
      tempDate = nowLocal;
    }
    const id = crypto.randomUUID();

    const response = await axios.post(`${baseUrl}/api/expenses`,{id,amount,category,title:description,date},{
      withCredentials: true 
    })
    console.log(response.data);
    setAmount("");
    setCategory("other");
    setDescription("");
    setDate("");
  };
  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="p-8 bg-gray-700 text-white rounded-xs flex justify-center flex-col">
          <p className="text-3xl font-semibold text-center mb-4">Add Expense</p>
          <div className="text-2xl">
            <div className="flex flex-col justify-start gap-2">
              <div className="h-10">
                <label>Amount : </label>
                <input
                  value={amount}
                  placeholder="Amount Ex. 45"
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                  className="border-gray-400 border-2 rounded-xs"
                  type="number"
                />
              </div>
              <div className="h-10">
                <label> Category : </label>
                <select
                  className="text-black"
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                >
                  <option value="">Select the category</option>
                  <option value="food">food</option>
                  <option value="grocery">grocery</option>
                  <option value="chai">chai</option>
                </select>
              </div>
              <div className="h-10">
                <label>Description : </label>
                <input
                  value={description}
                  placeholder="Desc. Ex. Samosapav"
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  className="border-gray-400 border-2 rounded-xs"
                  type="text"
                />
              </div>
              <div className="h-10">
                <label> Date : </label>
                <input
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                  }}
                  className=" rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  type="datetime-local"
                />
              </div>
            </div>
          </div>
          <button
            onClick={addExpense}
            className="mt-4 text-2xl p-2 bg-blue-600 rounded-sm hover:bg-blue-700 active:bg-gray-600"
          >
            Add Expense
          </button>
        </div>
      </div>
    </>
  );
}

export default Home;
