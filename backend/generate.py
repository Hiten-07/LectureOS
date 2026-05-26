import json
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def ask_groq(prompt: str) -> str:
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1500,
        temperature=0.3
    )
    return response.choices[0].message.content

def generate_summary(text: str) -> dict:
    prompt = f"""You are a study assistant. Given the lecture content below, create a structured summary.

Return ONLY valid JSON in exactly this format, nothing else:
{{
  "main_topic": "one sentence describing the main topic",
  "key_concepts": ["concept 1", "concept 2", "concept 3", "concept 4", "concept 5"],
  "definitions": {{"term1": "definition1", "term2": "definition2"}},
  "takeaways": ["takeaway 1", "takeaway 2", "takeaway 3"]
}}

Lecture content:
{text[:4000]}

Return ONLY the JSON object, no explanation, no markdown:"""

    raw = ask_groq(prompt)
    try:
        raw = raw.strip()
        start = raw.find('{')
        end = raw.rfind('}') + 1
        return json.loads(raw[start:end])
    except:
        return {
            "main_topic": "Could not parse summary",
            "key_concepts": [],
            "definitions": {},
            "takeaways": []
        }

def generate_flashcards(text: str) -> dict:
    prompt = f"""You are a study assistant. Create 8 flashcards from the lecture content below.

Return ONLY valid JSON in exactly this format, nothing else:
{{
  "flashcards": [
    {{"front": "question or term", "back": "answer or definition"}},
    {{"front": "question or term", "back": "answer or definition"}}
  ]
}}

Lecture content:
{text[:4000]}

Return ONLY the JSON object, no explanation, no markdown:"""

    raw = ask_groq(prompt)
    try:
        raw = raw.strip()
        start = raw.find('{')
        end = raw.rfind('}') + 1
        return json.loads(raw[start:end])
    except:
        return {"flashcards": []}

def generate_quiz(text: str) -> dict:
    prompt = f"""You are a study assistant. Create 5 multiple choice questions from the lecture content below.

Return ONLY valid JSON in exactly this format, nothing else:
{{
  "questions": [
    {{
      "question": "question text here",
      "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
      "correct": "A",
      "explanation": "why this answer is correct"
    }}
  ]
}}

Lecture content:
{text[:4000]}

Return ONLY the JSON object, no explanation, no markdown:"""

    raw = ask_groq(prompt)
    try:
        raw = raw.strip()
        start = raw.find('{')
        end = raw.rfind('}') + 1
        return json.loads(raw[start:end])
    except:
        return {"questions": []}