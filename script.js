// Ensure Supabase client is available
// This check should be at the very top, or supabase should be checked before use in each function.
// For simplicity, functions will check if supabase is defined.

// Check if user is logged in
async function checkAuth() {
    if (typeof supabase === 'undefined') {
        console.error('Supabase client not available for checkAuth.');
        // If Supabase isn't loaded, can't check auth state, might default to redirecting
        // or showing an error. For now, let's assume if Supabase isn't there, something is wrong.
        if (!window.location.href.includes('login.html') && !window.location.href.includes('signup.html')) {
            // window.location.href = 'login.html'; // Uncomment if redirection is desired on Supabase load failure
        }
        return false;
    }

    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
        console.error("Error getting session for checkAuth:", error);
        return false; // Or handle error appropriately
    }

    if (!session && !window.location.href.includes('login.html') && !window.location.href.includes('signup.html')) {
        console.log("No session found, redirecting to login.");
        window.location.href = 'login.html';
        return false;
    }
    // If there's a session, or if we are on login/signup page, this function returns true or doesn't redirect.
    return true; 
}

// Display user information in the navbar (if applicable)
async function displayUserInfo() {
    if (typeof supabase === 'undefined') {
        console.warn('Supabase not available for displayUserInfo.');
        return;
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    const usernameDisplay = document.getElementById('username-display'); // Assuming this element exists in your navbar HTML

    if (authError) {
        console.error("Error fetching user for displayUserInfo:", authError);
        if(usernameDisplay) usernameDisplay.textContent = 'Guest';
        return;
    }

    if (user && usernameDisplay) {
        // Use email as a fallback if username is not directly on auth.user metadata
        // Or fetch from your 'users' table if you stored a specific display username there
        const display = user.user_metadata?.username || user.email; 
        usernameDisplay.textContent = display;
    } else if (usernameDisplay) {
        usernameDisplay.textContent = 'Guest';
    }
}

// Handle logout
function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        // Check if event listener is already attached to avoid duplicates,
        // especially if this script is loaded on pages that also have their own logout handlers.
        // A simple way: give it a flag or remove previous before adding.
        // For now, let's assume it's fine, but this can be an issue with multiple scripts.
        logoutBtn.addEventListener('click', async () => {
            if (typeof supabase === 'undefined') {
                alert('Supabase is not available. Cannot log out.');
                return;
            }
            try {
                const { error } = await supabase.auth.signOut();
                if (error) {
                    console.error('Error during sign out:', error);
                    alert('Logout failed: ' + error.message);
                } else {
                    window.location.href = 'login.html'; // Redirect to login page
                }
            } catch (e) {
                console.error('Exception during sign out:', e);
                alert('An unexpected error occurred during logout.');
            }
        });
    }
}

// --- EXISTING QUIZ LOGIC AND OTHER FUNCTIONS BELOW ---
// (Keep all other functions like questionsByCategory, initQuiz, showQuestion, etc., as they are.
// You are manually updating their Supabase integration for quiz results.)

