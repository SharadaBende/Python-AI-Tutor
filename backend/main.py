# -*- coding: utf-8 -*-
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
import os
import subprocess
from passlib.context import CryptContext
from database import init_db, SessionLocal, User, Progress

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
def register(data: RegisterRequest):
    db = SessionLocal()
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        db.close()
        return {"success": False, "error": "इस email से पहले से account बना हुआ है"}

    hashed = pwd_context.hash(data.password)
    user = User(name=data.name, email=data.email, password_hash=hashed)
    db.add(user)
    db.commit()
    user_id = user.id
    db.close()
    return {"success": True, "user_id": user_id, "name": data.name}


@app.post("/login")
def login(data: LoginRequest):
    db = SessionLocal()
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not pwd_context.verify(data.password, user.password_hash):
        db.close()
        return {"success": False, "error": "Email या password गलत है"}

    user_id = user.id
    name = user.name
    db.close()
    return {"success": True, "user_id": user_id, "name": name}