from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_community.embeddings import FakeEmbeddings
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

class GroqEmbeddings:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    
    def embed_documents(self, texts):
        return [self._embed(t) for t in texts]
    
    def embed_query(self, text):
        return self._embed(text)
    
    def _embed(self, text):
        import hashlib
        hash_val = hashlib.md5(text.encode()).digest()
        return [float(b)/255.0 for b in hash_val] * 24

def ingest_document(text: str, lecture_id: str) -> int:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        separators=["\n\n", "\n", ". ", " "]
    )
    chunks = splitter.split_text(text)
    print(f"Split into {len(chunks)} chunks")
    embeddings = GroqEmbeddings()
    vectorstore = Chroma(
        collection_name=f"lecture_{lecture_id}",
        embedding_function=embeddings,
        persist_directory="./chroma_db"
    )
    vectorstore.add_texts(
        texts=chunks,
        metadatas=[{"lecture_id": lecture_id, "chunk_idx": i}
                   for i, _ in enumerate(chunks)]
    )
    print(f"Stored {len(chunks)} chunks in ChromaDB")
    return len(chunks)
