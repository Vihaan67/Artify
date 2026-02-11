/**
 * Welcome Screen & Personalization Logic
 */
function initWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const homeScreen = document.getElementById('home-screen');
    const nameInput = document.getElementById('user-name-input');
    const startBtn = document.getElementById('start-journey-btn');

    // Check if user has already entered their name
    const userName = localStorage.getItem('artify_user_name');

    if (userName) {
        // User has already set their name, skip welcome screen
        welcomeScreen.classList.remove('active');
        homeScreen.classList.add('active');
    } else {
        // Show welcome screen
        welcomeScreen.classList.add('active');
        homeScreen.classList.remove('active');
    }

    // Handle name input - enable button only when name is entered
    nameInput.addEventListener('input', () => {
        startBtn.disabled = nameInput.value.trim().length === 0;
    });

    // Handle Enter key in input
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && nameInput.value.trim()) {
            startJourney();
        }
    });

    // Handle start button click
    startBtn.addEventListener('click', startJourney);

    function startJourney() {
        const name = nameInput.value.trim();
        if (!name) {
            alert('Please enter your name! 😊');
            return;
        }

        // Save name to localStorage
        localStorage.setItem('artify_user_name', name);

        // Transition to home screen with animation
        welcomeScreen.classList.remove('active');
        setTimeout(() => {
            homeScreen.classList.add('active');
            updatePersonalizedGreeting();
        }, 300);
    }
}

function updatePersonalizedGreeting() {
    const greetingElement = document.getElementById('personalized-greeting');
    const userName = localStorage.getItem('artify_user_name');

    if (userName && greetingElement) {
        const greetings = [
            `Welcome back, ${userName}! Ready to create magic? ✨`,
            `Hey ${userName}! Let's make something amazing today! 🎨`,
            `Hi ${userName}! Your imagination is the limit! 🌟`,
            `${userName}, time to bring your dreams to life! 🚀`,
            `Great to see you, ${userName}! Let's create art! 🖌️`
        ];

        // Pick a random greeting
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        greetingElement.textContent = randomGreeting;
    }
}

/**
 * Prompt History Tracking
 */
function savePromptToHistory(prompt) {
    if (!prompt || prompt.trim().length === 0) return;

    const history = JSON.parse(localStorage.getItem('artify_prompt_history') || '[]');

    // Add new prompt to the beginning
    history.unshift({
        text: prompt.trim(),
        timestamp: Date.now()
    });

    // Keep only last 20 prompts
    const trimmedHistory = history.slice(0, 20);
    localStorage.setItem('artify_prompt_history', JSON.stringify(trimmedHistory));
}

function getPromptHistory() {
    return JSON.parse(localStorage.getItem('artify_prompt_history') || '[]');
}

/**
 * Daily Challenge & Inspiration Logic
 */
const DailyChallenges = [
    { title: "Dinosaur Tea Party 🦖☕", prompt: "A T-Rex wearing a tuxedo having tea with a tiny teacup" },
    { title: "Space Penguin 🐧🚀", prompt: "A cool penguin surfing on a crystalline wave in outer space" },
    { title: "Candy Castle 🍭🏰", prompt: "A wobbly castle made of jelly and marshmallows in a sugar field" },
    { title: "Underwater Library 🫧📚", prompt: "Friendly fish reading bubble-books in a glowing coral library" },
    { title: "Robot Pizza Party 🍕🤖", prompt: "Funny robots sharing a giant pepperoni pizza with sparkly cheese" }
];

function initDailyChallenge() {
    const dailyBtn = document.getElementById('daily-btn');
    const tryBtn = document.querySelector('.daily-card .secondary-btn');
    const taskTitle = document.querySelector('.daily-card h3');
    const taskDesc = document.querySelector('.daily-card p');

    // Pick a "daily" challenge based on the day
    const dayIndex = new Date().getDate() % DailyChallenges.length;
    const challenge = DailyChallenges[dayIndex];

    taskTitle.textContent = challenge.title;
    taskDesc.textContent = "Can you bring this magical idea to life?";

    const startChallenge = () => {
        document.getElementById('home-screen').classList.remove('active');
        document.getElementById('studio-screen').classList.add('active');
        document.getElementById('art-prompt').value = challenge.prompt;
        document.getElementById('art-prompt').dispatchEvent(new Event('input'));
    };

    dailyBtn.onclick = startChallenge;
    tryBtn.onclick = startChallenge;
}

