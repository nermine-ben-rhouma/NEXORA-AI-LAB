
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.core.config import settings
from app.schemas.sentiment import SentimentRequest, SentimentResponse
from app.services.sentiment_service import analyze_sentiment
from app.database.connection import engine, Base, get_db
from app.database.models import SentimentHistory

# Initialisation de la base de données
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered sentiment analysis using LangChain and Groq."
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
   allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


@app.get("/")
async def root():
    return {
        "application": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "message": "Sentiment Analysis API is running."
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.post("/api/v1/analyze", response_model=SentimentResponse)
def analyze(
    request: SentimentRequest,
    db: Session = Depends(get_db)
):
    try:
        # Analyse avec LangChain et Groq
        result = analyze_sentiment(request.text)

        # Enregistrement dans SQLite
        history = SentimentHistory(
            text=request.text,
            sentiment=result["sentiment"],
            confidence=result["confidence"],
            explanation=result["explanation"]
        )

        db.add(history)
        db.commit()
        db.refresh(history)

        return result

    except Exception as error:
        db.rollback()
        print(f"Analysis error: {error}")
        raise HTTPException(
            status_code=500,
            detail="Sentiment analysis failed. Check backend logs."
        )

@app.get("/api/v1/history")
def get_history(db: Session = Depends(get_db)):
    history = (
        db.query(SentimentHistory)
        .order_by(SentimentHistory.created_at.desc())
        .all()
    )

    return [
        {
            "id": item.id,
            "text": item.text,
            "sentiment": item.sentiment,
            "confidence": item.confidence,
            "explanation": item.explanation,
            "created_at": item.created_at
        }
        for item in history
    ]
