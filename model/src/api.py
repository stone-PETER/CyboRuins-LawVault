from fastapi import FastAPI
from pydantic import BaseModel
from model.src.gemini_chatbot import chat_with_gemini
from fastapi.middleware.cors import CORSMiddleware  # Add this line

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

class Query(BaseModel):
    question: str


@app.post("/legal-advisory/")
def get_legal_advice(query: Query):
    print("hi")  # Just checking if the route is getting hit
    response = chat_with_gemini(query.question)
    return {"response": response}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