const questionsByCategory = {
    general: [
        {
            question: "What is the capital of France?",
            options: ["London", "Berlin", "Paris", "Madrid"],
            correctAnswer: 2
        },
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            correctAnswer: 1
        },
        {
            question: "What is the largest mammal in the world?",
            options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
            correctAnswer: 1
        },
        {
            question: "Who painted the Mona Lisa?",
            options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
            correctAnswer: 2
        },
        {
            question: "What is the chemical symbol for gold?",
            options: ["Ag", "Fe", "Au", "Cu"],
            correctAnswer: 2
        }
    ],
    science: [
        {
            question: "What is the chemical formula for water?",
            options: ["H2O", "CO2", "O2", "H2O2"],
            correctAnswer: 0
        },
        {
            question: "Which element has the atomic number 1?",
            options: ["Helium", "Hydrogen", "Lithium", "Carbon"],
            correctAnswer: 1
        },
        {
            question: "What is the hardest natural substance on Earth?",
            options: ["Gold", "Iron", "Diamond", "Platinum"],
            correctAnswer: 2
        },
        {
            question: "What is the largest organ in the human body?",
            options: ["Heart", "Brain", "Liver", "Skin"],
            correctAnswer: 3
        },
        {
            question: "What is the speed of light in miles per second?",
            options: ["186,282", "150,000", "200,000", "170,000"],
            correctAnswer: 0
        }
    ],
    history: [
        {
            question: "In which year did World War II end?",
            options: ["1945", "1939", "1941", "1943"],
            correctAnswer: 0
        },
        {
            question: "Who was the first President of the United States?",
            options: ["Thomas Jefferson", "Abraham Lincoln", "George Washington", "John Adams"],
            correctAnswer: 2
        },
        {
            question: "Which ancient wonder was located in Alexandria, Egypt?",
            options: ["The Great Pyramid", "The Hanging Gardens", "The Lighthouse", "The Colossus"],
            correctAnswer: 2
        },
        {
            question: "In which year did the Titanic sink?",
            options: ["1912", "1905", "1920", "1898"],
            correctAnswer: 0
        },
        {
            question: "Who was the first woman to fly solo across the Atlantic Ocean?",
            options: ["Amelia Earhart", "Bessie Coleman", "Jackie Cochran", "Harriet Quimby"],
            correctAnswer: 0
        }
    ],
    geography: [
        {
            question: "What is the largest desert in the world?",
            options: ["Gobi Desert", "Sahara Desert", "Arabian Desert", "Antarctic Desert"],
            correctAnswer: 3
        },
        {
            question: "Which is the longest river in the world?",
            options: ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"],
            correctAnswer: 1
        },
        {
            question: "What is the capital of Japan?",
            options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
            correctAnswer: 2
        },
        {
            question: "Which country has the largest population?",
            options: ["India", "China", "United States", "Indonesia"],
            correctAnswer: 1
        },
        {
            question: "What is the smallest continent?",
            options: ["Europe", "Australia", "Antarctica", "North America"],
            correctAnswer: 1
        }
    ]
};


let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0; 
let canAnswer = true;
let selectedCategory = '';

// DOM Elements
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const scoreElement = document.getElementById('score'); 
const nextButton = document.getElementById('next-btn');
const restartButton = document.getElementById('restart-btn');
const finalScoreElement = document.getElementById('final-score');
const totalQuestionsElement = document.getElementById('total-questions');
const viewAnswersButton = document.getElementById('view-answers-btn');
const tryAgainButton = document.getElementById('try-again-btn');
const backToCategoriesButton = document.getElementById('back-to-categories-btn');
const categoryCards = document.querySelectorAll('.category-card');
const flashcardContainer = document.querySelector('.flashcard-container');
const controlsContainer = document.querySelector('.controls');
const resultsContainer = document.querySelector('.results-container');
const categorySelector = document.querySelector('.category-selector');

// Initialize the quiz
function initQuiz() {
    currentQuestionIndex = 0;
    // score = 0; // Reset score for the general quiz. This `score` variable is global.
    if (scoreElement) {
        scoreElement.textContent = score; 
    }
    showQuestion();
}

// Display current question and options
function showQuestion() {
    if (!questionElement || !optionsElement || !currentQuestions[currentQuestionIndex]) {
        // console.error("Required elements for showQuestion are missing or data is not ready.");
        return;
    }
    const currentQuestion = currentQuestions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    
    optionsElement.innerHTML = '';
    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('div');
        button.className = 'option';
        button.textContent = option;
        button.addEventListener('click', () => selectOption(index));
        optionsElement.appendChild(button);
    });

    canAnswer = true;
    if(nextButton) nextButton.disabled = true;
}

