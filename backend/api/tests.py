from django.test import TestCase


class CoreRouteTests(TestCase):
    def test_health_check(self):
        response = self.client.get('/health/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'status': 'ok'})

    def test_versioned_cases_route(self):
        response = self.client.get('/api/v1/cases/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [])

    def test_unversioned_cases_route_remains_available(self):
        response = self.client.get('/api/cases/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [])
