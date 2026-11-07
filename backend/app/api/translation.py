
import logging

from fastapi import APIRouter, HTTPException, status

from app.schemas.translation import (
    TranslationRequest,
    TranslationResponse,
    TranslationHistoryItem,
)

from app.services.translation_service import TranslationService

from app.database.connection import (
    save_translation,
    get_translations,
    delete_translation,
    get_translation_statistics,
)

from app.core.config import settings


logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/v1",
    tags=["Translation"]
)


# Traduire un texte sans authentification
@router.post(
    "/translate",
    response_model=TranslationResponse,
    summary="Translate text using AI"
)
async def translate_text(request: TranslationRequest):
    try:
        service = TranslationService()

        translated_text = await service.translate(
            text=request.text,
            source_language=request.source_language,
            target_language=request.target_language,
            tone=request.tone
        )

        save_translation(
            original_text=request.text,
            translated_text=translated_text,
            source_language=request.source_language,
            target_language=request.target_language,
            tone=request.tone,
            model=settings.GROQ_MODEL,
        )

        return TranslationResponse(
            original_text=request.text,
            translated_text=translated_text,
            source_language=request.source_language,
            target_language=request.target_language,
            tone=request.tone,
            model=settings.GROQ_MODEL
        )

    except ValueError:
        logger.exception("Translation configuration error")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Translation service is not configured."
        )

    except Exception:
        logger.exception("Translation request failed")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="The AI translation service is temporarily unavailable."
        )


# Récupérer tout l'historique
@router.get(
    "/translations",
    response_model=list[TranslationHistoryItem],
    summary="Get all translation history"
)
async def get_translation_history():
    try:
        return get_translations()

    except Exception:
        logger.exception("Could not retrieve translation history")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve translation history."
        )


# Supprimer une traduction
@router.delete(
    "/translations/{translation_id}",
    summary="Delete a translation"
)
async def remove_translation(translation_id: int):
    try:
        deleted = delete_translation(translation_id)

        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Translation not found."
            )

        return {
            "status": "success",
            "message": "Translation deleted successfully."
        }

    except HTTPException:
        raise

    except Exception:
        logger.exception("Could not delete translation")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not delete translation."
        )


# Récupérer les statistiques globales
@router.get(
    "/statistics",
    summary="Get translation statistics"
)
async def get_statistics():
    try:
        return get_translation_statistics()

    except Exception:
        logger.exception("Could not retrieve translation statistics")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve translation statistics."
        )
