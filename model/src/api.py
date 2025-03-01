from fastapi import FastAPI
from gemini_chatbot import chat_with_gemini
from extract_pdfs import extract_text_from_pdfs

app = FastAPI()

pdf_texts = extract_text_from_pdfs("model/data/temp_pdfs")  # Load legal docs


@app.get("/legal-advisory/")
def legal_advisory(query: str):
    answer = chat_with_gemini(query, pdf_texts)
    return {"query": query, "response": answer}

# Run: uvicorn src.api:app --reload
