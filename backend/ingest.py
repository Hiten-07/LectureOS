import fitz  # PyMuPDF
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

def extract_pdf_text(file_path: str) -> str:
    doc = fitz.open(file_path)
    pages = []
    for page in doc:
        text = page.get_text()
        pages.append(text)
    doc.close()
    return "\n\n".join(pages)

# Test it
if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python ingest.py yourfile.pdf")
    else:
        text = extract_pdf_text(sys.argv[1])
        print(f"Extracted {len(text)} characters")
        print("First 500 characters:")
        print(text[:500])