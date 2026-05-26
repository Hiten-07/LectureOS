# LectureOS
# 🎓 LectureOS

> An AI-powered lecture assistant that lets you chat with your study material using Retrieval-Augmented Generation (RAG).

![Python](https://img.shields.io/badge/Python-3.10+-blue?style=flat-square&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green?style=flat-square&logo=fastapi)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react)
![LangChain](https://img.shields.io/badge/LangChain-RAG-orange?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## 📌 What is LectureOS?

LectureOS is a full-stack AI chatbot that allows students to upload lecture notes, PDFs, or study material and **chat with it intelligently**. Instead of scrolling through pages of notes, just ask a question and get a precise, context-aware answer.

Built with a RAG (Retrieval-Augmented Generation) pipeline — meaning answers are grounded in your actual documents, not hallucinated.

---

## ✨ Features

- 📄 Upload PDFs and lecture notes
- 🤖 Chat with your documents using natural language
- 🔍 RAG pipeline for accurate, context-aware answers
- ⚡ Fast responses powered by Groq API
- 🧠 Vector search using ChromaDB
- 🌐 Clean React frontend
- 🔒 Secure — API keys never exposed

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, JavaScript |
| Backend | Python, FastAPI |
| AI / LLM | Groq API (LLaMA) |
| RAG Framework | LangChain |
| Vector Database | ChromaDB |
| Embeddings | Ollama / HuggingFace |

---

## 📁 Project Structure

```
LectureOS/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── rag_pipeline.py      # LangChain RAG logic
│   ├── vector_store.py      # ChromaDB setup
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment variable template
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/
│   ├── public/
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- [Groq API Key](https://console.groq.com)
- [Ollama](https://ollama.ai) (for local embeddings)

---

### 1. Clone the repository

```bash
git clone https://github.com/Hiten-07/LectureOS.git
cd LectureOS
```

---

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add your API keys
```

**Start the backend:**
```bash
uvicorn main:app --reload
```
Backend runs at `http://localhost:8000`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

---

### 4. Environment Variables

Create a `.env` file in the `backend/` folder based on `.env.example`:

```env
ANTHROPIC_API_KEY=your_anthropic_key_here
OPENAI_API_KEY=your_openai_key_here
GROQ_API_KEY=your_groq_key_here
```

> ⚠️ Never commit your `.env` file. It is already added to `.gitignore`.

---

## 💬 How It Works

```
User uploads PDF → Text is chunked → Chunks are embedded → Stored in ChromaDB
                                                                    ↓
User asks question → Question is embedded → Similar chunks retrieved
                                                                    ↓
                                          Groq LLM generates answer using chunks
```

1. **Ingestion** — PDFs are parsed, split into chunks, and stored as vector embeddings in ChromaDB
2. **Retrieval** — When a question is asked, the most relevant chunks are retrieved via similarity search
3. **Generation** — Groq's LLaMA model generates a grounded answer using the retrieved context

---

## 🔮 Roadmap

- [ ] Multi-document support
- [ ] User authentication
- [ ] Chat history persistence
- [ ] Deploy to Vercel + Render
- [ ] Support for YouTube lecture transcripts
- [ ] Mobile-friendly UI

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Hiten-07**
- GitHub: [@Hiten-07](https://github.com/Hiten-07)

---

> Built with ❤️ to make studying smarter, not harder.
