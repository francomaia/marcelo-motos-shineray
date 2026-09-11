import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function fetchNews() {
    const container = document.getElementById('news-container');
    if (!container) return;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: "Faça um resumo em um único parágrafo sobre as novidades e lançamentos mais recentes da marca de motos Shineray no Brasil.",
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const text = response.text;
        if (!text) throw new Error("No response text");

        let html = `<div style="grid-column: 1 / -1; background: #fff; border-radius: 12px; padding: 30px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); margin-bottom: 20px;">
            <p style="font-size: 16px; color: #444; line-height: 1.8; margin-bottom: 0;">${text.replace(/\n/g, '<br>')}</p>
        </div>`;

        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks && chunks.length > 0) {
            html += `<h3 style="grid-column: 1 / -1; font-size: 20px; margin-top: 10px; margin-bottom: 10px;">Fontes e Notícias Relacionadas:</h3>`;
            
            // Filter out non-web chunks and deduplicate by URI
            const webChunks = chunks.filter((c: any) => c.web && c.web.uri);
            const uniqueChunks = Array.from(new Map(webChunks.map((c: any) => [c.web.uri, c])).values()).slice(0, 3);

            uniqueChunks.forEach((chunk: any) => {
                const web = chunk.web;
                html += `
                    <a href="${web.uri}" target="_blank" class="news-card" style="background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); text-decoration: none; color: inherit; display: flex; flex-direction: column; transition: transform 0.3s, box-shadow 0.3s;">
                        <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 15px; color: #111; line-height: 1.4;">${web.title}</h4>
                        <span style="color: #E3000F; font-weight: 600; font-size: 14px; margin-top: auto;">Acessar fonte <i class="fa-solid fa-arrow-right" style="margin-left: 5px;"></i></span>
                    </a>
                `;
            });
        }

        container.innerHTML = html;

        // Add hover effects to cards
        const cards = container.querySelectorAll('.news-card');
        cards.forEach((card: any) => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)';
            });
        });

    } catch (error) {
        console.error("Error fetching news:", error);
        container.innerHTML = `
            <div style="text-align: center; grid-column: 1 / -1; padding: 40px; color: #555;">
                <p>Não foi possível carregar as notícias no momento.</p>
            </div>
        `;
    }
}

if (document.getElementById('news-container')) {
    fetchNews();
}
