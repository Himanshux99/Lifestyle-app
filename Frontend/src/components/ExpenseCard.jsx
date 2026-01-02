import React, { useEffect, useState } from 'react'
import { useExpense } from '../contexts/expenseContext'

function ExpenseCard({id,amount,category,description,date}) {
  const {deleteExpense} = useExpense();
  const [thisId,setThidId] = useState("");

  useEffect(()=>{setThidId(id)},[])
  return (
    <div className="flex flex-row gap-4 text-xl bg-gray-700 text-white p-4 rounded-sm m-1">
        <div>Amount : {amount}</div>
        <div>Category : {category}</div>
        <div>Description : {description}</div>
        <div>Time : {date}</div>
        <button onClick={()=>{
          deleteExpense(thisId)
        }}>Delete</button>
    </div>
  )
}

export default ExpenseCard