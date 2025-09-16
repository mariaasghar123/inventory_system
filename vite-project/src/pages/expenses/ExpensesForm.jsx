import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// ✅ Use environment variable for backend URL
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ExpenseEditForm() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExpense() {
      try {
        const res = await fetch(`${BASE_URL}/api/expenses/${id}`);
        const data = await res.json();

        setCategory(data.category);
        setAmount(data.amount);
        setDate(data.date.split("T")[0]);
        setDescription(data.description || "");
        setReminderDate(
          data.reminderDate ? data.reminderDate.split("T")[0] : ""
        );
      } catch (err) {
        console.error(err);
        alert("Failed to fetch expense data");
      } finally {
        setLoading(false);
      }
    }

    fetchExpense();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedExpense = {
      category,
      amount: parseFloat(amount),
      date,
      description,
      reminderDate: reminderDate || null,
    };

    try {
      const res = await fetch(`${BASE_URL}/api/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedExpense),
      });

      if (res.ok) {
        alert("Expense updated successfully!");
        navigate("/expenses");
      } else {
        alert("Failed to update expense.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50">
        <p className="text-gray-500 text-lg animate-pulse">Loading expense data...</p>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-white to-blue-50">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-700">
          Edit Expense
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category */}
          <div>
            <label className="block mb-1 font-medium text-gray-600">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block mb-1 font-medium text-gray-600">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block mb-1 font-medium text-gray-600">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              rows={3}
              placeholder="Optional: write a note"
            />
          </div>

          {/* Reminder Date */}
          <div>
            <label className="block mb-1 font-medium text-gray-600">
              Reminder Date (Optional)
            </label>
            <input
              type="date"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg transition transform hover:scale-[1.02]"
          >
            Update Expense
          </button>
        </form>
      </div>
    </div>
  );
}
