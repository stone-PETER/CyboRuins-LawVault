import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

# Load FAISS Index & Model
model = SentenceTransformer("all-MiniLM-L6-v2")
index = faiss.read_index("model/data/legal_faiss.index")
doc_names = np.load("model/data/doc_names.npy")


def search_legal_docs(query, top_k=3):
    query_embedding = model.encode([query], convert_to_numpy=True)
    distances, indices = index.search(query_embedding, top_k)

    relevant_docs = [doc_names[idx] for idx in indices[0]]
    return relevant_docs


if __name__ == "__main__":
    print(search_legal_docs("What is the punishment for fraud?"))
