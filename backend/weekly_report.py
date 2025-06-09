# backend/weekly_report.py

from fastapi import APIRouter, HTTPException
from openai import OpenAI
from dotenv import load_dotenv
import os
from typing import List
import firebase_admin
from firebase_admin import credentials, firestore

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Firebase init (assumes service account JSON at root)
if not firebase_admin._apps:
    cred = credentials.Certificate("firebase_service_account.json")
    firebase_admin.initialize_app(cred)
db = firestore.client()

router = APIRouter()

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
                "- progress_overview\n- top_blockers\n- suggestions\n- productivity_summary\n- report_text"
            )},
            {"role": "user", "content": text_dump}
        ]
    )

    import json
    return json.loads(response.choices[0].message.content)