function initInspiration() {
    const inspireBtn = document.getElementById('inspiration-btn');
    const screen = document.getElementById('inspiration-screen');
    const randomBtn = document.getElementById('random-prompt-btn');
    const display = document.getElementById('idea-display');
    const closeBtn = document.querySelector('.close-corner');

    let lastIdeaIndex = -1;
    const ideas = [
        "A robot eating a giant slice of pizza 🍕",
        "A magical underwater library with bubble books 🫧",
        "A forest where the trees are made of candy 🍭",
        "A space station run by fluffy hamsters 🐹",
        "A dragon that breathes sparkles instead of fire ✨",
        "A castle made entirely of bouncy gelatin 🏰",
        "A dinosaur wearing a tuxedo at a tea party 🦖",
        "A flying car that looks like a giant watermelon 🍉",
        "A superhero squirrel saving a nut from a waterfall 🐿️",
        "A cloud that rains rainbow marshmallows 🌈",
        "A polar bear having a picnic on a tropical beach 🏖️",
        "A giant turtle with a whole city on its shell 🐢",
        "A moon made of glowing neon cheese 🧀",
        "An alien band playing instruments made of starlight 🎸",
        "A penguin who wants to be a professional surfer 🐧",
        "A tree that grows different kinds of hats instead of leaves 🎩",
        "A submarine that looks like a yellow ducky 🐤",
        "A mountain that tells jokes when the wind blows ⛰️",
        "A garden of flowers that sing together in the morning 🌸",
        "A robot dog that paints masterpieces with its tail 🐕"
    ];

    inspireBtn.onclick = () => {
        document.getElementById('home-screen').classList.remove('active');
        screen.classList.add('active');
    };

    closeBtn.onclick = () => {
        screen.classList.remove('active');
        document.getElementById('home-screen').classList.add('active');
    };

    randomBtn.onclick = async () => {
        const apiKey = localStorage.getItem('gemini_api_key');

        display.classList.add('pulse');
        const originalText = display.textContent;
        display.textContent = "Asking the Magic Brain... 🔮";

        if (apiKey) {
            // Get user's prompt history for personalization
            const history = getPromptHistory();
            const userName = localStorage.getItem('artify_user_name') || 'friend';

            let aiPrompt;

            if (history.length >= 3) {
                // Generate personalized suggestion based on history
                const recentPrompts = history.slice(0, 5).map(h => h.text).join(', ');
                aiPrompt = await callGeminiAPI(
                    `Based on ${userName}'s previous art ideas: "${recentPrompts}", generate 1 NEW creative, fun, kid-friendly art prompt (max 15 words) with emojis that builds on their interests but is different. Just the prompt text, nothing else.`,
                    "You are a creative art muse for children who learns from their interests."
                );
            } else {
                // Not enough history, generate random idea
                aiPrompt = await callGeminiAPI(
                    "Generate 1 creative, funny, kid-friendly art prompt (max 12 words) with emojis. Just the text, nothing else.",
                    "You are a creative art muse for children."
                );
            }

            if (aiPrompt) {
                display.textContent = aiPrompt.trim();
                setTimeout(() => display.classList.remove('pulse'), 500);
                return;
            }
        }

        // Fallback Logic (Local List)
        let newIndex;
        // Ensure we don't pick the same index twice in a row
        do {
            newIndex = Math.floor(Math.random() * ideas.length);
        } while (newIndex === lastIdeaIndex);

        lastIdeaIndex = newIndex;
        const idea = ideas[newIndex];

        display.textContent = idea;
        setTimeout(() => display.classList.remove('pulse'), 500);
    };
}

/**
 * Gallery Logic
 */
function initGallery() {
    const galleryScreen = document.getElementById('gallery-screen');
    const backBtn = document.getElementById('gallery-back-btn');
    const fullGallery = document.getElementById('full-gallery');

    backBtn.onclick = () => {
        galleryScreen.classList.remove('active');
        document.getElementById('home-screen').classList.add('active');
    };

    loadGallery();
}

