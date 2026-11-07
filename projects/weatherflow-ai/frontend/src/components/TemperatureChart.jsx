
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function TemperatureChart({ forecast }) {
  const chartData = forecast.map((day) => ({
    date: new Date(day.date + "T12:00:00").toLocaleDateString(
      "fr-FR",
      {
        weekday: "short",
        day: "numeric",
      }
    ),
    "Température maximale": day.temperature_max,
    "Température minimale": day.temperature_min,
  }));

  return (
    <section className="mt-8 rounded-3xl border border-white/10 bg-[#111a2c] p-6">

      <div className="mb-6">
        <h3 className="text-xl font-bold">
          Évolution des températures
        </h3>

        <p className="mt-2 text-sm text-gray-400">
          Comparaison des températures minimales et maximales sur 7 jours
        </p>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
            />

            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              tick={{ fontSize: 12 }}
            />

            <YAxis
              stroke="#94a3b8"
              unit="°C"
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "12px",
                color: "#ffffff",
              }}
              formatter={(value) => [`${value} °C`]}
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="Température maximale"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />

            <Line
              type="monotone"
              dataKey="Température minimale"
              stroke="#38bdf8"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />

          </LineChart>
        </ResponsiveContainer>
      </div>

    </section>
  );
}

export default TemperatureChart;
