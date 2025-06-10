"use client";

import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { getWeeklyReport } from "@/services/api";

interface WeeklySummary {
  progress_overview: string;
  top_blockers: string[];
  suggestions: string[];
  productivity_summary: string;
  report_text: string;
}

const isEmptyReport = (report: Partial<WeeklySummary> | null): boolean => {
  if (!report) return true;
  return (
    !report.report_text &&
    (!report.top_blockers || report.top_blockers.length === 0) &&
    (!report.suggestions || report.suggestions.length === 0) &&
    !report.productivity_summary
  );
};

const WeeklyReport: React.FC = () => {
  const [report, setReport] = useState<WeeklySummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const result = await getWeeklyReport();
      setReport(result);
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (isEmptyReport(report)) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info text-center">
          🛑 No weekly report available yet. Try submitting a few entries first!
        </div>
      </div>
    );
  }

  const dummyChartData = [
    { day: 'Mon', tasks: 3, blockers: 1 },
    { day: 'Tue', tasks: 2, blockers: 2 },
    { day: 'Wed', tasks: 4, blockers: 0 },
    { day: 'Thu', tasks: 1, blockers: 2 },
    { day: 'Fri', tasks: 5, blockers: 1 },
  ];

  return (
    <div className="container mt-5">
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="card-title">📊 Weekly Dev Report</h4>
          <p className="card-text">{report?.report_text}</p>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">🔥 Common Blockers</h5>
              <ul className="list-group list-group-flush">
                {report?.top_blockers.map((b, i) => (
                  <li key={i} className="list-group-item">{b}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">⏰ Productivity Summary</h5>
              <p className="card-text">{report?.productivity_summary}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <h5 className="card-title">📈 Task vs Challenge Trend</h5>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dummyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="tasks" stroke="#28a745" strokeWidth={2} />
              <Line type="monotone" dataKey="blockers" stroke="#dc3545" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport;
