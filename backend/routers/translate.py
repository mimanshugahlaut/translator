from fastapi import APIRouter, HTTPException

from models.schemas import TranslateRequest, TranslateResponse
from services.detector import detect_language
from services.translator import translate_text

router = APIRouter()


@router.post("/translate", response_model=TranslateResponse)
async def translate(request: TranslateRequest):
    try:
        source = request.source
        detected_source = None
        confidence = None

        if source == "auto":
            detected_source, _, confidence = detect_language(request.text)
            source = detected_source

        translated, api_detected, api_confidence = await translate_text(
            request.text, source, request.target
        )

        if api_detected:
            detected_source = api_detected
        if api_confidence:
            confidence = api_confidence

        return TranslateResponse(
            translated_text=translated,
            detected_source=detected_source,
            confidence=confidence,
        )
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
