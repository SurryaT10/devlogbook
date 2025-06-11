from ai_utils import generate_weekly_summary_util
from typing import List
import json
from pydantic import BaseModel
from collections import defaultdict
from datetime import datetime

class DailyChartData(BaseModel):
    day: str
    tasks: int
    blockers: int

class WeeklySummary(BaseModel):
    progress_overview: str
    top_blockers: List[str]
    suggestions: List[str]
    productivity_summary: str
    report_text: str
    daily_chart_data: List[DailyChartData]

def normalize_list(value):
    if isinstance(value, list):
        return value
    elif isinstance(value, str):
        return [item.strip() for item in value.split(',') if item.strip()]
    return []

def generate_weekly_summary(entries: List[dict]) -> dict:
    response = generate_weekly_summary_util(entries)

    summary = json.loads(response.choices[0].message.content)
    summary["top_blockers"] = normalize_list(summary.get("top_blockers", []))
    summary["suggestions"] = normalize_list(summary.get("suggestions", []))

    # Compute daily_chart_data
    day_counts = defaultdict(lambda: {"tasks": 0, "blockers": 0})
    for entry in entries:
        print(entry)
        date = datetime.strptime(entry['date'], "%Y-%m-%d")
        day = date.strftime("%a")
        day_counts[day]["tasks"] += len(entry['summary']["tasks_completed"])
        if entry['summary']["challenges_faced"]:
            day_counts[day]["blockers"] += 1

    WEEK_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    daily_chart_data = [
        {"day": day, **day_counts.get(day, {"tasks": 0, "blockers": 0})}
        for day in WEEK_ORDER if day in day_counts
    ]

    summary["daily_chart_data"] = daily_chart_data
    
    print(summary)
    return summary