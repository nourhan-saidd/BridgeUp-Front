import React, { useContext } from "react";
import axiosinstance from "@/Context/BaseUrl/AxiosInstance";
import { authContext } from "@/Context/AuthContext/AuthContextProvider";
import { useQuery } from "@tanstack/react-query";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function ReportsAdmin() {
  const { token } = useContext(authContext);

  // ================= TRACK =================
  const getTrack = async () => {
    const res = await axiosinstance.get(
      "/api/v1/admin/reports/track-distribution",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  };

  const { data: track } = useQuery({
    queryKey: ["track"],
    queryFn: getTrack,
  });

  // ================= SCORES =================
  const getScores = async () => {
    const res = await axiosinstance.get(
      "/api/v1/admin/reports/average-scores",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  };

  const { data: scores } = useQuery({
    queryKey: ["scores"],
    queryFn: getScores,
  });

  // ================= COMPLETION =================
  const getCompletion = async () => {
    const res = await axiosinstance.get(
      "/api/v1/admin/reports/completion-rate",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  };

  const { data: completion } = useQuery({
    queryKey: ["completion"],
    queryFn: getCompletion,
  });

  // ================= COMPANIES =================
  const getCompanies = async () => {
    const res = await axiosinstance.get(
      "/api/v1/admin/reports/most-active-companies",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  };

  const { data: companies } = useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
  });

  // ================= LOADING =================
  if (!track || !scores || !completion || !companies) {
    return <h1>Loading...</h1>;
  }

  // ================= CHART OPTIONS =================
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  // ================= DATA =================
  const trackChart = {
    labels: ["Frontend", "Backend"],
    datasets: [
      {
        data: [track.data.frontend, track.data.backend],
        backgroundColor: ["#4F46E5", "#F97316"],
      },
    ],
  };

  const scoresChart = {
    labels: ["IQ", "English", "Technical"],
    datasets: [
      {
        label: "Average Scores",
        data: [
          scores.data.iq,
          scores.data.english,
          scores.data.technical,
        ],
        backgroundColor: ["#22C55E", "#3B82F6", "#A855F7"],
      },
    ],
  };

  const completionChart = {
    labels: ["3 Exams", "2 Exams", "1 Exam", "0 Exams"],
    datasets: [
      {
        data: [
          completion.data.completed3.percentage,
          completion.data.completed2.percentage,
          completion.data.completed1.percentage,
          completion.data.completed0.percentage,
        ],
        backgroundColor: ["#10B981", "#F59E0B", "#EF4444", "#6B7280"],
      },
    ],
  };

  return (
    <div className="p-4 bg-[#f3f0ff] min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Reports & Analytics</h1>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Track */}
        <div className="bg-white p-4 rounded-lg shadow-md h-[300px]">
          <h2 className="font-bold mb-2">Track Distribution</h2>
          <div className="h-[240px]">
            <Pie data={trackChart} options={chartOptions} />
          </div>
        </div>

        {/* Scores */}
        <div className="bg-white p-4 rounded-lg shadow-md h-[300px]">
          <h2 className="font-bold mb-2">Average Scores</h2>
          <div className="h-[240px]">
            <Bar data={scoresChart} options={chartOptions} />
          </div>
        </div>

        {/* Completion */}
        <div className="bg-white p-4 rounded-lg shadow-md h-[300px]">
          <h2 className="font-bold mb-2">Completion Rate</h2>
          <div className="h-[240px]">
            <Pie data={completionChart} options={chartOptions} />
          </div>
        </div>

        {/* Companies */}
        <div className="bg-white p-4 rounded-lg shadow-md h-[300px] overflow-auto">
          <h2 className="font-bold mb-3">Most Active Companies</h2>

          {companies.data.map((c: any, i: number) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between text-sm">
                <span>{c.companyName}</span>
                <span>{c.offersSent}</span>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded">
                <div
                  className="bg-indigo-600 h-2 rounded"
                  style={{ width: `${c.offersSent * 10}%` }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}