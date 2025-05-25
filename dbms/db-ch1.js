// Ensure Supabase client is available (globally as `supabase` via supabaseClient.js)
if (typeof supabase === 'undefined') {
    console.error('Supabase client is not loaded. Make sure supabaseClient.js is included before this script.');
    // Optionally, display an error to the user or disable quiz functionality
    alert('Error: Database connection not available. Quiz functionality may be limited.');
}

const quizData = [
  {
      "question": "What is the primary advantage of a DBMS over traditional file systems?",
      "options": ["Reduced data redundancy", "Faster data access", "Lower hardware costs", "Simpler implementation"],
      "answer": "Reduced data redundancy",
      "explanation": "DBMS minimizes data redundancy by centralizing data storage and allowing data sharing."
  },
  {
      "question": "Which of the following is NOT a typical function of a DBMS?",
      "options": ["Data definition", "Data manipulation", "Operating system management", "Data security and integrity"],
      "answer": "Operating system management",
      "explanation": "DBMS manages data; the OS manages hardware and system resources."
  },
  {
      "question": "What does ACID stand for in the context of database transactions?",
      "options": ["Atomicity, Consistency, Isolation, Durability", "Availability, Concurrency, Integrity, Durability", "Atomicity, Concurrency, Isolation, Distribution", "Authenticity, Consistency, Integrity, Distribution"],
      "answer": "Atomicity, Consistency, Isolation, Durability",
      "explanation": "ACID properties ensure reliable transaction processing."
  },
  {
      "question": "Which type of database model organizes data in a tree-like structure?",
      "options": ["Relational", "Hierarchical", "Network", "Object-Oriented"],
      "answer": "Hierarchical",
      "explanation": "The hierarchical model uses a parent-child relationship structure."
  },
  {
      "question": "What is a 'schema' in database terms?",
      "options": ["A backup of the database", "The actual data stored", "The logical design of the database", "A user query"],
      "answer": "The logical design of the database",
      "explanation": "A schema defines the structure, tables, and relationships of the database."
  },
  {
      "question": "Which SQL command is used to retrieve data from a database?",
      "options": ["UPDATE", "INSERT", "DELETE", "SELECT"],
      "answer": "SELECT",
      "explanation": "SELECT is used to query and retrieve data from one or more tables."
  },
  {
      "question": "What is 'normalization' in the context of DBMS?",
      "options": ["A process to secure the database", "A process to reduce data redundancy and improve data integrity", "A method for faster data retrieval", "A technique for creating database backups"],
      "answer": "A process to reduce data redundancy and improve data integrity",
      "explanation": "Normalization involves organizing data to minimize redundancy and dependency."
  },
  {
      "question": "Which of the following is a NoSQL database type?",
      "options": ["MySQL", "PostgreSQL", "MongoDB", "Oracle"],
      "answer": "MongoDB",
      "explanation": "MongoDB is a document-oriented NoSQL database."
  },
  {
      "question": "What is a 'primary key' in a relational database?",
      "options": ["A key used for encryption", "A unique identifier for a record in a table", "A key that links two tables together", "A non-unique attribute"],
      "answer": "A unique identifier for a record in a table",
      "explanation": "A primary key uniquely identifies each row in a table."
  },
  {
      "question": "Which term refers to the actual data stored in the database at a specific time?",
      "options": ["Schema", "Subschema", "Instance", "Metadata"],
      "answer": "Instance",
      "explanation": "An instance is the collection of data in the database at a particular moment."
  }
];

let currentIndex = 0;
let timeLeft = 30; // Initial time for each question
let totalTimeSpent = 0; // Variable to track total time spent on the quiz
let questionTimerInterval; // Timer for each question
let quizStartTime; // Timestamp when the quiz starts

let score = 0;
// timer variable was declared locally in resetTimer, made it global for clearInterval in checkAnswer/showAnswer
let timer; 

// Function to format time from seconds to MM:SS
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startQuiz() {
    currentIndex = 0;
    score = 0;
    totalTimeSpent = 0; // Reset total time spent
    quizStartTime = Date.now(); // Record quiz start time

    document.getElementById("quiz-box").innerHTML = `
        <div id="progress-bar-container">
            <div id="progress-bar"></div>
            <span id="progress-text">Question 1 / ${quizData.length}</span>
        </div>
        <div id="question-box"></div>
        <div id="options-box"></div>
        <div id="timer">Time Left: <span id="time">${timeLeft}</span>s</div>
    `;
    showQuestion();
}

