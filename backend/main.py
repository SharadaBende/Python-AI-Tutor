# -*- coding: utf-8 -*-
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
import os
import subprocess
from passlib.context import CryptContext
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import init_db, SessionLocal, User, Progress, get_db
from datetime import date, timedelta

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

init_db()
pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")

def update_streak(user: User) -> int:
    """
    Updates user.streak_days based on today's date vs the last day they
    were active. Called on login and on any progress update, since both
    signal the user showed up today. Safe to call more than once per
    day — only the first call each day changes anything.

    Returns the current streak_days after updating.
    """
    today = date.today().isoformat()

    if user.last_active_date == today:
        # Already counted today — no change.
        return user.streak_days or 0

    yesterday = (date.today() - timedelta(days=1)).isoformat()

    if user.last_active_date == yesterday:
        # Continuing an existing streak.
        user.streak_days = (user.streak_days or 0) + 1
    else:
        # First day, or a day (or more) was missed — streak restarts.
        user.streak_days = 1

    user.last_active_date = today
    return user.streak_days

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class Message(BaseModel):
    message: str
    conversation_history: list = []

class CodeRequest(BaseModel):
    command: str

@app.post("/chat")
def chat(data: Message):
    system_prompt = """You are Pyra, a Python tutor for visually impaired students. Always reply in Hindi using Devanagari script."""
    messages = data.conversation_history + [
        {"role": "user", "content": data.message}
    ]
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "system", "content": system_prompt}] + messages,
        max_tokens=500,
    )
    reply = response.choices[0].message.content
    return {"reply": reply}

@app.post("/generate-code")
def generate_code(data: CodeRequest):
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You are a Python code generator. Generate ONLY raw Python code. No explanations, no markdown, no backticks. Use hardcoded English values only, never use input(). Keep it simple."},
            {"role": "user", "content": f"Python code to: {data.command}"}
        ],
        max_tokens=300,
    )
    code = response.choices[0].message.content
    code = code.replace("```python", "").replace("```", "").strip()
    full_code = "import sys\nsys.stdout.reconfigure(encoding='utf-8')\n" + code
    try:
        result = subprocess.run(
            ["python", "-c", full_code],
            capture_output=True,
            timeout=10,
            env={**os.environ, "PYTHONIOENCODING": "utf-8"}
        )
        output = result.stdout.decode("utf-8").strip() if result.stdout else result.stderr.decode("utf-8").strip()
    except subprocess.TimeoutExpired:
        output = "Code timeout ho gaya"
    except Exception as e:
        output = str(e)
    return {"code": code, "output": output}



class LessonRequest(BaseModel):
    topic: str
    student_name: str

@app.post("/get-lesson")
def get_lesson(data: LessonRequest):
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": """You are Pyra, a Python tutor for visually impaired students in India. 
Always reply in Hindi using Devanagari script.
Keep explanation short, simple, and clear — max 4 lines.
Use a real life example that a blind person can relate to.
Never use visual examples like colors or images.
End with one simple example code if needed."""},
            {"role": "user", "content": f"Student ka naam {data.student_name} hai. Unhe {data.topic} samjhao."}
        ],
        max_tokens=300,
    )
    return {"lesson": response.choices[0].message.content}



@app.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        return {"success": False, "error": "इस email से पहले से account बना हुआ है"}

    hashed = pwd_context.hash(data.password)
    user = User(name=data.name, email=data.email, password_hash=hashed)
    db.add(user)
    db.commit()
    user_id = user.id
    return {"success": True, "user_id": user_id, "name": data.name}


@app.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not pwd_context.verify(data.password, user.password_hash):
        return {"success": False, "error": "Email या password गलत है"}

    streak = update_streak(user)
    db.commit()

    return {
        "success": True,
        "user_id": user.id,
        "name": user.name,
        "streak_days": streak,
        "speech_rate": user.speech_rate,
        "voice_pitch": user.voice_pitch,
    }

class ProgressUpdateRequest(BaseModel):
    user_id: int
    language: str
    instruction_language: str = "hindi"
    lessons_done: bool | None = None
    current_lesson_index: int | None = None
    mcq_done: bool | None = None
    current_mcq_index: int | None = None
    mcq_score: int | None = None
    agent_done: bool | None = None

@app.post("/progress/update")
def update_progress(data: ProgressUpdateRequest, db: Session = Depends(get_db)):
    record = (
        db.query(Progress)
        .filter(
            Progress.user_id == data.user_id,
            Progress.language == data.language,
            Progress.instruction_language == data.instruction_language,
        )
        .first()
    )
    if record is None:
        record = Progress(
            user_id=data.user_id,
            language=data.language,
            instruction_language=data.instruction_language,
        )
        db.add(record)

    if data.lessons_done is not None:
        record.lessons_done = data.lessons_done
    if data.current_lesson_index is not None:
        record.current_lesson_index = data.current_lesson_index
    if data.mcq_done is not None:
        record.mcq_done = data.mcq_done
    if data.current_mcq_index is not None:
        record.current_mcq_index = data.current_mcq_index
    if data.mcq_score is not None:
        record.mcq_score = data.mcq_score
    if data.agent_done is not None:
        record.agent_done = data.agent_done

    streak = 0
    user = db.query(User).filter(User.id == data.user_id).first()
    if user is not None:
        streak = update_streak(user)

    db.commit()
    result = {
        "language": record.language,
        "instruction_language": record.instruction_language,
        "lessons_done": record.lessons_done,
        "current_lesson_index": record.current_lesson_index,
        "mcq_done": record.mcq_done,
        "current_mcq_index": record.current_mcq_index,
        "mcq_score": record.mcq_score,
        "agent_done": record.agent_done,
    }
    return {"success": True, "progress": result, "streak_days": streak}


@app.get("/progress/{user_id}")
def get_progress(user_id: int, db: Session = Depends(get_db)):
    records = db.query(Progress).filter(Progress.user_id == user_id).all()
    progress = [
        {
            "language": r.language,
            "instruction_language": r.instruction_language,
            "lessons_done": r.lessons_done,
            "current_lesson_index": r.current_lesson_index,
            "mcq_done": r.mcq_done,
            "current_mcq_index": r.current_mcq_index,
            "mcq_score": r.mcq_score,
            "agent_done": r.agent_done,
        }
        for r in records
    ]
    user = db.query(User).filter(User.id == user_id).first()
    streak_days = user.streak_days if user else 0
    return {"success": True, "progress": progress, "streak_days": streak_days}

class SpeechRateRequest(BaseModel):
    user_id: int
    speech_rate: float

@app.post("/settings/speech-rate")
def update_speech_rate(data: SpeechRateRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == data.user_id).first()
    if not user:
        return {"success": False, "error": "User not found"}
    user.speech_rate = data.speech_rate
    db.commit()
    return {"success": True, "speech_rate": user.speech_rate}


class VoicePitchRequest(BaseModel):
    user_id: int
    voice_pitch: float

@app.post("/settings/voice-pitch")
def update_voice_pitch(data: VoicePitchRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == data.user_id).first()
    if not user:
        return {"success": False, "error": "User not found"}
    user.voice_pitch = data.voice_pitch
    db.commit()
    return {"success": True, "voice_pitch": user.voice_pitch}