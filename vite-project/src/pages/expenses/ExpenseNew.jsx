import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // 🔥 import toast


// Use environment variable for backend URL
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ExpenseNewForm() {
  const navigate = useNavigate();

  const [expense, setExpense] = useState({
    category: "",
    amount: "",
    date: "",
    description: "",
    reminderDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: expense.category,
          amount: parseFloat(expense.amount),
          date: new Date(expense.date),
          description: expense.description,
          reminderDate: expense.reminderDate
            ? new Date(expense.reminderDate)
            : null,
        }),
      });

      if (res.ok) {
        toast.success("✅ Expense added successfully!", { theme: "colored" }); // ✅ Success toast
        navigate("/expenses");
      } else {
        toast.error("❌ Failed to add expense", { theme: "colored" }); // ❌ Error toast
        // alert("Failed to add expense ❌");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-white to-blue-50">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-700">
          Add New Expense
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category */}
          <div>
            <label className="block mb-1 font-medium text-gray-600">Category</label>
            <input
              type="text"
              name="category"
              value={expense.category}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="e.g. Food, Transport"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block mb-1 font-medium text-gray-600">Amount</label>
            <input
              type="number"
              name="amount"
              value={expense.amount}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              step="0.01"
              placeholder="Enter amount"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block mb-1 font-medium text-gray-600">Date</label>
            <input
              type="date"
              name="date"
              value={expense.date}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium text-gray-600">
              Description
            </label>
            <textarea
              name="description"
              value={expense.description}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              rows="3"
              placeholder="Optional: write a note"
            />
          </div>

          {/* Reminder Date */}
          <div>
            <label className="block mb-1 font-medium text-gray-600">
              Reminder Date
            </label>
            <input
              type="date"
              name="reminderDate"
              value={expense.reminderDate}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg transition transform hover:scale-[1.02]"
          >
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
}