function showQuestion() {
    if (currentIndex >= quizData.length) {
        totalTimeSpent = Math.floor((Date.now() - quizStartTime) / 1000); // Calculate total time spent in seconds
        return endQuiz();
    }

    const q = quizData[currentIndex];
    document.getElementById("question-box").innerText = q.question;
    const optionsBox = document.getElementById("options-box");
    optionsBox.innerHTML = "";

    q.options.forEach(option => {
        const btn = document.createElement("button");
        btn.innerText = option;
        btn.className = "option";
        btn.onclick = () => checkAnswer(option);
        optionsBox.appendChild(btn);
    });

    updateProgress();
    resetTimer();
}

function updateProgress() {
    const progress = ((currentIndex + 1) / quizData.length) * 100;
    document.getElementById("progress-bar").style.width = `${progress}%`;
    document.getElementById("progress-text").textContent = `Question ${currentIndex + 1} / ${quizData.length}`;
}

function resetTimer() {
    clearInterval(timer); // Use the global timer variable
    let questionTime = timeLeft; // Use the global timeLeft for question duration
    document.getElementById("time").innerText = questionTime;
    timer = setInterval(() => {
        questionTime--;
        document.getElementById("time").innerText = questionTime;
        if (questionTime === 0) {
            clearInterval(timer);
            showAnswer(false); // Indicate that time ran out, not necessarily a wrong answer by click
        }
    }, 1000);
}

function checkAnswer(selected) {
    clearInterval(timer); // Stop the timer for the current question
    const correct = quizData[currentIndex].answer;
    const options = document.querySelectorAll(".option");

    options.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correct) {
            btn.classList.add("correct");
        } else if (btn.textContent === selected && selected !== correct) {
            btn.classList.add("wrong");
        }
    });

    const audio = new Audio("../audio/correct.mp3"); // Corrected path
    audio.play();

    if (selected === correct) {
        score++;
        setTimeout(() => {
            currentIndex++;
            showQuestion();
        }, 1000); // Delay before showing next question
    } else {
        // No need to pass 'true' if showAnswer doesn't use it to penalize
        showAnswer(false); // Or pass a specific flag if needed
    }
}

function showAnswer(wasWrongDueToTimeoutOrChoice) { // Parameter name updated for clarity
    clearInterval(timer); // Ensure timer is stopped
    const q = quizData[currentIndex];
    document.getElementById("options-box").innerHTML = `
        <div class="answer-card">
            <p><strong>Correct Answer:</strong> ${q.answer}</p>
            <p><strong>Explanation:</strong> ${q.explanation}</p>
            <button onclick="nextQuestion()">Next</button>
        </div>
    `;
}

function nextQuestion() {
    currentIndex++;
    showQuestion();
}

async function endQuiz() { // Made async
    clearInterval(timer); // Clear any running timers
    totalTimeSpent = Math.floor((Date.now() - quizStartTime) / 1000); // Final calculation of total time

    const percent = Math.round((score / quizData.length) * 100);
    let message = "Great job!";

    if (percent < 50) message = "Keep practicing!";
    else if (percent < 80) message = "Well done!";
    else if (percent === 100) {
        message = "🎉 Perfect Score! You're a DBMS pro!";
        if (typeof confetti === 'function') triggerConfetti(); // Check if confetti is defined
    }

    // --- Supabase Integration ---
    let userId = null;
    try {
        const { data: { user } , error: authError } = await supabase.auth.getUser();
        if (authError) {
            console.error("Error getting user:", authError);
            // Potentially redirect to login or show message if user is not found
        }
        if (user) {
            userId = user.id;
        } else {
            console.warn("User not logged in. Quiz results will not be saved.");
            // Optionally, prompt user to log in to save results
        }
    } catch (e) {
        console.error("Exception while getting user:", e);
    }
    
    if (userId && typeof supabase !== 'undefined') {
        const quizResultData = {
            user_id: userId,
            quiz_category: "DBMS Chapter 1", // Specific to this quiz file
            score: score,
            total_questions: quizData.length,
            percentage: percent,
            completed_at: new Date().toISOString(),
            time_taken_seconds: totalTimeSpent 
        };

        try {
            const { data, error } = await supabase.from('quiz_results').insert([quizResultData]);
            if (error) {
                console.error('Error saving quiz result to Supabase:', error);
                message += "\n(Could not save your score due to a network issue.)"; // Append to existing message
            } else {
                console.log('Quiz result saved successfully:', data);
                // message += "\n(Score saved to your profile!)"; // Optional: confirmation
            }
        } catch (e) {
            console.error('Exception while saving quiz result:', e);
            message += "\n(Could not save your score due to an unexpected error.)";
        }
    } else if (typeof supabase === 'undefined') {
        message += "\n(Database connection not available. Score not saved.)";
    } else if (!userId) {
         message += "\n(Log in to save your scores!)";
    }
    // --- End Supabase Integration ---

    // Remove localStorage highscore logic
    // const prevHigh = parseInt(localStorage.getItem("highscore") || "0");
    // if (percent > prevHigh) {
    //    localStorage.setItem("highscore", percent);
    // }

    document.getElementById("quiz-box").innerHTML = `
        <div class="fade-in">
            <h2>Quiz Completed!</h2>
            <p><strong>Your Score:</strong> ${score}/${quizData.length} (${percent}%)</p>
            <p><strong>Time Taken:</strong> ${formatTime(totalTimeSpent)}</p>
            <p>${message}</p>
            <div class="end-buttons">
                <button onclick="retryQuiz()">🔁 Retry</button>
                <button onclick="goHome()">🏠 Home</button>
                <button onclick="goToDashboard()">📊 Dashboard</button>
                <button onclick="goToLeaderboard()">🏆 Leaderboard</button>
            </div>
        </div>
    `;
}

