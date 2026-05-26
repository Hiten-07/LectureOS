from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from dotenv import load_dotenv

load_dotenv()

def ingest_document(text: str, lecture_id: str) -> int:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        separators=["\n\n", "\n", ". ", " "]
    )
    chunks = splitter.split_text(text)
    print(f"Split into {len(chunks)} chunks")

    # Free local embeddings — no API key needed
    embeddings = HuggingFaceEmbeddings(
        model_name="all-MiniLM-L6-v2"
    )
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

if __name__ == "__main__":
    from ingest import extract_pdf_text
    import sys
    path = sys.argv[1] if len(sys.argv) > 1 else None
    if not path:
        print("Usage: python chunk.py yourfile.pdf")
    else:
        text = extract_pdf_text(path)
        count = ingest_document(text, lecture_id="test_001")
        print(f"Done — {count} chunks ready for RAG")