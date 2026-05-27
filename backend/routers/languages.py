from fastapi import APIRouter

from backend.models.schemas import LanguageItem, LanguagesResponse
from backend.services.translator import get_languages

router = APIRouter()


@router.get("/languages", response_model=LanguagesResponse)
async def list_languages():
    langs = get_languages()
    return LanguagesResponse(
        languages=[LanguageItem(**lang) for lang in langs]
    )
