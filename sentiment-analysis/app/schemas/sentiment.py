from pydantic import BaseModel, Field


class SentimentRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=2,
        max_length=5000,
        description="Texte à analyser"
    )


class SentimentResponse(BaseModel):
    sentiment: str
    confidence: float
    explanation: str