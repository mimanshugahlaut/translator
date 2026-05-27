from fastapi import APIRouter, HTTPException

from backend.models.schemas import DetectRequest, DetectResponse
from backend.services.detector import detect_language

router = APIRouter()


@router.post("/detect", response_model=DetectResponse)
async def detect(request: DetectRequest):
    try:
        code, name, confidence = detect_language(request.text)
        return DetectResponse(
            language=code,
            language_name=name,
            confidence=confidence,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
