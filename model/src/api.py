from fastapi import FastAPI
from pydantic import BaseModel
from model.src.gemini_chatbot import chat_with_gemini

app = FastAPI()


class Query(BaseModel):
    question: str


@app.post("/legal-advisory/")
def get_legal_advice(query: Query):
    print("hi")
    response = chat_with_gemini(query.question)
    return {"response": response}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
