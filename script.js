import { supabase } from './supabaseClient.js';
console.log('script.js: supabase client on load:', supabase);
// Check if user is logged in
async function checkAuth() {
    console.log('script.js: supabase client in checkAuth:', supabase);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session && !window.location.href.includes('login.html') && !window.location.href.includes('signup.html')) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Display user information in the navbar and profile page
async function displayUserInfo() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            let displayName = user.email; // Default to email

            // Try to get full_name from profiles table
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('full_name, username')
                .eq('id', user.id)
                .single();

            if (profileError && profileError.code !== 'PGRST116') { // PGRST116: 'single' row not found, which is okay
                console.error('Error fetching profile:', profileError);
            } else if (profile) {
                if (profile.full_name) {
                    displayName = profile.full_name;
                } else if (profile.username) {
                    displayName = profile.username; // Fallback to username if full_name is not set
                }
            }
            
            const usernameDisplayElement = document.getElementById('username-display');
            if (usernameDisplayElement) {
                usernameDisplayElement.textContent = displayName;
            } else {
                // console.log('username-display element not found. User info not displayed in navbar.');
            }
            
            // Update profile page specific elements if on profile.html
            if (window.location.pathname.includes('profile.html')) {
                document.getElementById('profile-name').textContent = profile ? (profile.full_name || user.email) : user.email;
                document.getElementById('profile-username').textContent = profile && profile.username ? `@${profile.username}` : 'N/A';
                document.getElementById('profile-email').textContent = user.email;

                document.getElementById('fullname-value').textContent = profile ? (profile.full_name || 'N/A') : 'N/A';
                document.getElementById('email-value').textContent = user.email;
                document.getElementById('username-value').textContent = profile ? (profile.username || 'N/A') : 'N/A';
                // For 'joined-value', Supabase auth user 'created_at' is available, not directly from profile table unless synced.
                // For simplicity, let's use user.created_at from Supabase auth.
                const joinedDate = new Date(user.created_at);
                document.getElementById('joined-value').textContent = joinedDate.toLocaleDateString();
            }

        }
    } catch (error) {
        console.error('Exception in displayUserInfo:', error);
    }
}

// Handle logout
function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await supabase.auth.signOut();
            window.location.href = 'login.html';
        });
    }
}

// Sample questions database by category
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
    score = 0;
    if (scoreElement) {
        scoreElement.textContent = score;
    }
    showQuestion();
}

// Display current question and options
function showQuestion() {
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
    nextButton.disabled = true;
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
        options[currentQuestion.correctAnswer].classList.add('correct');
    }

    nextButton.disabled = false;
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

// Show final results
async function showResults() { // Made showResults async to await saveScore
    flashcardContainer.style.display = 'none';
    controlsContainer.style.display = 'none';
    resultsContainer.style.display = 'block';
    
    finalScoreElement.textContent = score;
    totalQuestionsElement.textContent = currentQuestions.length;
    
    await saveScore(); // Await the saveScore operation
}

// Save score to user's history
async function saveScore() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const scoreData = {
                user_id: user.id,
                category: selectedCategory, // Assuming selectedCategory is globally available
                score: score,             // Assuming score is globally available
                total_questions: currentQuestions.length // Assuming currentQuestions is globally available
            };

            const { error } = await supabase.from('scores').insert([scoreData]);
            if (error) {
                console.error('Error saving score:', error);
                // Optionally, inform the user via an alert or UI message
            } else {
                console.log('Score saved successfully!');
                // Optionally, confirm to the user via UI
            }
        } else {
            console.log('User not logged in. Score not saved.');
        }
    } catch (error) {
        console.error('Exception in saveScore:', error);
    }
}

// View answers
function viewAnswers() {
    alert('Answers review feature coming soon!');
}

// Try again
function tryAgain() {
    resultsContainer.style.display = 'none';
    flashcardContainer.style.display = 'block';
    controlsContainer.style.display = 'flex';
    initQuiz();
}

// Back to categories
function backToCategories() {
    resultsContainer.style.display = 'none';
    flashcardContainer.style.display = 'none';
    controlsContainer.style.display = 'none';
    categorySelector.style.display = 'block';
}

// Start quiz for selected category
function startCategoryQuiz(category) {
    selectedCategory = category;
    // Ensure questionsByCategory has the full structure
    currentQuestions = questionsByCategory[category] ? [...questionsByCategory[category]] : [];
    shuffleArray(currentQuestions);
    
    categorySelector.style.display = 'none';
    flashcardContainer.style.display = 'block';
    controlsContainer.style.display = 'flex';
    
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
            nextButton.style.display = 'block';
            restartButton.style.display = 'none';
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
                startCategoryQuiz(category);
            });
        });
    }
}

// Initialize the application
async function init() {
    if (await checkAuth()) {
        await displayUserInfo();
        setupLogout();
        if (categorySelector || flashcardContainer) {
             setupEventListeners();
        }
    }
}

// Start the application
document.addEventListener('DOMContentLoaded', init);