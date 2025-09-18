import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function ProfitLoss() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProfitLoss = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end date");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await fetch(
        `http://localhost:5000/api/profit-loss?startDate=${startDate}&endDate=${endDate}`
      );
      if (!res.ok) throw new Error("Failed to fetch data");
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setStartDate(today);
    setEndDate(today);
  }, []);

  // Chart data bana li
  const chartData = data
    ? [
        { name: "Sales", amount: data.totalSales },
        { name: "Discounts", amount: data.totalDiscounts },
        { name: "Returns", amount: data.totalReturns },
        { name: "COGS", amount: data.totalCOGS },
        { name: "Expenses", amount: data.totalExpenses },
        { name: "Profit", amount: data.profit },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-gray-700 mb-6 text-center">
          📊 Profit & Loss Report
        </h1>

        {/* Date Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm mb-1">Start Date</label>
            <input
              type="date"
              className="border rounded-lg p-2"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm mb-1">End Date</label>
            <input
              type="date"
              className="border rounded-lg p-2"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button
            onClick={fetchProfitLoss}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg mt-6 md:mt-auto"
          >
            Fetch Report
          </button>
        </div>

        {/* Loading & Error */}
        {loading && <p className="text-blue-600 text-center">Loading...</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}

        {/* Chart */}
        {/* {data && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">
              📈 Summary Chart
            </h2>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )} */}
        


        {/* Data Display */}
        {data && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg shadow">
              <h2 className="font-semibold text-green-700">Total Sales</h2>
              <p className="text-2xl font-bold text-green-800">
                Rs. {data.totalSales.toFixed(2)}
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg shadow">
              <h2 className="font-semibold text-yellow-700">Total Discounts</h2>
              <p className="text-2xl font-bold text-yellow-800">
                Rs. {data.totalDiscounts.toFixed(2)}
              </p>
            </div>

            <div className="bg-red-50 p-4 rounded-lg shadow">
              <h2 className="font-semibold text-red-700">Total Returns</h2>
              <p className="text-2xl font-bold text-red-800">
                Rs. {data.totalReturns.toFixed(2)}
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg shadow">
              <h2 className="font-semibold text-purple-700">COGS</h2>
              <p className="text-2xl font-bold text-purple-800">
                Rs. {data.totalCOGS.toFixed(2)}
              </p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg shadow">
              <h2 className="font-semibold text-orange-700">Total Expenses</h2>
              <p className="text-2xl font-bold text-orange-800">
                Rs. {data.totalExpenses.toFixed(2)}
              </p>
            </div>

            <div
              className={`p-4 rounded-lg shadow ${
                data.profit >= 0 ? "bg-teal-50" : "bg-red-100"
              }`}
            >
              <h2
                className={`font-semibold ${
                  data.profit >= 0 ? "text-teal-700" : "text-red-700"
                }`}
              >
                Net Profit
              </h2>
              <p
                className={`text-2xl font-bold ${
                  data.profit >= 0 ? "text-teal-800" : "text-red-800"
                }`}
              >
                Rs. {data.profit.toFixed(2)}
              </p>
            </div>
          </div>
        )}
        {/* Chart */}
{data && (
  <div className="mb-8 mt-10">
    <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">
      📈 Summary Chart
    </h2>
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#3b82f6"
            strokeWidth={3}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
)}
      </div>
    </div>
  );
}
