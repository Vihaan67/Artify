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
            // Using the helper function defined at the bottom of the file
            // Note: callGeminiAPI might return null if failed
            const aiPrompt = await callGeminiAPI("Generate 1 creative, funny, kid-friendly art prompt (max 12 words) with emojis. Just the text, nothing else.", "You are a creative art muse for children.");

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
    initCursor();
    initNavigation();
    updateRecentGallery();
    initInspiration();
    initGallery();
    initDailyChallenge();
    initSettings();
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
    const styleCards = document.querySelectorAll('.style-card');
    const ratioBtns = document.querySelectorAll('.ratio-btn');
    const generateBtn = document.getElementById('generate-magic-btn');

    // Char count
    promptArea.addEventListener('input', () => {
        charCount.textContent = `${promptArea.value.length} / 300`;
    });

    // Suggestions
    suggestBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            promptArea.value = btn.textContent;
            charCount.textContent = `${promptArea.value.length} / 300`;
        });
    });

    // Style selection
    styleCards.forEach(card => {
        card.addEventListener('click', () => {
            styleCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });

    // Ratio selection
    ratioBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            ratioBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Prompt Enhancer (Dynamic)
    enhanceBtn.addEventListener('click', () => {
        let original = promptArea.value.trim();
        if (!original) {
            alert("Type something first! 🎨");
            return;
        }

        enhanceBtn.disabled = true;
        enhanceBtn.textContent = "✨ Magic in progress...";

        setTimeout(() => {
            const lowerPrompt = original.toLowerCase();
            let additions = [];

            // Context-aware modifiers
            if (lowerPrompt.includes('cat') || lowerPrompt.includes('kitten')) additions.push('fluffy', 'big sparkling eyes');
            if (lowerPrompt.includes('dragon')) additions.push('mythical', 'breathing colorful smoke');
            if (lowerPrompt.includes('castle')) additions.push('majestic', 'shimmering in the sunlight');
            if (lowerPrompt.includes('gelatin') || lowerPrompt.includes('jello')) additions.push('wobbly', 'translucent', 'glow-in-the-dark');
            if (lowerPrompt.includes('space') || lowerPrompt.includes('rocket')) additions.push('interstellar', 'surrounded by glowing nebula');
            if (lowerPrompt.includes('robot')) additions.push('friendly', 'neon glowing lights');

            // Random high-quality generic modifiers
            const generics = [
                'vivid colors',
                'magical atmosphere',
                'whimsical details',
                'masterpiece quality',
                'soft cinematic lighting',
                'charming aesthetic',
                'super detailed',
                'vibrant background',
                'sparkly highlights'
            ];
            const randomGeneric = generics[Math.floor(Math.random() * generics.length)];
            const randomGeneric2 = generics[(Math.floor(Math.random() * generics.length) + 1) % generics.length];

            // Clean up original if it already has common starters to avoid nesting "A magical A magical..."
            original = original.replace(/^A magical |^A |^An /i, '');

            const enhancement = additions.length > 0
                ? `${additions.join(', ')}, ${randomGeneric} and ${randomGeneric2}`
                : `${randomGeneric} and ${randomGeneric2}`;

            // Smart grammar: don't add "with" if the original already has it
            const connector = original.toLowerCase().includes(' with') ? '' : ' with';
            promptArea.value = `A magical ${original}${connector} ${enhancement}.`.replace(/ ,/g, ',').replace(/,,/g, ',');

            charCount.textContent = `${promptArea.value.length} / 300`;
            enhanceBtn.disabled = false;
            enhanceBtn.textContent = "✨ Make it Better!";
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
    const activeStyleCard = document.querySelector('.style-card.active');
    const selectedStyle = activeStyleCard ? activeStyleCard.dataset.style : 'cartoon';

    currentGenerationPromise = GenerationEngine.generate(promptValue, selectedStyle);

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
            showResult(url, selectedStyle);
        } catch (e) {
            console.error("Generation failed:", e);
            // Fallback
            showResult('assets/candy_forest.png', selectedStyle);
        }
    }, 10000);

    document.getElementById('cancel-gen-btn').onclick = () => {
        clearInterval(interval);
        genScreen.classList.remove('active');
        studioScreen.classList.add('active');
        currentGenerationPromise = null; // Cancel/Ignore
    };
}

/**
 * Generation Engine (Fotor-Style Mock)
 */
const GenerationEngine = {
    themeMap: {
        // High Priority Environmental/Action Themes
        'robot': ['assets/robot_pizza.png'],
        'space': ['assets/space_adventure.png'],
        'rocket': ['assets/space_adventure.png'],
        'underwater': ['assets/underwater_library.png'],
        'ocean': ['assets/underwater_library.png'],
        'candy': ['assets/candy_forest.png'],
        'chocolate': ['assets/candy_forest.png'],
        'gelatin': ['https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1000&auto=format&fit=crop'],
        'jello': ['https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1000&auto=format&fit=crop'],
        'pirate': ['https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?q=80&w=1000&auto=format&fit=crop'],
        'mermaid': ['https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1000&auto=format&fit=crop'],

        // Subject Themes (Lower Priority)
        'pizza': ['assets/robot_pizza.png'],
        'cat': ['assets/cute_cat.png'],
        'kitten': ['assets/cute_cat.png'],
        'dragon': ['assets/magical_dragon.png'],
        'unicorn': ['https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=1000&auto=format&fit=crop'],
        'dinosaur': ['https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=1000&auto=format&fit=crop'],
        'superhero': ['https://images.unsplash.com/photo-1531259683007-016a7b3289c7?q=80&w=1000&auto=format&fit=crop'],

        // High-Quality Thematic Art (Remote)
        'sun': ['https://images.unsplash.com/photo-1590424765067-163f9d37c44e?q=80&w=1000&auto=format&fit=crop'], // Cute sun illustration
        'moon': ['https://images.unsplash.com/photo-1532693322450-2cb5c511067d?q=80&w=1000&auto=format&fit=crop'], // Dreamy moon
        'stars': ['https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0?q=80&w=1000&auto=format&fit=crop'],
        'castle': ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop'],
        'gelatin': ['https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1000&auto=format&fit=crop'],
        'unicorn': ['https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=1000&auto=format&fit=crop'],
        'mermaid': ['https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1000&auto=format&fit=crop'],
        'pirate': ['https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?q=80&w=1000&auto=format&fit=crop'],
        'dinosaur': ['https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=1000&auto=format&fit=crop'],
        'superhero': ['https://images.unsplash.com/photo-1531259683007-016a7b3289c7?q=80&w=1000&auto=format&fit=crop'],
        'forest': ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000&auto=format&fit=crop'],
        'beach': ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop'],
        'snow': ['https://images.unsplash.com/photo-1491002052546-bf38f186af56?q=80&w=1000&auto=format&fit=crop'],
        'house': ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1000&auto=format&fit=crop'],
        'car': ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop'],
        'bird': ['https://images.unsplash.com/photo-1444464666168-49d633b867ad?q=80&w=1000&auto=format&fit=crop'],
        'flowers': ['https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1000&auto=format&fit=crop'],
        'garden': ['https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1000&auto=format&fit=crop'],
        'party': ['https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=1000&auto=format&fit=crop'],
        'jungle': ['https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1000&auto=format&fit=crop'],
        'rainbow': ['https://images.unsplash.com/photo-1508189860359-750ca04abca5?q=80&w=1000&auto=format&fit=crop']
    },

    styleOverlays: {
        'cartoon': 'assets/robot_pizza.png', // Clear 3D/Cartoon style
        'watercolor': 'https://images.unsplash.com/photo-1515405299443-f7a11c884677?q=80&w=1000&auto=format&fit=crop',
        'pixel': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop', // Real pixel scene
        'sketch': 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?q=80&w=1000&auto=format&fit=crop',
        'fantasy': 'assets/magical_dragon.png',
        'space': 'assets/space_adventure.png'
    },

    async generate(prompt, style) {
        const lowerPrompt = prompt.toLowerCase();
        let selectedUrl = "";

        // 0. AI Enhanced Matching (If API Key exists)
        const apiKey = localStorage.getItem('gemini_api_key');
        if (apiKey) {
            const themes = Object.keys(this.themeMap).join(', ');
            // Ask Gemini which existing theme matches best or for a specific Unsplash keyword
            const bestTheme = await callGeminiAPI(
                `Analyze this child's art prompt: "${prompt}". 
                Task 1: If it matches one of these themes deeply, return the THEME NAME: [${themes}].
                Task 2: If not, return a single, simple, safe, high-quality SEARCH TERM for Unsplash (e.g. "cute panda", "space rocket").
                Return ONLY the single word or phrase.`,
                "You are an image classification AI for a kids app."
            );

            if (bestTheme) {
                const themeKey = bestTheme.trim().toLowerCase();
                // Check if it matches a local theme
                if (this.themeMap[themeKey]) {
                    const urls = this.themeMap[themeKey];
                    selectedUrl = urls[Math.floor(Math.random() * urls.length)];
                } else {
                    // It's a search term!
                    // Note: Here we could add a fallback logic if we had a paid API.
                    // For now, we respect the local themes but allow Gemini to be the "Director" mapping prompts to themes.
                }
            }
        }

        // 1. Priority Combinations (Specific Requests)
        if (!selectedUrl && lowerPrompt.includes('dragon') && (lowerPrompt.includes('ice cream') || lowerPrompt.includes('cream') || lowerPrompt.includes('cone'))) {
            selectedUrl = 'https://images.unsplash.com/photo-1576618148400-f54bed99fcf8?q=80&w=1000&auto=format&fit=crop';
        }

        // 2. Standard Keyword Match (Fallback)
        if (!selectedUrl) {
            for (const [key, urls] of Object.entries(this.themeMap)) {
                if (lowerPrompt.includes(key)) {
                    selectedUrl = urls[Math.floor(Math.random() * urls.length)];
                    break;
                }
            }
        }

        // 3. Style Fallback
        if (!selectedUrl) {
            selectedUrl = this.styleOverlays[style] || 'assets/candy_forest.png';
        }

        return selectedUrl;
    }
};

function showResult(url, style) {
    const genScreen = document.getElementById('generation-screen');
    const resultScreen = document.getElementById('result-screen');
    const resultImg = document.getElementById('generated-image');

    genScreen.classList.remove('active');
    resultScreen.classList.add('active');

    // Use the resolved URL
    resultImg.src = url;

    // Apply Magic Style Filter
    resultImg.className = '';
    resultImg.classList.add(`style-${style}`);

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
    // If settings button or modal doesn't exist (e.g. old HTML cache), skip
    if (!settingsBtn || !modal) return;

    const closeBtn = modal.querySelector('.close-modal');
    const saveBtn = document.getElementById('save-settings-btn');
    const clearBtn = document.getElementById('clear-data-btn');
    const input = document.getElementById('api-key-input');

    // Load saved key
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) input.value = savedKey;

    settingsBtn.onclick = () => modal.classList.add('active');

    if (closeBtn) closeBtn.onclick = () => modal.classList.remove('active');

    saveBtn.onclick = () => {
        const key = input.value.trim();
        if (key) {
            localStorage.setItem('gemini_api_key', key);
            saveBtn.textContent = "Saved! ✅";
            setTimeout(() => saveBtn.textContent = "Save Settings 💾", 2000);
            setTimeout(() => modal.classList.remove('active'), 1000);
        }
    };

    clearBtn.onclick = () => {
        if (confirm("Are you sure? This will delete all your art and settings!")) {
            localStorage.clear();
            location.reload();
        }
    };
}

async function callGeminiAPI(prompt, systemPrompt = "You are a helpful assistant.") {
    const key = localStorage.getItem('gemini_api_key');
    if (!key) return null;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt + "\n\nUser Request: " + prompt }] }]
            })
        });
        const data = await response.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            console.error("Gemini API Error: Invalid Response Structure", data);
            return null;
        }
    } catch (e) {
        console.error("Gemini API Error:", e);
        return null;
    }
}
