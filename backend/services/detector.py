from langdetect import detect_langs, DetectorFactory

DetectorFactory.seed = 0

LANGUAGE_NAMES: dict[str, str] = {
    "af": "Afrikaans",
    "ar": "Arabic",
    "bg": "Bulgarian",
    "bn": "Bengali",
    "ca": "Catalan",
    "cs": "Czech",
    "cy": "Welsh",
    "da": "Danish",
    "de": "German",
    "el": "Greek",
    "en": "English",
    "es": "Spanish",
    "et": "Estonian",
    "fa": "Persian",
    "fi": "Finnish",
    "fr": "French",
    "gu": "Gujarati",
    "he": "Hebrew",
    "hi": "Hindi",
    "hr": "Croatian",
    "hu": "Hungarian",
    "id": "Indonesian",
    "it": "Italian",
    "ja": "Japanese",
    "kn": "Kannada",
    "ko": "Korean",
    "lt": "Lithuanian",
    "lv": "Latvian",
    "mk": "Macedonian",
    "ml": "Malayalam",
    "mr": "Marathi",
    "ne": "Nepali",
    "nl": "Dutch",
    "no": "Norwegian",
    "pa": "Punjabi",
    "pl": "Polish",
    "pt": "Portuguese",
    "ro": "Romanian",
    "ru": "Russian",
    "sk": "Slovak",
    "sl": "Slovenian",
    "so": "Somali",
    "sq": "Albanian",
    "sv": "Swedish",
    "sw": "Swahili",
    "ta": "Tamil",
    "te": "Telugu",
    "th": "Thai",
    "tl": "Tagalog",
    "tr": "Turkish",
    "uk": "Ukrainian",
    "ur": "Urdu",
    "vi": "Vietnamese",
    "zh-cn": "Chinese (Simplified)",
    "zh-tw": "Chinese (Traditional)",
}


def get_language_name(code: str) -> str:
    return LANGUAGE_NAMES.get(code, code.upper())


def detect_language(text: str) -> tuple[str, str, float]:
    results = detect_langs(text)
    if not results:
        return "en", "English", 0.5
    best = results[0]
    code = best.lang
    # Normalize certain language codes to match supported translator targets
    # e.g. langdetect may return 'zh-cn' or 'zh-tw' while our translator
    # expects generic 'zh'. Map those variants to 'zh'.
    normalize_map: dict[str, str] = {"zh-cn": "zh", "zh-tw": "zh"}
    norm_code = normalize_map.get(code, code)
    return norm_code, get_language_name(norm_code), round(best.prob, 2)