// Handle option selection
function selectOption(index) {
    if (!canAnswer) return;
    
    canAnswer = false;
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const options = optionsElement.children;
    
    Array.from(options).forEach(option => {
        option.style.pointerEvents = 'none';
    });

    if (index === currentQuestion.correctAnswer) {
        options[index].classList.add('correct');
        score++; 
        if (scoreElement) {
            scoreElement.textContent = score;
        }
    } else {
        options[index].classList.add('wrong');
        if (options[currentQuestion.correctAnswer]) { 
            options[currentQuestion.correctAnswer].classList.add('correct');
        }
    }

    if(nextButton) nextButton.disabled = false;
}

// Move to next question
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

// Show final results for general quiz
async function showResults() { // Made async as saveScore will be async
    if (flashcardContainer) flashcardContainer.style.display = 'none';
    if (controlsContainer) controlsContainer.style.display = 'none';
    if (resultsContainer) resultsContainer.style.display = 'block';
    
    if (finalScoreElement) finalScoreElement.textContent = score; 
    if (totalQuestionsElement) totalQuestionsElement.textContent = currentQuestions.length;
    
    if (typeof saveScore === "function") {
        let userId = null;
        if (typeof supabase !== 'undefined') {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) userId = user.id;
        }
        if (userId) {
            // Assuming saveScore is now: async saveScore(userId, category, scoreValue, totalQuestions)
            await saveScore(userId, selectedCategory, score, currentQuestions.length);
        } else {
            console.warn("User not logged in, score not saved for general quiz.");
            // Optionally alert the user that their score for the general quiz won't be saved
        }
    }
}

// Placeholder for the new saveScore you are adding manually:
// async function saveScore(userId, category, scoreValue, totalQuestions) { /* ... your Supabase logic ... */ }
// The old localStorage saveScore() function is removed.

// View answers
function viewAnswers() {
    alert('Answers review feature coming soon!');
}

// Try again
function tryAgain() {
    if(resultsContainer) resultsContainer.style.display = 'none';
    if(flashcardContainer) flashcardContainer.style.display = 'block';
    if(controlsContainer) controlsContainer.style.display = 'flex';
    initQuiz(); 
}

// Back to categories
function backToCategories() {
    if(resultsContainer) resultsContainer.style.display = 'none';
    if(flashcardContainer) flashcardContainer.style.display = 'none';
    if(controlsContainer) controlsContainer.style.display = 'none';
    if(categorySelector) categorySelector.style.display = 'block';
}

// Start quiz for selected category
function startCategoryQuiz(category) {
    selectedCategory = category;
    currentQuestions = [...(questionsByCategory[category] || [])]; 
    shuffleArray(currentQuestions);
    
    if(categorySelector) categorySelector.style.display = 'none';
    if(flashcardContainer) flashcardContainer.style.display = 'block';
    if(controlsContainer) controlsContainer.style.display = 'flex';
    
    score = 0; // Reset score for the new category quiz
    initQuiz();
}

// Shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Event listeners
function setupEventListeners() {
    if (nextButton) {
        nextButton.addEventListener('click', nextQuestion);
    }
    if (restartButton) {
        restartButton.addEventListener('click', () => {
            if(nextButton) nextButton.style.display = 'block';
            if(restartButton) restartButton.style.display = 'none';
            initQuiz();
        });
    }
    if (viewAnswersButton) {
        viewAnswersButton.addEventListener('click', viewAnswers);
    }
    if (tryAgainButton) {
        tryAgainButton.addEventListener('click', tryAgain);
    }
    if (backToCategoriesButton) {
        backToCategoriesButton.addEventListener('click', backToCategories);
    }
    if (categoryCards) {
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const category = card.getAttribute('data-category');
                if (questionsByCategory[category]) { 
                    startCategoryQuiz(category);
                } else {
                    console.warn(`Category ${category} not found for quiz.`);
                }
            });
        });
    }
}

// Initialize the application
async function init() { // Made init async because checkAuth is async
    await checkAuth(); 
    await displayUserInfo(); 
    setupLogout(); 
    setupEventListeners(); 
}

document.addEventListener('DOMContentLoaded', init);
