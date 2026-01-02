import { createContext, useContext, useState } from "react";
import { addExpenseApi, deleteExpenseApi } from "../utils/expenseApi";
import { useAuth } from "./authContext";

const ExpenseContext = createContext(null);

export const ExpenseContextProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const { accessToken } = useAuth();

  const addExpense = async (payload) => {
    const response = await addExpenseApi(payload, accessToken);
    // console.log("response : ", response);
    // console.log("response data : ", response.data);

    setExpenses((prev) => [ response.data,...prev]);
  };

  const deleteExpense = async (id) => {
       const response = await deleteExpenseApi(id,accessToken)
       console.log(response);
         
       setExpenses((prev) => prev.filter((p)=>p.id!=id))
  };
  const editExpense = () => {};

  return (
    <ExpenseContext.Provider
      value={{ expenses, setExpenses, addExpense, deleteExpense, editExpense }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => useContext(ExpenseContext);
