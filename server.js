const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENROUTER_API_KEY;

app.get("/", (req, res) => {
    res.send("🔥 Fire Helper is running!");
});

app.post("/api/chat", async (req, res) => {
    try {
        if (!API_KEY) {
            return res.status(500).json({
                error: "OpenRouter API key is missing."
            });
        }

        const { messages } = req.body;

        if (!Array.isArray(messages)) {
            return res.status(400).json({
                error: "Messages must be an array."
            });
        }

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "FIRE_STORM Fire Helper"
                },
                body: JSON.stringify({
                    model: "openai/gpt-4o-mini",
                    messages: messages
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: data.error?.message || "AI request failed."
            });
        }

        res.json({
            reply: data.choices?.[0]?.message?.content || "No response."
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Fire Helper could not connect to the AI."
        });
    }
});

app.listen(3001, "127.0.0.1", () => {
    console.log("🔥 Fire Helper running at http://localhost:3001");
});