import Expense from "../models/expense.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

// Create a new expense
const createExpense = asyncHandler(async (req, res) => {
  // id is generated at the frontend for offline sync
  const { id, title, category, amount, date } = req.body;
  const userId = req.user?._id;

  // Validate required fields
  if (!id || !title || !category || !amount || !date) {
    throw new ApiError(
      400,
      "All fields (id, title, category, amount, date) are required",
      []
    );
  }

  // Validate amount is positive
  if (amount <= 0) {
    throw new ApiError(400, "Amount must be greater than 0", []);
  }

  // Check if expense with this id already exists
  const existingExpense = await Expense.findOne({ id });
  if (existingExpense) {
    throw new ApiError(409, "Expense with this id already exists", []);
  }

  const expense = await Expense.create({
    id,
    title: title.trim(),
    category: category.trim(),
    amount,
    date: new Date(date),
    user_id: userId,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, expense, "Expense created successfully")
    );
});

// Get all expenses for the logged-in user
const getAllExpenses = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { category, startDate, endDate } = req.query;

  // Build filter object
  const filter = { user_id: userId, deleted: false };

  if (category) {
    filter.category = category;
  }

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) {
      filter.date.$gte = new Date(startDate);
    }
    if (endDate) {
      filter.date.$lte = new Date(endDate);
    }
  }

  const expenses = await Expense.find(filter).sort({ date: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, expenses, "Expenses fetched successfully")
    );
});

// Get a single expense by id
const getExpenseById = asyncHandler(async (req, res) => {
  const { expenseId } = req.params;
  const userId = req.user?._id;

  const expense = await Expense.findOne({ id: expenseId, user_id: userId });

  if (!expense) {
    throw new ApiError(404, "Expense not found", []);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, expense, "Expense fetched successfully"));
});

// Update an expense
const updateExpense = asyncHandler(async (req, res) => {
  const { expenseId } = req.params;
  const userId = req.user?._id;
  const { title, category, amount, date } = req.body;

  const expense = await Expense.findOne({ id: expenseId, user_id: userId });

  if (!expense) {
    throw new ApiError(404, "Expense not found", []);
  }

  // Validate amount if provided
  if (amount && amount <= 0) {
    throw new ApiError(400, "Amount must be greater than 0", []);
  }

  // Update fields
  if (title) expense.title = title.trim();
  if (category) expense.category = category.trim();
  if (amount) expense.amount = amount;
  if (date) expense.date = new Date(date);

  const updatedExpense = await expense.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedExpense, "Expense updated successfully")
    );
});

// Soft delete an expense
const deleteExpense = asyncHandler(async (req, res) => {
  const { expenseId } = req.params;
  const userId = req.user?._id;

  const expense = await Expense.findOne({ id: expenseId, user_id: userId });

  if (!expense) {
    throw new ApiError(404, "Expense not found", []);
  }

  expense.deleted = true;
  await expense.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Expense deleted successfully"));
});

// Get expense statistics
const getExpenseStats = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { startDate, endDate } = req.query;

  const filter = { user_id: userId, deleted: false };

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) {
      filter.date.$gte = new Date(startDate);
    }
    if (endDate) {
      filter.date.$lte = new Date(endDate);
    }
  }

  const stats = await Expense.aggregate([
    { $match: filter },
    {
      $group: {
        _id: "$category",
        totalAmount: { $sum: "$amount" },
        count: { $sum: 1 },
        avgAmount: { $avg: "$amount" },
      },
    },
    { $sort: { totalAmount: -1 } },
  ]);

  const totalExpenses = stats.reduce((sum, stat) => sum + stat.totalAmount, 0);

  return res.status(200).json(
    new ApiResponse(
      200,
      { stats, totalExpenses },
      "Expense statistics fetched successfully"
    )
  );
});

const getExpenseByCategory = asyncHandler(async (req, res) => {
});

const getFilteredExpense = asyncHandler(async (req, res) => {
});

export {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseStats,
};