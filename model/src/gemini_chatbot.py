import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variable
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("❌ ERROR: GEMINI_API_KEY not found in .env file!")

# Configure Gemini API
genai.configure(api_key=api_key)


def chat_with_gemini(user_input, pdf_texts):
    """Fetch relevant legal info & get AI response."""
    relevant_docs = "\n".join(pdf_texts.values())[:2000]  # Limit context
    prompt = f"Legal Advisory AI:\nContext: {relevant_docs}\n\nUser Query: {user_input}\n\nAnswer:"

    response = genai.chat(messages=[{"role": "user", "content": prompt}])
    return response.text
