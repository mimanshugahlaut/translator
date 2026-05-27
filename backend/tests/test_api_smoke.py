import unittest
from unittest.mock import patch

from fastapi.testclient import TestClient

# Import app as a package so tests work when run from repository root (CI)
from backend.main import app


class APISmokeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_health_endpoint(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_languages_endpoint(self):
        response = self.client.get("/languages")
        self.assertEqual(response.status_code, 200)
        payload = response.json()

        self.assertIn("languages", payload)
        self.assertGreater(len(payload["languages"]), 0)
        self.assertEqual(payload["languages"][0]["code"], "af")

    @patch("backend.routers.detect.detect_language", return_value=("en", "English", 0.97))
    def test_detect_endpoint(self, mock_detect):
        response = self.client.post("/detect", json={"text": "Hello world"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {"language": "en", "language_name": "English", "confidence": 0.97},
        )
        mock_detect.assert_called_once_with("Hello world")

    @patch("backend.routers.translate.translate_text", return_value=("Hola Mundo", "en", 0.9))
    @patch("backend.routers.translate.detect_language", return_value=("en", "English", 0.97))
    def test_translate_endpoint(self, mock_detect, mock_translate):
        response = self.client.post(
            "/translate",
            json={"text": "Hello world", "source": "auto", "target": "es"},
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {
                "translated_text": "Hola Mundo",
                "detected_source": "en",
                "confidence": 0.9,
            },
        )
        mock_detect.assert_called_once_with("Hello world")
        mock_translate.assert_called_once_with("Hello world", "en", "es")


if __name__ == "__main__":
    unittest.main()