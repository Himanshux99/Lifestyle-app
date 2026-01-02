import React, { useEffect, useState } from "react";
import AddExpenseCard from "./AddExpenseCard";
import ExpenseCard from "./ExpenseCard";
import { useExpense } from "../contexts/expenseContext";
import { getAllExpenseApi } from "../utils/expenseApi";
import { useAuth } from "../contexts/authContext";

function Home() {
  const {expenses, setExpenses} = useExpense();
  const {accessToken} = useAuth();

  const getAllExpense = async () => {
    const response = await getAllExpenseApi(accessToken)
    console.log("response data : ",response.data);
    setExpenses(response.data);
  };

  useEffect(()=>{
    getAllExpense()
  },[])

  if(!expenses) return <div className="flex justify-center items-center text-3xl h-screen font-bold">Loading...</div>

  return (
    <>
      <div className="mt-10 flex flex-col justify-center items-center h-screen">
        <AddExpenseCard />
        <div className="flex flex-col">
        {expenses.map(
          (expense) => (
          <div key={expense.id}>
            <ExpenseCard
              id={expense.id}
              amount={expense.amount}
              category={expense.category}
              description={expense.title}
              date={expense.date}
            />
          </div>
        ))}
        </div>
      </div>
    </>
  );
}

export default Home;
