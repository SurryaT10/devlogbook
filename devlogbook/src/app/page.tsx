"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getSummary } from "../services/api";
import GoalCreation from "./goal-creation/page";
import "bootstrap/dist/css/bootstrap.min.css";

interface Summary {
  tasks_completed: string[];
  challenges_faced: string;
  next_steps: string;
  suggestions: string[];
  productivity_tip: string;
  mindset_insights: string[];
}

export default function App() {
  const [entry, setEntry] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);

  const handleSubmit = async () => {
    const result = await getSummary(entry);
    setSummary(result);
  };

  useEffect(() => {
    if (summary) {
      import("bootstrap").then(({ Tooltip }) => {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach((tooltipTriggerEl) => {
          new Tooltip(tooltipTriggerEl);
        });
      });
    }
  }, [summary]);

  return (
    <div className="container mt-5">
      <div className="text-end">
        <Link href="/weekly-report">
          <button className="btn btn-outline-success">📊 View Weekly Report</button>
        </Link>
      </div>

      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold text-primary">📝 DevLogBook</h1>
        <p className="lead text-secondary">Smart insights from your dev journey</p>
      </div>

      <div className="row">
        <div className="col-md-8 mb-4">
          <div className="card shadow-sm border-primary">
            <div className="card-body">
              <h4 className="card-title text-primary mb-3">📓 Daily Dev Journal</h4>
              <textarea
                className="form-control mb-3"
                rows={7}
                placeholder="What did you work on today?"
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
              />
              <button
                className="btn btn-primary w-100"
                onClick={handleSubmit}
                disabled={!entry.trim()}
              >
                ✨ Generate AI Insight
              </button>
            </div>
          </div>

          {summary && (
            <div className="card shadow-sm border-success mt-4">
              <div className="card-body">
                <h5 className="card-title text-success mb-3">🧠 Developer Insights</h5>
                <InsightSection title="✅ Tasks Completed" items={summary.tasks_completed} />
                <InsightSection title="⚠️ Challenges Faced" items={summary.challenges_faced} />
                <InsightSection title="🔜 Next Steps" items={summary.next_steps} />
                <InsightSection title="💡 Suggestions" items={summary.suggestions} />
                <InsightSection title="⚡ Productivity Tip" items={summary.productivity_tip} />
                <InsightSection
                  title={
                    <>
                      💭 Mindset Insights{" "}
                      <span
                        className="ms-1"
                        data-bs-toggle="tooltip"
                        title="These help improve your developer habits."
                        style={{ cursor: "pointer" }}
                      >
                        ℹ️
                      </span>
                    </>
                  }
                  items={summary.mindset_insights}
                />
              </div>
            </div>
          )}
        </div>

        <div className="col-md-4">
          <GoalCreation />
        </div>
      </div>
    </div>
  );
}

const InsightSection = ({ title, items }: { title: React.ReactNode; items: string[] | string }) => {
  return (
    <div className="mb-3">
      <h6 className="fw-bold">{title}</h6>
      {Array.isArray(items) ? (
        <ul className="mb-0">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>{items}</p>
      )}
    </div>
  );
};
