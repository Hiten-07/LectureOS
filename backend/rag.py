from langchain_chroma import Chroma
from groq import Groq
from dotenv import load_dotenv
import os
import hashlib

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class GroqEmbeddings:
    def embed_documents(self, texts):
        return [self._embed(t) for t in texts]
    def embed_query(self, text):
        return self._embed(text)
    def _embed(self, text):
        hash_val = hashlib.md5(text.encode()).digest()
        return [float(b)/255.0 for b in hash_val] * 24

def ask_groq(prompt: str) -> str:
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=600,
        temperature=0.3
    )
    return response.choices[0].message.content

def get_rag_answer(question: str, lecture_id: str) -> dict:
    embeddings = GroqEmbeddings()
    vectorstore = Chroma(
        collection_name=f"lecture_{lecture_id}",
        embedding_function=embeddings,
        persist_directory="./chroma_db"
    )
    docs = vectorstore.similarity_search(question, k=4)
    context = "\n\n".join([d.page_content for d in docs])
    prompt = f"""Answer based ONLY on the content below.
If the answer is not in the content, say: "This topic wasn't covered."

Content:
{context}

Question: {question}

Answer:"""
    answer = ask_groq(prompt)
    return {
        "answer": answer,
        "sources": [d.page_content[:150] for d in docs]
    }
