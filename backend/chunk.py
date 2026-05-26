from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
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

    embeddings = FastEmbedEmbeddings()
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