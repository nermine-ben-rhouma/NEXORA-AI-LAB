from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.connection import Base, engine, get_db
from app.database.models import Conversation, Message
from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
    ConversationResponse,
    MessageResponse
)
from app.services.chat_service import generate_response


# Création des tables
Base.metadata.create_all(bind=engine)


# Initialisation de FastAPI
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="API du chatbot intelligent NEXORA CHAT"
)


# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5176",
    "http://127.0.0.1:5176",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Bienvenue sur NEXORA CHAT API",
        "status": "running"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


# Envoyer un message
@app.post("/api/v1/chat", response_model=ChatResponse)
def chat(request: ChatRequest, db: Session = Depends(get_db)):

    # Récupérer ou créer une conversation
    if request.conversation_id:
        conversation = db.query(Conversation).filter(
            Conversation.id == request.conversation_id
        ).first()

        if not conversation:
            raise HTTPException(
                status_code=404,
                detail="Conversation introuvable"
            )
    else:
        conversation = Conversation(
            title=request.message[:50]
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)

    # Récupérer les anciens messages
    history = db.query(Message).filter(
        Message.conversation_id == conversation.id
    ).order_by(Message.id.asc()).all()

    # Enregistrer le message utilisateur
    user_message = Message(
        conversation_id=conversation.id,
        role="user",
        content=request.message
    )

    db.add(user_message)
    db.commit()

    try:
        # Générer la réponse IA
        ai_response = generate_response(
            request.message,
            history
        )

        # Enregistrer la réponse IA
        assistant_message = Message(
            conversation_id=conversation.id,
            role="assistant",
            content=ai_response
        )

        db.add(assistant_message)
        db.commit()
        db.refresh(assistant_message)

        return ChatResponse(
            conversation_id=conversation.id,
            message=ai_response,
            role="assistant",
            created_at=assistant_message.created_at
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la génération de la réponse : {str(e)}"
        )


# Liste des conversations
@app.get("/api/v1/conversations", response_model=list[ConversationResponse])
def get_conversations(db: Session = Depends(get_db)):

    conversations = db.query(Conversation).order_by(
        Conversation.id.desc()
    ).all()

    return conversations


# Messages d'une conversation
@app.get(
    "/api/v1/conversations/{conversation_id}/messages",
    response_model=list[MessageResponse]
)
def get_conversation_messages(
    conversation_id: int,
    db: Session = Depends(get_db)
):

    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id
    ).first()

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation introuvable"
        )

    return db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).order_by(Message.id.asc()).all()


# Supprimer une conversation
@app.delete("/api/v1/conversations/{conversation_id}")
def delete_conversation(
    conversation_id: int,
    db: Session = Depends(get_db)
):

    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id
    ).first()

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation introuvable"
        )

    db.delete(conversation)
    db.commit()

    return {
        "message": "Conversation supprimée avec succès"
    }
from pydantic import BaseModel, Field

class RenameConversationRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)


@app.put("/api/v1/conversations/{conversation_id}")
def rename_conversation(
    conversation_id: int,
    request: RenameConversationRequest,
    db: Session = Depends(get_db)
):
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id
    ).first()

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation introuvable"
        )

    conversation.title = request.title.strip()
    db.commit()

    return {
        "message": "Conversation renommée avec succès",
        "id": conversation.id,
        "title": conversation.title
    }