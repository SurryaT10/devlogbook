from openai import OpenAI
from dotenv import load_dotenv
import os
from typing import List
import json

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_insights(text: str) -> dict:
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an AI Dev Coach. Given a developer's journal entry, "
                    "respond strictly in JSON format with the following keys:\n"
                    "`tasks_completed`, `challenges_faced`, `next_steps`, `suggestions`, `productivity_tip`.`mindset_insights`( 1-3 personalized reflective prompts, tool suggestions, or resource recommendations based on the entry)`\n"
                    "Each key should contain a brief, clear, and actionable string or list. Do not include any additional commentary."
                )
            },
            {
                "role": "user",
                "content": f"Here is the journal entry:\n{text}"
            }
        ],
        temperature=0.7
    )

    content = response.choices[0].message.content.strip()
    return json.loads(content)

def generate_weekly_summary_util(entries: List[dict]):
    text_dump = "\n\n".join(
        f"Entry {i+1}:\n"
        f"Tasks: {', '.join(entry['summary']['tasks_completed'])}\n"
        f"Challenges: {entry['summary']['challenges_faced']}\n"
        f"Next Steps: {entry['summary']['next_steps']}"
        for i, entry in enumerate(entries)
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
    return response