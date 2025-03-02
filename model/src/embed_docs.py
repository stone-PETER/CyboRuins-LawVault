import faiss
import numpy as np
import os
from sentence_transformers import SentenceTransformer
from extract_pdfs import extract_text_from_pdfs, extract_pdfs_from_zip

# Constants
ZIP_FILE_PATH = "model/data/legal_docs.zip"
EXTRACT_PATH = "model/data/temp_pdfs/"

# First, ensure PDFs are extracted
if not os.path.exists(EXTRACT_PATH) or not os.listdir(EXTRACT_PATH):
    print("Extracting PDFs from ZIP file...")
    extract_pdfs_from_zip(ZIP_FILE_PATH, EXTRACT_PATH)

# Load Sentence Transformer Model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Extract Text
pdf_texts = extract_text_from_pdfs(EXTRACT_PATH)
if not pdf_texts:
    raise ValueError(
        f"No PDF files found in {EXTRACT_PATH}. Please ensure legal_docs.zip contains PDF files.")

doc_names = list(pdf_texts.keys())
doc_texts = list(pdf_texts.values())

# Convert to Embeddings
embeddings = model.encode(doc_texts, convert_to_numpy=True)

# Check if embeddings have the expected shape
if embeddings.ndim != 2 or embeddings.shape[0] == 0:
    raise ValueError("Embeddings have an unexpected shape or are empty.")

# Store in FAISS
dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(embeddings)

# Create directory if it doesn't exist
os.makedirs("model/data", exist_ok=True)

# Save FAISS index
faiss.write_index(index, "model/data/legal_faiss.index")
np.save("model/data/doc_names.npy", doc_names)

print("✅ FAISS Index Created & Saved!")
