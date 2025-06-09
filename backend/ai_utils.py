from openai import OpenAI
from dotenv import load_dotenv
import os

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

    import json
    content = response.choices[0].message.content.strip()
    return json.loads(content)
