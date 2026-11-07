from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class DocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    filename: str
    uploaded_at: Optional[datetime] = None


class DocumentQuestionRequest(BaseModel):
    question: str


class DocumentQuestionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    document_id: int
    question: str
    answer: str
    created_at: Optional[datetime] = None