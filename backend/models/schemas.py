from pydantic import BaseModel, Field


class TranslateRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)
    source: str = "auto"
    target: str = "en"


class TranslateResponse(BaseModel):
    translated_text: str
    detected_source: str | None = None
    confidence: float | None = None


class DetectRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)


class DetectResponse(BaseModel):
    language: str
    language_name: str
    confidence: float


class LanguageItem(BaseModel):
    code: str
    name: str


class LanguagesResponse(BaseModel):
    languages: list[LanguageItem]