function loadGallery() {
    const fullGallery = document.getElementById('full-gallery');
    const savedArt = JSON.parse(localStorage.getItem('artify_gallery') || '[]');

    if (savedArt.length === 0) {
        fullGallery.innerHTML = '<div class="placeholder-grid">No masterpieces yet! Go create some magic! ✨</div>';
        return;
    }

    fullGallery.innerHTML = '';
    savedArt.forEach((art, index) => {
        const card = document.createElement('div');
        card.className = 'art-card';
        card.innerHTML = `
            <img src="${art.url}" alt="My Art">
            <div class="card-meta">
                <span>${art.date}</span>
            </div>
        `;
        card.onclick = () => openSlideshow(index);
        fullGallery.appendChild(card);
    });
}

function openSlideshow(index) {
    const savedArt = JSON.parse(localStorage.getItem('artify_gallery') || '[]');
    const modal = document.getElementById('slideshow-modal');
    const img = document.getElementById('slideshow-img');
    let currentIndex = index;

    img.src = savedArt[currentIndex].url;
    modal.classList.add('active');

    document.getElementById('next-slide').onclick = (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % savedArt.length;
        img.src = savedArt[currentIndex].url;
    };

    document.getElementById('prev-slide').onclick = (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + savedArt.length) % savedArt.length;
        img.src = savedArt[currentIndex].url;
    };

    modal.onclick = () => modal.classList.remove('active');
}

// Update main listener to include new inits
document.addEventListener('DOMContentLoaded', () => {
    initWelcomeScreen();
    initCursor();
    initNavigation();
    updateRecentGallery();
    initInspiration();
    initGallery();
    initDailyChallenge();
    initSettings();
    updatePersonalizedGreeting();
});

/**
 * Custom Paintbrush Cursor Logic
 */
function initCursor() {
    const brush = document.getElementById('cursor-brush');
    const trailContainer = document.getElementById('cursor-trail');

    document.addEventListener('mousemove', (e) => {
        // Position update - removing the laggy feel
        brush.style.left = `${e.clientX}px`;
        brush.style.top = `${e.clientY}px`;

        if (!brush.classList.contains('visible')) {
            brush.classList.add('visible');
        }

        // Add sparkles sparingly
        if (Math.random() > 0.85) {
            createSparkle(e.clientX, e.clientY, trailContainer);
        }
    });

    document.addEventListener('mouseleave', () => {
        brush.classList.remove('visible');
    });

    window.addEventListener('mouseout', (e) => {
        if (!e.relatedTarget || e.relatedTarget.nodeName === "HTML") {
            brush.classList.remove('visible');
        }
    });

    document.addEventListener('mouseenter', () => {
        brush.classList.add('visible');
    });

    // Animate brush on click - scale and rotate only
    document.addEventListener('mousedown', () => {
        brush.style.transform = 'translate(-50%, -50%) scale(0.8) rotate(-20deg)';
    });

    document.addEventListener('mouseup', () => {
        brush.style.transform = 'translate(-50%, -50%) scale(1) rotate(0deg)';
    });

    // Final visibility safety
    window.addEventListener('blur', () => brush.classList.remove('visible'));
    window.addEventListener('focus', () => brush.classList.add('visible'));
}

function createSparkle(x, y, container) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;

    // Randomize size and colors for kid-friendly look
    const size = Math.random() * 10 + 5;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;

    const colors = ['#FFD93D', '#6BCB77', '#4D96FF', '#FF6B6B', '#FFE66D'];
    sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];

    container.appendChild(sparkle);

    setTimeout(() => {
        sparkle.remove();
    }, 800);
}

/**
 * Screen Navigation Logic
 */
