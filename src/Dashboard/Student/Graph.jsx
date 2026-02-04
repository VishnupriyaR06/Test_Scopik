import axios from "axios";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useTheme from "/src/Hooks/ThemeHook";

function Graph() {
  const isDarkMode = useTheme();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const Uemail = localStorage.getItem("userEmail");

    axios
      .get(import.meta.env.VITE_STUDENT_PROGRESS, {
        params: { email: Uemail },
      })
      .then((response) => {
        const rawData = response.data.hours_spent || {};
        const formattedData = Object.entries(rawData).map(([date, time]) => ({
          date,
          time,
        }));
        setChartData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching graph data:", error);
      });
  }, []);

  return (
    <div
      className={`w-full max-w-4xl mx-auto rounded-xl shadow transition duration-300 ${
        isDarkMode ? "bg-zinc-900 text-white" : "bg-white text-black"
      }`}
    >
      {/* Optional Title */}
      <h2 className="text-lg sm:text-xl font-semibold px-4 pt-4 sm:pt-6">
        Hours Spent (Progress Graph)
      </h2>

      <div className="w-full h-[300px] sm:h-[350px] p-4 sm:p-6">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="date"
                stroke={isDarkMode ? "#f1f5f9" : "#333"}
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                interval="preserveStartEnd"
                height={50}
              />
              <YAxis
                stroke={isDarkMode ? "#f1f5f9" : "#333"}
                tick={{ fontSize: 10 }}
              />
              <CartesianGrid
                stroke={isDarkMode ? "#555" : "#ccc"}
                vertical={false}
              />
              <Line
                type="monotone"
                dataKey="time"
                stroke="#1763E5"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#333" : "#fff",
                  borderColor: "#888",
                  color: isDarkMode ? "#fff" : "#000",
                }}
                labelStyle={{ color: isDarkMode ? "#f1f5f9" : "#111" }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-sm text-gray-500 mt-10">
            No data available to display.
          </div>
        )}
      </div>
    </div>
  );
}

export default Graph;
