import { Router } from "express";
import {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseStats,
} from "../controllers/expense.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Apply JWT verification middleware to all routes
router.use(verifyJWT);

// Create a new expense
router.route("/").post(createExpense);

// Get all expenses with optional filters
router.route("/").get(getAllExpenses);

// Get expense statistics
router.route("/stats").get(getExpenseStats);

// Get, update, delete a specific expense
router.route("/:expenseId").get(getExpenseById);
router.route("/:expenseId").patch(updateExpense);
router.route("/:expenseId").delete(deleteExpense);

export default router;
