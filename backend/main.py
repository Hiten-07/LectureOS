from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel
import uuid
import shutil
import os
from ingest import extract_pdf_text
from chunk import ingest_document
from rag import get_rag_answer
from generate import generate_summary, generate_flashcards, generate_quiz

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# In-memory store for lecture texts
lecture_texts = {}

class ChatRequest(BaseModel):
    question: str

@app.get("/")
def root():
    return {"status": "LectureOS is running"}

@app.post("/upload")
async def upload_lecture(file: UploadFile = File(...)):
    lecture_id = str(uuid.uuid4())
    tmp_path = f"./tmp_{lecture_id}_{file.filename}"

    with open(tmp_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    try:
        text = extract_pdf_text(tmp_path)
        chunk_count = ingest_document(text, lecture_id)
        # Store text for generation endpoints
        lecture_texts[lecture_id] = text
        os.remove(tmp_path)
        return {
            "lecture_id": lecture_id,
            "chunks_stored": chunk_count,
            "status": "ready"
        }
    except Exception as e:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
        return {"error": str(e)}

@app.post("/lecture/{lecture_id}/chat")
async def chat(lecture_id: str, body: ChatRequest):
    result = get_rag_answer(body.question, lecture_id)
    return result

@app.get("/lecture/{lecture_id}/summary")
async def summary(lecture_id: str):
    text = lecture_texts.get(lecture_id)
    if not text:
        return {"error": "Lecture not found. Please re-upload."}
    return generate_summary(text)

@app.get("/lecture/{lecture_id}/flashcards")
async def flashcards(lecture_id: str):
    text = lecture_texts.get(lecture_id)
    if not text:
        return {"error": "Lecture not found. Please re-upload."}
    return generate_flashcards(text)

@app.get("/lecture/{lecture_id}/quiz")
async def quiz(lecture_id: str):
    text = lecture_texts.get(lecture_id)
    if not text:
        return {"error": "Lecture not found. Please re-upload."}
    return generate_quiz(text)