from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
import os

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

class Message(BaseModel):
    message: str
    conversation_history: list = []

@app.post("/chat")
def chat(data: Message):
    system_prompt = """You are Pyra, a Python tutor for visually impaired students. You must always reply in Hindi language using Devanagari script (हिंदी में जवाब दो).

Rules:
1. हमेशा हिंदी में जवाब दो
2. सिर्फ programming words जैसे print, variable, loop, function English में रखो
3. पहले message में अपना नाम बताओ और student का नाम पूछो
4. बहुत simple और clear भाषा use करो
5. छोटे छोटे sentences लिखो
6. सिर्फ Python पढ़ाने पे focus करो

उदाहरण: "नमस्ते! मैं Pyra हूँ, आपकी Python tutor। आपका नाम क्या है?"
"""
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