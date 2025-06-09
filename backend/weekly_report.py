from fastapi import APIRouter, HTTPException
from openai import OpenAI
from dotenv import load_dotenv
import os
from typing import List

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

router = APIRouter()

def normalize_list(value):
    if isinstance(value, list):
        return value
    elif isinstance(value, str):
        return [item.strip() for item in value.split(',') if item.strip()]
    return []

def generate_weekly_summary(summaries: List[dict]) -> dict:
    text_dump = "\n\n".join(
        f"Entry {i+1}:\n"
        f"Tasks: {', '.join(entry['tasks_completed'])}\n"
        f"Challenges: {entry['challenges_faced']}\n"
        f"Next Steps: {entry['next_steps']}"
        for i, entry in enumerate(summaries)
    )

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": (
                "You are an AI coach. Analyze this week's dev logs. Return JSON with:\n"
                "- progress_overview\n- top_blockers\n- suggestions\n- productivity_summary\n- report_text\n"
                "Each key should contain a brief, clear, and actionable string or list. Do not include any additional commentary."
            )},
            {"role": "user", "content": text_dump}
        ]
    )
    
    # Normalize fields
    import json
    summary = json.loads(response.choices[0].message.content)
    summary["top_blockers"] = normalize_list(summary.get("top_blockers", []))
    summary["suggestions"] = normalize_list(summary.get("suggestions", []))
    
    return summary