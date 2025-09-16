import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// ✅ Centralized Base URL
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function LiveChart() {
  const [chartData, setChartData] = useState(null);

  // ✅ API se data fetch karne ka function
  const fetchData = () => {
    fetch(`${BASE_URL}/api/dashboard/chart-data`)
      .then((res) => res.json())
      .then((data) => {
        const labels = data.map((item) => item.month);
        const sales = data.map((item) => item.sales);
        const purchases = data.map((item) => item.purchases);
        const expenses = data.map((item) => item.expenses);

        setChartData({
          labels,
          datasets: [
            {
              label: "Sales",
              data: sales,
              backgroundColor: "#34D399",
            },
            {
              label: "Purchases",
              data: purchases,
              backgroundColor: "#6366F1",
            },
            {
              label: "Expenses",
              data: expenses,
              backgroundColor: "#F59E0B",
            },
          ],
        });
      })
      .catch((err) => console.error("Chart data fetch error:", err));
  };

  // ✅ useEffect ke andar interval setup
  useEffect(() => {
    fetchData(); // component load hone par pehli dafa call

    const interval = setInterval(fetchData, 10000); // har 10 sec me data update

    return () => clearInterval(interval); // cleanup jab component unmount ho
  }, []);

  if (!chartData) return <p>Loading Chart...</p>;

  return (
    <div className="bg-white p-6 rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4">Monthly Performance</h2>
      <Bar data={chartData} />
    </div>
  );
}
