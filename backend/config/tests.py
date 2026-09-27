from django.test import Client, SimpleTestCase


class HealthEndpointTest(SimpleTestCase):
    def setUp(self):
        self.client = Client()

    def test_health_endpoint_status(self):
        response = self.client.get('/api/health/')
        self.assertEqual(response.status_code, 200)

    def test_health_endpoint_payload(self):
        response = self.client.get('/api/health/')
        data = response.json()
        self.assertEqual(data.get("status"), "ok")
        self.assertIsInstance(data.get("items"), list)
        self.assertIn("Configurar Docker", data.get("items"))
        self.assertIn("Automatizar CI", data.get("items"))
        self.assertIn("Publicar no GHCR", data.get("items"))
