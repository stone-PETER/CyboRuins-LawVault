import google.generativeai as genai
import os
from dotenv import load_dotenv
from model.src.search_legal_docs import search_legal_docs

# Load API Key and configure
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=API_KEY)


def chat_with_gemini(user_input):
    try:
        # Get relevant documents
        relevant_docs = search_legal_docs(user_input, top_k=3)
        context = "\n".join(relevant_docs)

        # Create prompt
        prompt = f"Legal Advisory AI:\nContext: {context}\n\nUser Query: {user_input}\n\nAnswer:"

        # Generate response using Gemini Pro
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content(prompt)

        return response.text
    except Exception as e:
        return f"Error: {str(e)}"


if __name__ == "__main__":
    print(chat_with_gemini("What are the laws for cybercrime in India?"))
