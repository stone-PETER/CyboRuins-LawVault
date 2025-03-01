import zipfile
import os
import PyPDF2


def extract_pdfs(zip_path, extract_folder):
    """Extract PDFs from ZIP file."""
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_folder)


def extract_text_from_pdfs(folder_path):
    """Extract text from all PDFs in a folder."""
    all_text = {}
    for filename in os.listdir(folder_path):
        if filename.endswith(".pdf"):
            pdf_path = os.path.join(folder_path, filename)
            with open(pdf_path, "rb") as pdf_file:
                reader = PyPDF2.PdfReader(pdf_file)
                text = "\n".join([page.extract_text()
                                 for page in reader.pages if page.extract_text()])
                all_text[filename] = text
    return all_text


# Paths
zip_path = "model/data/legal_docs.zip"
extract_folder = "model/data/temp_pdfs"

extract_pdfs(zip_path, extract_folder)
pdf_texts = extract_text_from_pdfs(extract_folder)
