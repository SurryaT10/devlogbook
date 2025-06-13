export async function getSummary(text: string) {
  const response = await fetch("http://localhost:8000/summarize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text })
  });

  const data = await response.json();

  return data.summary;
}

export async function getWeeklyReport() {
  const response = await fetch("http://localhost:8000/weekly-report");
  const data = await response.json();

  return data;
}

export async function createGoal(goal: any) {
  const response = await fetch("http://localhost:8000/goals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(goal),
  });

  if (!response.ok) throw new Error("Failed to create goal");
  return await response.json();
}
