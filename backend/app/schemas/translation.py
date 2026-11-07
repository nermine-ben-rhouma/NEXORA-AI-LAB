
from typing import Literal

from pydantic import BaseModel, Field, field_validator


class TranslationRequest(BaseModel):
    """
    Schema for a translation request.
    """

    text: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="Text to translate"
    )

    source_language: str = Field(
        default="Auto-detect",
        max_length=50,
        description="Original language"
    )

    target_language: str = Field(
        ...,
        min_length=2,
        max_length=50,
        description="Target language"
    )

    tone: Literal[
        "natural",
        "professional",
        "academic",
        "formal",
        "casual"
    ] = Field(
        default="natural",
        description="Translation tone"
    )

    @field_validator("text", "source_language", "target_language")
    @classmethod
    def clean_text(cls, value: str) -> str:
        """
        Remove unnecessary spaces.
        """
        return value.strip()


class TranslationResponse(BaseModel):
    """
    Schema for a successful translation response.
    """

    original_text: str
    translated_text: str
    source_language: str
    target_language: str
    tone: str
    model: str
    status: str = "success"


class TranslationHistoryItem(BaseModel):
    """
    Schema for a saved translation history item.
    """

    id: int
    original_text: str
    translated_text: str
    source_language: str
    target_language: str
    tone: str
    model: str
    created_at: str
