"use client";

import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { v4 as uuidv4 } from 'uuid';
import { createGoal } from "@/services/api";

const GoalCreation: React.FC = () => {
  const [title, setTitle] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const goal = {
      id: uuidv4(),
      title: title.trim(),
      keywords: keywords.split(",").map(k => k.trim().toLowerCase()).filter(Boolean),
      created_at: new Date().toISOString(),
      progress: [],
    };

    try {
      await createGoal(goal);
      setMessage("✅ Goal created successfully!");
      setTitle("");
      setKeywords("");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to create goal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="card-title mb-3">🎯 Create a New Goal</h4>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="goalTitle" className="form-label">Goal Title</label>
              <input
                type="text"
                className="form-control"
                id="goalTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Learn GraphQL"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="keywords" className="form-label">Keywords (comma separated)</label>
              <input
                type="text"
                className="form-control"
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. graphql, apollo, resolver"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Goal"}
            </button>
          </form>

          {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default GoalCreation;
