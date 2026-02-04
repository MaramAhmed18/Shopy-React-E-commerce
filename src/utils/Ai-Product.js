// src/utils/Ai-Product.js
import { GoogleGenAI } from "@google/genai"; // Using the modern unified SDK
import { db } from "../config/firebase.js"; 
import { collection, getDocs, doc, setDoc, limit, query } from "firebase/firestore";

// Read API Key - Ensure no spaces exist in your .env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize the unified client
const client = new GoogleGenAI({ apiKey: API_KEY });

// Production-ready model IDs
const LLM_MODEL = "gemini-2.5-flash"; 
const EMBED_MODEL = "text-embedding-004";

/**
 * Generate and store product embeddings
 */
export async function generateProductEmbeddings() {
    try {
        console.log("Starting Shopy product embedding generation...");
        const productsRef = collection(db, "products"); 
        const snapshot = await getDocs(productsRef);

        if (snapshot.empty) return { success: false, processed: 0 };

        let processed = 0;
        for (const docSnap of snapshot.docs) {
            const data = docSnap.data();
            const id = docSnap.id;
            const text = `Product: ${data.name}\nCategory: ${data.category}\nPrice: $${data.price}\nStatus: ${data.stock}\nDescription: ${data.description}`;

            // FIXED: embedContent requires 'contents' as an array 
            // to resolve the "requests[]" schema error.
            const result = await client.models.embedContent({
                model: EMBED_MODEL,
                contents: [text] // The SDK converts a string list into a single content instance
            });

            await setDoc(doc(db, "chatbot", id), {
                productId: id,
                text: text,
                embedding: result.embeddings[0].values, // result.embeddings is an array
                updatedAt: new Date().toISOString()
            });
            processed++;
        }
        return { success: true, processed };
    } catch (err) {
        console.error("Embedding generation failed:", err);
        throw err;
    }
}

/**
 * Query AI with Product Context (RAG Logic)
 */
export async function queryAI(userQuery, topK = 3) {
    try {
        await checkAndInitializeChatbot(); 
        
        // FIXED: User query embedding also needs the 'contents' array structure
        const queryResult = await client.models.embedContent({
            model: EMBED_MODEL,
            contents: [userQuery]
        });
        const queryEmbedding = queryResult.embeddings[0].values;

        const snapshot = await getDocs(collection(db, "chatbot"));
        const chatbotDocs = snapshot.docs.map(doc => doc.data());

        const scored = chatbotDocs
            .map(doc => ({
                ...doc,
                score: cosineSimilarity(queryEmbedding, doc.embedding)
            }))
            .filter(d => d.score > 0.3) 
            .sort((a, b) => b.score - a.score)
            .slice(0, topK);

        // Fallback for non-matching queries
        if (scored.length === 0) {
            return { 
                answer: "Hello! I'm the Shopy Assistant. I couldn't find a direct match, but I can help you find sneakers or check stock. What are you looking for?", 
                sources: [] 
            };
        }

        const contextText = scored.map((s, i) => `Option ${i + 1}:\n${s.text}`).join("\n\n");
        const prompt = `You are the official Shopy Assistant. Use this context to answer: \n\n ${contextText} \n\n User Question: ${userQuery}`;

        // FIXED: 'contents' must be a list of string or Content objects
        const response = await client.models.generateContent({
            model: LLM_MODEL,
            contents: [prompt] 
        });

        return {
            answer: response.text, // response.text is a quick accessor property
            sources: scored
        };
    } catch (err) {
        console.error("AI Retrieval Error:", err);
        return { 
            answer: "I'm having trouble connecting to the catalog. Please try again in a moment!", 
            sources: [] 
        };
    }
}

/**
 * Similarity Utilities
 */
function cosineSimilarity(vecA, vecB) {
    let dot = 0, magA = 0, magB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dot += vecA[i] * vecB[i];
        magA += vecA[i] * vecA[i];
        magB += vecB[i] * vecB[i];
    }
    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

async function getChatbotDocuments() {
    const snapshot = await getDocs(collection(db, "chatbot"));
    return snapshot.docs.map(doc => doc.data());
}

export async function checkAndInitializeChatbot() {
    const q = query(collection(db, "chatbot"), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) {
        return await generateProductEmbeddings();
    }
    return { status: "ready" };
}