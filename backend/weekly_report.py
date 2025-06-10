from ai_utils import generate_weekly_summary_util
from typing import List
import json

def normalize_list(value):
    if isinstance(value, list):
        return value
    elif isinstance(value, str):
        return [item.strip() for item in value.split(',') if item.strip()]
    return []

def generate_weekly_summary(summaries: List[dict]) -> dict:
    response = generate_weekly_summary_util(summaries)

    summary = json.loads(response.choices[0].message.content)
    summary["top_blockers"] = normalize_list(summary.get("top_blockers", []))
    summary["suggestions"] = normalize_list(summary.get("suggestions", []))
    
    return summary