from pathlib import Path
from pypdf import PdfReader


def extract_text_from_pdf(file_path: str) -> str:
    """
    Extraire le texte d'un document PDF.
    """

    try:
        reader = PdfReader(file_path)

        if reader.is_encrypted:
            raise ValueError("Ce PDF est protégé par un mot de passe.")

        extracted_text = []

        for page_number, page in enumerate(reader.pages, start=1):
            page_text = page.extract_text() or ""

            if page_text.strip():
                extracted_text.append(page_text)

        text = "\n\n".join(extracted_text).strip()

        if not text:
            raise ValueError(
                "Aucun texte détecté dans ce PDF. "
                "Le document est peut-être un PDF scanné."
            )

        return text

    except ValueError:
        raise

    except Exception as e:
        raise ValueError(
            f"Impossible de lire le fichier PDF : {str(e)}"
        )