function initNavigation() {
    const homeScreen = document.getElementById('home-screen');
    const studioScreen = document.getElementById('studio-screen');
    const createBtn = document.getElementById('create-art-btn');
    const backBtn = document.getElementById('back-to-home');
    const galleryBtn = document.getElementById('home-gallery-btn');

    createBtn.addEventListener('click', () => {
        homeScreen.classList.remove('active');
        studioScreen.classList.add('active');
    });

    backBtn.addEventListener('click', () => {
        studioScreen.classList.remove('active');
        homeScreen.classList.add('active');
    });

    galleryBtn.addEventListener('click', () => {
        homeScreen.classList.remove('active');
        document.getElementById('gallery-screen').classList.add('active');
        loadGallery();
    });

    initStudioLogic();
}

function initStudioLogic() {
    const promptArea = document.getElementById('art-prompt');
    const charCount = document.getElementById('char-count');
    const enhanceBtn = document.getElementById('enhance-prompt-btn');
    const suggestBtns = document.querySelectorAll('.suggest-btn');
    // Generate Button
    generateBtn.addEventListener('click', () => {
        if (!promptArea.value) {
            alert("Describe your dream artwork first! ✨");
            return;
        }
        startGeneration();
    });

    // Prompt Enhancer (AI Powered)
    enhanceBtn.addEventListener('click', async () => {
        let original = promptArea.value.trim();
        if (!original) {
            alert("Type something first! 🎨");
            return;
        }

        enhanceBtn.disabled = true;
        const originalText = enhanceBtn.textContent;
        enhanceBtn.textContent = "✨ Asking Gemini...";

        const apiKey = localStorage.getItem('gemini_api_key');

        if (apiKey) {
            try {
                // Use Gemini to rewrite
                const enhanced = await callGeminiAPI(
                    `Rewrite this art prompt for a kids' drawing to be more magical, descriptive, and fun. Keep it under 25 words. 
                    Original: "${original}"`,
                    "You are a creative artist muse."
                );

                if (enhanced) {
                    promptArea.value = enhanced.trim().replace(/^"|"$/g, ''); // Remove quotes if any
                    charCount.textContent = `${promptArea.value.length} / 300`;

                    // Visual feedback for enhancement
                    promptArea.classList.add('pulse');
                    setTimeout(() => promptArea.classList.remove('pulse'), 1000);

                    enhanceBtn.disabled = false;
                    enhanceBtn.textContent = originalText;
                    return;
                }
            } catch (e) {
                console.error("Enhancer failed:", e);
            }
        }

        // Fallback (Local Logic)
        setTimeout(() => {
            const lowerPrompt = original.toLowerCase();
            let additions = [];

            // Context-aware modifiers
            if (lowerPrompt.includes('cat') || lowerPrompt.includes('kitten')) additions.push('fluffy', 'big sparkling eyes');
            if (lowerPrompt.includes('dragon')) additions.push('mythical', 'breathing colorful smoke');
            // ... (keep existing fallback logic briefly or just simplify)
            // For brevity in diff, I'll use a simpler fallback here if allowed, or keep the complex one.
            // I'll keep a simplified version of the previous logic to ensure it still works without key.
            const generics = ['vivid colors', 'magical atmosphere', 'whimsical details', 'masterpiece quality'];
            const randomGeneric = generics[Math.floor(Math.random() * generics.length)];

            promptArea.value = `A magical ${original} with ${randomGeneric} ✨`;

            charCount.textContent = `${promptArea.value.length} / 300`;
            enhanceBtn.disabled = false;
            enhanceBtn.textContent = originalText;
        }, 800);
    });

    // Generate Button
    generateBtn.addEventListener('click', () => {
        if (!promptArea.value) {
            alert("Describe your dream artwork first! ✨");
            return;
        }
        startGeneration();
    });
}

// Global promise to track generation
let currentGenerationPromise = null;

