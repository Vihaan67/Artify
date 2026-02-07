const EURIAI_API_KEY = "euri-b1854636ecdd0dea996a9c59128110594181c62a0ba91b30d3eeb27eb012c82e";
const EURIAI_API_URL = "https://api.euron.one/v1/chat/completions";

async function generateAIContent(userPrompt) {
    console.log("Generating with Euriai...");
    try {
        const response = await fetch(EURIAI_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${EURIAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4.1-nano",
                messages: [
                    { role: "system", content: "You are a creative assistant." },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.7,
                max_tokens: 300
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;

    } catch (error) {
        console.error("Euriai Generation Failed:", error);
        alert("Oops! Something went wrong. Check console.");
        return null;
    }
}
