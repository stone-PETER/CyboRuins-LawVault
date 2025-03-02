import os
import zipfile
import PyPDF2

ZIP_FILE_PATH = "model/data/legal_docs.zip"
EXTRACT_PATH = "model/data/temp_pdfs/"


def extract_pdfs_from_zip(zip_path, extract_to):
    """Extract PDFs from a ZIP file."""
    if not os.path.exists(extract_to):
        os.makedirs(extract_to)

    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_to)

    print(f"✅ Extracted PDFs to {extract_to}")


def extract_text_from_pdfs(pdf_folder):
    """Extract text from all PDFs in the extracted folder."""
    texts = {}

    for filename in os.listdir(pdf_folder):
        if filename.endswith(".PDF"):
            filepath = os.path.join(pdf_folder, filename)
            with open(filepath, "rb") as file:
                reader = PyPDF2.PdfReader(file)
                text = "".join([page.extract_text()
                               for page in reader.pages if page.extract_text()])
                texts[filename] = text

    return texts


if __name__ == "__main__":
    extract_pdfs_from_zip(ZIP_FILE_PATH, EXTRACT_PATH)
    pdf_texts = extract_text_from_pdfs(EXTRACT_PATH)
    print("✅ Extracted PDF Texts:", pdf_texts)
