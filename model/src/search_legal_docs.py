def search_relevant_text(query, pdf_texts, max_results=3):
    """Find legal documents related to user query."""
    relevant_texts = []
    query_words = set(query.lower().split())

    for file, text in pdf_texts.items():
        if any(word in text.lower() for word in query_words):
            relevant_texts.append(f"{file}: {text[:500]}")  # Limit text size

    return relevant_texts[:max_results]
