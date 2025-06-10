"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getSummary } from "../services/api";
import 'bootstrap/dist/css/bootstrap.min.css';

interface Summary {
  tasks_completed: string[];
  challenges_faced: string;
  next_steps: string;
  suggestions: string[];
  productivity_tip: string;
  mindset_insights: string[];
}

function App() {
  const [entry, setEntry] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);

  const handleSubmit = async () => {
    const result = await getSummary(entry);
    setSummary(result);
  };

  useEffect(() => {
    if (summary) {
      // Load Bootstrap tooltip only on the client
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
      <div className="text-end mt-3">
        <Link href="/weekly-report">
          <button className="btn btn-outline-success">📊 View Weekly Report</button>
        </Link>
      </div>
      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold">📝 DevLogBook</h1>
        <p className="lead">Smart insights from your dev journal entries</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <label htmlFor="journalEntry" className="form-label fw-semibold">
                Today&apos;s Journal Entry
              </label>
              <textarea
                className="form-control mb-3"
                id="journalEntry"
                rows={8}
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                placeholder="What did you work on today?"
              ></textarea>

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
            <div className="card shadow-sm mt-4">
              <div className="card-body">
                <h4 className="card-title text-primary mb-4">🧠 Developer Insights</h4>

                {summary?.tasks_completed.length > 0 && <Section title="✅ Tasks Completed" items={summary.tasks_completed} />}
                {summary?.challenges_faced.length > 0 && <Section title="⚠️ Challenges Faced" items={summary.challenges_faced} />}
                {summary?.next_steps.length > 0 && <Section title="🔜 Next Steps" items={summary.next_steps} />}
                {summary?.suggestions.length > 0 && <Section title="💡 Suggestions" items={summary.suggestions} />}
                {summary?.productivity_tip.length > 0 && <Section title="🧠 Productivity Tip" items={summary.productivity_tip} />}
                {summary?.mindset_insights.length > 0 && (
                  <Section
                    title={
                      <>
                        🧠 Developer Mindset Insights
                        <span
                          className="ms-1"
                          data-bs-toggle="tooltip"
                          title="These insights help you reflect on habits and improve your developer mindset."
                          style={{ cursor: "pointer"}}
                        >
                          ℹ️
                        </span>
                      </>
                    }
                    items={summary.mindset_insights}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, items }) {
  return (
    <div className="mb-3">
      <h6 className="fw-bold">{title}</h6>
      {Array.isArray(items) ? (
        <ul className="mb-0">
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>{items}</p>
      )}
    </div>
  );
}

export default App;
