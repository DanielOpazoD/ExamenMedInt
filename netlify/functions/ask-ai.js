
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

export const handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    if (!API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'La clave de API no está configurada en el servidor.' }),
            headers: { 'Content-Type': 'application/json' },
        };
    }
    
    try {
        const { question, context } = JSON.parse(event.body);

        if (!question || !context) {
             return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Falta la pregunta o el contexto en la solicitud.' }),
                headers: { 'Content-Type': 'application/json' },
            };
        }
        
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        
        const fullPrompt = `${context}\n\n---\n\nPregunta del usuario: ${question}\n\nResponde a la pregunta basándote únicamente en el contexto proporcionado. Si la respuesta no está en el contexto, indícalo claramente.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt
        });
        
        const text = response.text;

        return {
            statusCode: 200,
            body: JSON.stringify({ response: text }),
            headers: { 'Content-Type': 'application/json' },
        };
        
    } catch (error) {
        console.error("Error en la función de Netlify:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Ocurrió un error al procesar tu solicitud.' }),
            headers: { 'Content-Type': 'application/json' },
        };
    }
};