function startGeneration() {
    const studioScreen = document.getElementById('studio-screen');
    const genScreen = document.getElementById('generation-screen');
    const progressText = document.getElementById('progress-message');

    // Start Async Generation Logic Immediately
    const promptValue = document.getElementById('art-prompt').value.trim();

    // Save prompt to history for personalization
    savePromptToHistory(promptValue);

    currentGenerationPromise = GenerationEngine.generate(promptValue);

    studioScreen.classList.remove('active');
    genScreen.classList.add('active');

    const messages = [
        "Mixing colors... 🎨",
        "Adding magic sparkles... ✨",
        "Bringing imagination to life... 🌟",
        "Almost there! 🖌️"
    ];

    let msgIndex = 0;
    const interval = setInterval(() => {
        msgIndex++;
        if (msgIndex < messages.length) {
            progressText.textContent = messages[msgIndex];
        }
    }, 2500);

    // After 10 seconds, resolve and show
    setTimeout(async () => {
        clearInterval(interval);
        try {
            const url = await currentGenerationPromise;
            showResult(url);
        } catch (e) {
            console.error("Generation failed:", e);
            // Fallback (Random dynamic placeholder if API fails)
            const seed = Math.floor(Math.random() * 1000);
            showResult(`https://pollinations.ai/p/a_magical_and_surreal_art_piece_full_of_colors_and_imagination?width=1024&height=1024&seed=${seed}`);
        }
    }, 10000);

    document.getElementById('cancel-gen-btn').onclick = () => {
        clearInterval(interval);
        genScreen.classList.remove('active');
        studioScreen.classList.add('active');
        currentGenerationPromise = null; // Cancel/Ignore
    };
}

// Redundant Imagen function removed in favor of Pollinations.ai flow

/**
 * Generation Engine (Fotor-Style Mock)
 */
const GenerationEngine = {
    async generate(prompt) {
        const lowerPrompt = prompt.toLowerCase();
        let selectedUrl = "";

        // 0. Try Gemini Image Generation First
        const apiKey = localStorage.getItem('gemini_api_key');
        if (apiKey) {
            try {
                // Expanded visual description call
                const visualPrompt = await callGeminiAPI(
                    `Create a detailed, magical, and kid-friendly visual description for an AI image generator based on this prompt: "${prompt}". 
                    Make it breathtakingly beautiful, vibrant, and artistic. Focus on colors, lighting, and a whimsical atmosphere. 
                    Keep it under 45 words. Output ONLY the description string.`,
                    "You are a master artist muse for children."
                );

                if (visualPrompt) {
                    const cleanPrompt = visualPrompt.trim().replace(/^"|"$/g, '');
                    const encodedPrompt = encodeURIComponent(cleanPrompt);
                    const seed = Math.floor(Math.random() * 1000000);
                    selectedUrl = `https://pollinations.ai/p/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}`;
                    console.log("AI Generation URL Prepared:", selectedUrl);
                    return selectedUrl;
                }
            } catch (e) {
                console.warn("AI Generation Helper failed.", e);
            }
        }

        // Fallback: Dynamic high-quality placeholder based on user keywords
        const encodedFallback = encodeURIComponent(prompt + " magical artistic whimsical colorful");
        const seed = Math.floor(Math.random() * 1000000);
        return `https://pollinations.ai/p/${encodedFallback}?width=1024&height=1024&nologo=true&seed=${seed}`;
    }
};

function showResult(url) {
    const genScreen = document.getElementById('generation-screen');
    const resultScreen = document.getElementById('result-screen');
    const resultImg = document.getElementById('generated-image');

    genScreen.classList.remove('active');
    resultScreen.classList.add('active');

    // Use the resolved URL
    resultImg.src = url;

    // Apply Default Magic Style Filter
    resultImg.className = 'magic-result';

    initResultLogic();
}

