from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from ai_utils import generate_insights
from weekly_report import generate_weekly_summary 

app = FastAPI()

# Allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

class JournalEntry(BaseModel):
    text: str
    
entries = []

@app.post("/summarize")
async def summarize(entry: JournalEntry):
    try:
        summary = generate_insights(entry.text)
        entries.append({
            "text": entry.text,
            "date": datetime.now(),
            "summary": summary
        })
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/weekly-report")
async def weekly_report():
    one_week_ago = datetime.now() - timedelta(days=7)
    summaries = [entry["summary"] for entry in entries]
    
    if (len(summaries) == 0): return {}
    
    return generate_weekly_summary(summaries)
