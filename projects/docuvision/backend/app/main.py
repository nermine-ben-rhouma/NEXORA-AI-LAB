import os
import uuid
from pathlib import Path

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.connection import Base, engine, get_db
from app.database.models import Document, DocumentQuestion
from app.schemas.document import (
    DocumentResponse,
    DocumentQuestionRequest,
    DocumentQuestionResponse
)
from app.services.document_service import extract_text_from_pdf
from app.services.ai_service import answer_document_question


# Création des tables
Base.metadata.create_all(bind=engine)


# Dossier de stockage des PDF
UPLOAD_DIR = Path(settings.UPLOAD_DIR)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


# Initialisation de FastAPI
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="API intelligente d'analyse de documents PDF"
)


# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5177",
    "http://127.0.0.1:5177",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Bienvenue sur DOCUVISION API",
        "status": "running"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


# Télécharger et analyser un PDF
@app.post("/api/v1/documents/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename or Path(file.filename).suffix.lower() != ".pdf":
        raise HTTPException(
            status_code=400,
            detail="Veuillez sélectionner un fichier PDF."
        )

    if file.content_type not in ("application/pdf", "application/octet-stream"):
        raise HTTPException(
            status_code=400,
            detail="Type de fichier non autorisé."
        )

    content = await file.read()

    if not content:
        raise HTTPException(
            status_code=400,
            detail="Le fichier est vide."
        )

    if len(content) > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Le fichier dépasse la taille maximale autorisée de 10 Mo."
        )

    # Nom de fichier sécurisé et unique
    safe_filename = f"{uuid.uuid4().hex}.pdf"
    file_path = UPLOAD_DIR / safe_filename

    try:
        file_path.write_bytes(content)

        extracted_text = extract_text_from_pdf(str(file_path))

        document = Document(
            filename=Path(file.filename).name,
            file_path=str(file_path),
            extracted_text=extracted_text
        )

        db.add(document)
        db.commit()
        db.refresh(document)

        return document

    except ValueError as e:
        db.rollback()
        file_path.unlink(missing_ok=True)
        raise HTTPException(status_code=400, detail=str(e))

    except Exception:
        db.rollback()
        file_path.unlink(missing_ok=True)
        raise HTTPException(
            status_code=500,
            detail="Une erreur est survenue lors du traitement du PDF."
        )


# Liste des documents
@app.get("/api/v1/documents", response_model=list[DocumentResponse])
def get_documents(db: Session = Depends(get_db)):
    return db.query(Document).order_by(
        Document.id.desc()
    ).all()


# Poser une question sur un document
@app.post(
    "/api/v1/documents/{document_id}/ask",
    response_model=DocumentQuestionResponse
)
def ask_document(
    document_id: int,
    request: DocumentQuestionRequest,
    db: Session = Depends(get_db)
):
    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document introuvable."
        )

    question = request.question.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="La question ne peut pas être vide."
        )

    try:
        answer = answer_document_question(
            document.extracted_text,
            question
        )

        question_record = DocumentQuestion(
            document_id=document.id,
            question=question,
            answer=answer
        )

        db.add(question_record)
        db.commit()
        db.refresh(question_record)

        return question_record

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la génération de la réponse : {str(e)}"
        )


# Historique des questions d'un document
@app.get(
    "/api/v1/documents/{document_id}/questions",
    response_model=list[DocumentQuestionResponse]
)
def get_document_questions(
    document_id: int,
    db: Session = Depends(get_db)
):
    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document introuvable."
        )

    return db.query(DocumentQuestion).filter(
        DocumentQuestion.document_id == document_id
    ).order_by(DocumentQuestion.id.asc()).all()


# Supprimer un document
@app.delete("/api/v1/documents/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(get_db)
):
    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document introuvable."
        )

    file_path = Path(document.file_path)

    db.delete(document)
    db.commit()

    file_path.unlink(missing_ok=True)

    return {
        "message": "Document supprimé avec succès."
    }