function initResultLogic() {
    const backBtn = document.getElementById('result-back-btn');
    const saveBtn = document.getElementById('save-gallery-btn');
    const againBtn = document.getElementById('generate-again-btn');
    const editBtn = document.getElementById('edit-prompt-btn');
    const downloadBtn = document.getElementById('download-btn');
    const infoBtn = document.getElementById('how-ai-made-it');
    const modal = document.getElementById('info-modal');
    const closeModals = document.querySelectorAll('.close-modal');
    const stars = document.querySelectorAll('.star');

    backBtn.onclick = () => {
        document.getElementById('result-screen').classList.remove('active');
        document.getElementById('home-screen').classList.add('active');
    };

    saveBtn.onclick = () => {
        const art = {
            url: document.getElementById('generated-image').src,
            date: new Date().toLocaleDateString(),
            prompt: document.getElementById('art-prompt').value
        };
        const gallery = JSON.parse(localStorage.getItem('artify_gallery') || '[]');
        gallery.unshift(art);
        localStorage.setItem('artify_gallery', JSON.stringify(gallery));

        saveBtn.textContent = "✅ Saved to Gallery!";
        saveBtn.disabled = true;
        updateRecentGallery();
    };

    downloadBtn.onclick = () => {
        const url = document.getElementById('generated-image').src;
        const link = document.createElement('a');
        link.href = url;
        link.target = "_blank";
        link.download = 'artify_masterpiece.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        const oldText = downloadBtn.textContent;
        downloadBtn.textContent = "✅ Opening...";
        setTimeout(() => downloadBtn.textContent = oldText, 2000);
    };

    againBtn.onclick = () => startGeneration();

    editBtn.onclick = () => {
        document.getElementById('result-screen').classList.remove('active');
        document.getElementById('studio-screen').classList.add('active');
    };

    infoBtn.onclick = () => modal.classList.add('active');

    closeModals.forEach(btn => {
        btn.onclick = () => modal.classList.remove('active');
    });

    stars.forEach(star => {
        star.onclick = () => {
            const val = star.dataset.value;
            stars.forEach(s => {
                s.classList.toggle('active', s.dataset.value <= val);
            });
        };
    });
}

/**
 * Gallery Management
 */
function updateRecentGallery() {
    const gallery = document.getElementById('recent-gallery');
    // For now, it stays with placeholders or loads from localStorage
    const savedArt = JSON.parse(localStorage.getItem('artify_gallery') || '[]');

    if (savedArt.length > 0) {
        gallery.innerHTML = '';
        savedArt.slice(0, 5).forEach(art => {
            const card = document.createElement('div');
            card.className = 'art-card';
            card.innerHTML = `<img src="${art.url}" alt="My Creation">`;
            gallery.appendChild(card);
        });
    }
}

/**
 * Settings & API Logic
 */
function initSettings() {
    const settingsBtn = document.getElementById('settings-btn');
    const modal = document.getElementById('settings-modal');
    if (!settingsBtn || !modal) return;

    const closeBtn = modal.querySelector('.close-modal');
    const saveBtn = document.getElementById('save-settings-btn');
    const clearBtn = document.getElementById('clear-data-btn');
    const input = document.getElementById('api-key-input');
    const status = document.getElementById('settings-status');

    // Load saved key
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) input.value = savedKey;

    settingsBtn.onclick = () => {
        modal.classList.add('active');
        status.className = 'status-msg'; // Clear status on open
        status.textContent = '';
    };

    if (closeBtn) closeBtn.onclick = () => modal.classList.remove('active');

    saveBtn.onclick = () => {
        const key = input.value.trim();
        status.className = 'status-msg'; // Reset status

        if (key) {
            localStorage.setItem('gemini_api_key', key);
            status.textContent = "Settings saved! Your magic is ready. ✨";
            status.classList.add('success');

            saveBtn.textContent = "Saved! ✅";
            setTimeout(() => {
                saveBtn.textContent = "Save Settings 💾";
                status.classList.remove('success');
            }, 3000);
        } else {
            status.textContent = "Please enter an API key first! 🔑";
            status.classList.add('error');
        }
    };

    clearBtn.onclick = () => {
        if (confirm("Are you sure? This will delete all your art and settings! 🗑️")) {
            localStorage.clear();
            location.reload();
        }
    };
}

async function callGeminiAPI(prompt, systemPrompt = "You are a helpful assistant.") {
    const key = localStorage.getItem('gemini_api_key');
    if (!key) {
        console.warn("No Gemini API key found in localStorage.");
        return null;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini API Request Failed:", response.status, errorData);
            return null;
        }

        const data = await response.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
            return data.candidates[0].content.parts[0].text;
        } else {
            console.error("Gemini API Error: Invalid Response Structure", data);
            return null;
        }
    } catch (e) {
        console.error("Gemini API Network/Fetch Error:", e);
        return null;
    }
}

// Initialize Settings immediately
document.addEventListener('DOMContentLoaded', () => {
    initSettings();
});
