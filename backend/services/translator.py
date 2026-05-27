import os
from typing import Any

import httpx
from deep_translator import GoogleTranslator

LIBRETRANSLATE_URL = os.getenv(
    "LIBRETRANSLATE_URL", "https://libretranslate.com"
).rstrip("/")
GOOGLE_TRANSLATE_API_KEY = os.getenv("GOOGLE_TRANSLATE_API_KEY", "")

SUPPORTED_LANGUAGES: list[dict[str, str]] = [
    {"code": "af", "name": "Afrikaans"},
    {"code": "ar", "name": "Arabic"},
    {"code": "bg", "name": "Bulgarian"},
    {"code": "bn", "name": "Bengali"},
    {"code": "ca", "name": "Catalan"},
    {"code": "cs", "name": "Czech"},
    {"code": "cy", "name": "Welsh"},
    {"code": "da", "name": "Danish"},
    {"code": "de", "name": "German"},
    {"code": "el", "name": "Greek"},
    {"code": "en", "name": "English"},
    {"code": "es", "name": "Spanish"},
    {"code": "et", "name": "Estonian"},
    {"code": "fa", "name": "Persian"},
    {"code": "fi", "name": "Finnish"},
    {"code": "fr", "name": "French"},
    {"code": "gu", "name": "Gujarati"},
    {"code": "he", "name": "Hebrew"},
    {"code": "hi", "name": "Hindi"},
    {"code": "hr", "name": "Croatian"},
    {"code": "hu", "name": "Hungarian"},
    {"code": "id", "name": "Indonesian"},
    {"code": "it", "name": "Italian"},
    {"code": "ja", "name": "Japanese"},
    {"code": "kn", "name": "Kannada"},
    {"code": "ko", "name": "Korean"},
    {"code": "lt", "name": "Lithuanian"},
    {"code": "lv", "name": "Latvian"},
    {"code": "mk", "name": "Macedonian"},
    {"code": "ml", "name": "Malayalam"},
    {"code": "mr", "name": "Marathi"},
    {"code": "ne", "name": "Nepali"},
    {"code": "nl", "name": "Dutch"},
    {"code": "no", "name": "Norwegian"},
    {"code": "pa", "name": "Punjabi"},
    {"code": "pl", "name": "Polish"},
    {"code": "pt", "name": "Portuguese"},
    {"code": "ro", "name": "Romanian"},
    {"code": "ru", "name": "Russian"},
    {"code": "sk", "name": "Slovak"},
    {"code": "sl", "name": "Slovenian"},
    {"code": "so", "name": "Somali"},
    {"code": "sq", "name": "Albanian"},
    {"code": "sv", "name": "Swedish"},
    {"code": "sw", "name": "Swahili"},
    {"code": "ta", "name": "Tamil"},
    {"code": "te", "name": "Telugu"},
    {"code": "th", "name": "Thai"},
    {"code": "tl", "name": "Tagalog"},
    {"code": "tr", "name": "Turkish"},
    {"code": "uk", "name": "Ukrainian"},
    {"code": "ur", "name": "Urdu"},
    {"code": "vi", "name": "Vietnamese"},
    {"code": "zh", "name": "Chinese"},
]


async def _translate_libretranslate(
    text: str, source: str, target: str
) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "q": text,
        "source": source if source != "auto" else "auto",
        "target": target,
        "format": "text",
    }
    api_key = os.getenv("LIBRETRANSLATE_API_KEY")
    if api_key:
        payload["api_key"] = api_key

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            f"{LIBRETRANSLATE_URL}/translate", json=payload
        )
        response.raise_for_status()
        return response.json()


async def _translate_google(
    text: str, source: str, target: str
) -> dict[str, Any]:
    params: dict[str, str] = {
        "q": text,
        "target": target,
        "key": GOOGLE_TRANSLATE_API_KEY,
        "format": "text",
    }
    if source != "auto":
        params["source"] = source

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            "https://translation.googleapis.com/language/translate/v2",
            params=params,
        )
        response.raise_for_status()
        data = response.json()

    translation = data["data"]["translations"][0]
    return {
        "translatedText": translation["translatedText"],
        "detectedLanguage": translation.get("detectedSourceLanguage"),
    }


def _translate_deep_translator(text: str, source: str, target: str) -> str:
    src = source if source != "auto" else "auto"
    translator = GoogleTranslator(source=src, target=target)
    return translator.translate(text)


async def translate_text(
    text: str, source: str, target: str
) -> tuple[str, str | None, float | None]:
    detected_source: str | None = None
    confidence: float | None = None
    last_error: Exception | None = None

    try:
        result = await _translate_libretranslate(text, source, target)
        translated = result.get("translatedText", "")
        detected_source = result.get("detectedLanguage")
        if detected_source:
            confidence = 0.95
        return translated, detected_source, confidence
    except Exception as e:
        last_error = e

    if GOOGLE_TRANSLATE_API_KEY:
        try:
            result = await _translate_google(text, source, target)
            translated = result.get("translatedText", "")
            detected_source = result.get("detectedLanguage")
            if detected_source:
                confidence = 0.98
            return translated, detected_source, confidence
        except Exception as e:
            last_error = e

    try:
        translated = _translate_deep_translator(text, source, target)
        return translated, None, 0.9
    except Exception as e:
        last_error = e

    raise RuntimeError(
        f"Translation failed. Configure LibreTranslate or Google API. {last_error}"
    )


def get_languages() -> list[dict[str, str]]:
    return SUPPORTED_LANGUAGES
