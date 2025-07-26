import { jest } from '@jest/globals';

// Mock the @google/genai module to avoid network calls
jest.unstable_mockModule('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: jest.fn().mockResolvedValue({ text: 'mock reply' })
    }
  }))
}));

const { handler } = await import('./ask-ai.js');

const mockEvent = (method, body) => ({
  httpMethod: method,
  body: body ? JSON.stringify(body) : undefined
});

describe('ask-ai Netlify function', () => {
  test('returns 405 for GET requests', async () => {
    const result = await handler(mockEvent('GET'));
    expect(result.statusCode).toBe(405);
  });

  test('returns 400 when question or context missing', async () => {
    process.env.API_KEY = 'x';
    let result = await handler(mockEvent('POST', { question: 'hi' }));
    expect(result.statusCode).toBe(400);
    result = await handler(mockEvent('POST', { context: 'ctx' }));
    expect(result.statusCode).toBe(400);
  });

  test('returns 200 and response on valid POST', async () => {
    process.env.API_KEY = 'x';
    const result = await handler(mockEvent('POST', { question: 'hi', context: 'ctx' }));
    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.response).toBeDefined();
  });
});
