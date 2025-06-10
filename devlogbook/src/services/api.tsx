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