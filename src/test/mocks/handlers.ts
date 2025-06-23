import { http, HttpResponse } from 'msw';

const API_URL = 'https://api.spaceflightnewsapi.net/v4';

export const handlers = [
  // Test-specific handlers can be added here
  http.get(`${API_URL}/articles`, () => {
    return HttpResponse.json([{ id: 1, title: 'Test Article' }]);
  }),
  http.post(`${API_URL}/articles`, async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json({ success: true, data });
  }),
  http.put(`${API_URL}/articles/1`, async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json({ success: true, data });
  }),
  http.delete(`${API_URL}/articles/1`, () => {
    return new HttpResponse(null, { status: 204 });
  }),
  // 401 Unauthorized
  http.get(`${API_URL}/unauthorized`, () => {
    return new HttpResponse(null, { status: 401 });
  }),
  // Network error
  http.get(`${API_URL}/network-error`, () => {
    return HttpResponse.error();
  }),
]; 