function triggerConfetti() {
    // Ensure confetti is loaded and available
    if (typeof confetti === "function") {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

function retryQuiz() {
    // Reset necessary variables before starting quiz again
    currentIndex = 0;
    score = 0;
    timeLeft = 30; // Reset initial time for questions
    totalTimeSpent = 0;
    // quizStartTime will be reset in startQuiz
    startQuiz();
}

function goHome() {
    window.location.href = "../index.html";  // Corrected path
}

function goToDashboard() {
    window.location.href = "../dashboard.html"; // Corrected path
}

function goToLeaderboard() {
    window.location.href = "../leaderboard.html"; // Corrected path
}

window.onload = () => {
    // Check if supabase object exists, if not, show an error or disable quiz.
    if (typeof supabase === 'undefined') {
        const quizBox = document.getElementById("quiz-box");
        if (quizBox) {
            quizBox.innerHTML = 
                '<p style="color: red; text-align: center; margin-top: 50px;">' +
                'Error: Unable to connect to the database. Quiz functionality is disabled. ' +
                'Please ensure supabaseClient.js is correctly configured and included.</p>';
        }
        return; // Stop further execution if supabase is not available
    }
    showCountdown();
};

function playBeep() {
    // Ensure AudioContext is available
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
        console.warn("AudioContext not supported. Beep sound disabled.");
        return;
    }
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime); // Reduced gain for a softer beep

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.1); // Shorter beep
}

function showCountdown() {
    const quizBox = document.getElementById("quiz-box");
    if (!quizBox) {
        console.error("quiz-box element not found for countdown.");
        return;
    }
    quizBox.innerHTML = `
        <div class="countdown-screen">
            <h2>Quiz will start in</h2>
            <div id="countdown-circle">
                <svg width="120" height="120">
                    <circle r="50" cx="60" cy="60" stroke="#eee" stroke-width="10" fill="none"/>
                    <circle id="progress-ring" r="50" cx="60" cy="60" stroke="#ff66cc" stroke-width="10" fill="none"
                            stroke-dasharray="314" stroke-dashoffset="314" transform="rotate(-90 60 60)" />
                </svg>
                <div id="countdown-text">5</div>
            </div>
        </div>
    `;

    let secondsLeft = 5;
    const progressRing = document.getElementById("progress-ring");
    const countdownText = document.getElementById("countdown-text");
    
    if (!progressRing || !countdownText) {
        console.error("Countdown elements (progress-ring or countdown-text) not found.");
        return; // Exit if essential elements are missing
    }

    // Initial state for animation
    progressRing.style.strokeDashoffset = "314"; // Full circle gap

    const interval = setInterval(() => {
        secondsLeft--;
        countdownText.textContent = secondsLeft;
        
        const offset = (secondsLeft / 5) * 314; // Calculate offset based on remaining time
        progressRing.style.strokeDashoffset = offset;

        if (secondsLeft > 0) {
            playBeep();
        }

        if (secondsLeft <= 0) {
            clearInterval(interval);
            startQuiz();
        }
    }, 1000);
}

// The redundant countdown logic block after requestAnimationFrame was removed.
// The `timer` variable was made global to be accessible by clearInterval in checkAnswer/showAnswer.
// Added `totalTimeSpent` and `quizStartTime` for time tracking.
// Corrected audio paths (e.g., "../audio/correct.mp3") assuming dbms.html is in the root.
// Corrected goHome, goToDashboard, goToLeaderboard paths.
// Added check for `confetti` and `supabase` objects before use.
