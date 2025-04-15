const quizData = [
  {
      "question": "What is the primary advantage of a DBMS over traditional file systems?",
      "options": ["Reduced data redundancy", "Faster data access", "Lower hardware costs", "Simpler implementation"],
      "answer": "Reduced data redundancy",
      "explanation": "DBMS minimizes data redundancy by centralizing data storage and allowing data sharing."
  },
  {
      "question": "Which type of data independence allows changes in the storage structure without affecting the conceptual schema?",
      "options": ["Logical Data Independence", "Physical Data Independence", "External Data Independence", "Structural Independence"],
      "answer": "Physical Data Independence",
      "explanation": "Physical data independence ensures that changes in the internal/physical level (e.g., indexes) do not impact the conceptual schema."
  },
  {
      "question": "In the three-level DBMS architecture, which level describes the user-specific views of the database?",
      "options": ["Internal Level", "Conceptual Level", "External Level", "Physical Level"],
      "answer": "External Level",
      "explanation": "The external level defines how different users perceive the data, tailored to their needs."
  },
  {
      "question": "Which of the following is a non-relational DBMS?",
      "options": ["MySQL", "PostgreSQL", "MongoDB", "Oracle"],
      "answer": "MongoDB",
      "explanation": "MongoDB is a document-based NoSQL database, unlike relational databases like MySQL."
  },
  {
      "question": "What does the 'conceptual schema' in the three-level architecture represent?",
      "options": ["Physical storage details", "Individual user views", "Entire database structure", "Network configuration"],
      "answer": "Entire database structure",
      "explanation": "The conceptual schema defines the logical structure of the entire database, including entities and relationships."
  },
  {
      "question": "Which component of a DBMS is responsible for concurrency control?",
      "options": ["Query Optimizer", "Transaction Manager", "Storage Manager", "Data Dictionary"],
      "answer": "Transaction Manager",
      "explanation": "The transaction manager ensures ACID properties and handles concurrent access to data."
  },
  {
      "question": "What is the difference between a schema and an instance?",
      "options": ["Schema changes frequently; instance is static", "Schema defines structure; instance is current data", "Schema is physical; instance is logical", "Schema is user-specific; instance is global"],
      "answer": "Schema defines structure; instance is current data",
      "explanation": "A schema is the database's blueprint, while an instance represents the actual data at a given time."
  },
  {
      "question": "In client-server architecture, the server primarily handles:",
      "options": ["User interface", "Data storage and processing", "Application logic", "Input validation"],
      "answer": "Data storage and processing",
      "explanation": "The server manages data storage, query processing, and transaction management in a client-server setup."
  },
  {
      "question": "Which schema is affected when a new column is added to a table?",
      "options": ["External Schema", "Conceptual Schema", "Internal Schema", "Physical Schema"],
      "answer": "Conceptual Schema",
      "explanation": "Adding a column modifies the logical structure of the database, altering the conceptual schema."
  },
  {
      "question": "ACID properties in DBMS are crucial for:",
      "options": ["Data compression", "Query optimization", "Transaction reliability", "Network security"],
      "answer": "Transaction reliability",
      "explanation": "ACID (Atomicity, Consistency, Isolation, Durability) ensures reliable transaction processing."
  },
  {
      "question": "Which data model is used by relational DBMS?",
      "options": ["Hierarchical model", "Network model", "Relational model", "Object-oriented model"],
      "answer": "Relational model",
      "explanation": "Relational DBMS organizes data into tables (relations) with rows and columns."
  },
  {
      "question": "The correct order of the three-level architecture from highest to lowest abstraction is:",
      "options": ["Conceptual, External, Internal", "External, Conceptual, Internal", "Internal, Conceptual, External", "External, Internal, Conceptual"],
      "answer": "External, Conceptual, Internal",
      "explanation": "External (user views) > Conceptual (logical structure) > Internal (physical storage)."
  },
  {
      "question": "Which language is used to define the conceptual schema?",
      "options": ["DML (Data Manipulation Language)", "DDL (Data Definition Language)", "DCL (Data Control Language)", "TCL (Transaction Control Language)"],
      "answer": "DDL (Data Definition Language)",
      "explanation": "DDL commands like CREATE/ALTER define the database structure (conceptual schema)."
  },
  {
      "question": "What is an example of physical data independence?",
      "options": ["Adding a user view", "Changing a file storage format", "Adding a new table", "Modifying a query"],
      "answer": "Changing a file storage format",
      "explanation": "Physical independence allows changing storage structures (e.g., file formats) without affecting higher levels."
  },
  {
      "question": "Which term refers to the actual data stored in the database at a specific time?",
      "options": ["Schema", "Subschema", "Instance", "Metadata"],
      "answer": "Instance",
      "explanation": "An instance is the collection of data in the database at a particular moment."
  }
];

let currentIndex = 0;
let timeLeft = 30;
let score = 0;
let timer;

function startQuiz() {
  document.getElementById("quiz-box").innerHTML = `
    <div id="progress-bar-container">
      <div id="progress-bar"></div>
      <span id="progress-text">Question 1 / ${quizData.length}</span>
    </div>
    <div id="question-box"></div>
    <div id="options-box"></div>
    <div id="timer">Time Left: <span id="time">30</span>s</div>
  `;
  showQuestion();
}

function showQuestion() {
  if (currentIndex >= quizData.length) return endQuiz();

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
  clearInterval(timer);
  timeLeft = 30;
  document.getElementById("time").innerText = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("time").innerText = timeLeft;
    if (timeLeft === 0) {
      clearInterval(timer);
      showAnswer(false);
    }
  }, 1000);
}

function checkAnswer(selected) {
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

  const audio = new Audio(selected === correct ? "audio/correct.mp3" : "audio/wrong.mp3");
  audio.play();

  if (selected === correct) {
    score++;
    setTimeout(() => {
      currentIndex++;
      showQuestion();
    }, 1000);
  } else {
    clearInterval(timer);
    showAnswer(true);
  }
}

function showAnswer(wasWrong) {
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

function endQuiz() {
  const percent = Math.round((score / quizData.length) * 100);
  let message = "Great job!";

  if (percent < 50) message = "Keep practicing!";
  else if (percent < 80) message = "Well done!";
  else if (percent === 100) {
    message = "🎉 Perfect Score! You're a DBMS pro!";
    triggerConfetti();
  }

  const prevHigh = parseInt(localStorage.getItem("highscore") || "0");
  if (percent > prevHigh) {
    localStorage.setItem("highscore", percent);
  }

  document.getElementById("quiz-box").innerHTML = `
    <div class="fade-in">
      <h2>Quiz Completed!</h2>
      <p><strong>Your Score:</strong> ${score}/${quizData.length} (${percent}%)</p>
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
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
}

function retryQuiz() {
  currentIndex = 0;
  score = 0;
  startQuiz();
}

function goHome() {
  window.location.href = "index.html";
}

function goToDashboard() {
  window.location.href = "dashboard.html";
}

function goToLeaderboard() {
  window.location.href = "leaderboard.html";
}

window.onload = () => {
  showCountdown();
};

function playBeep() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, ctx.currentTime);
  gainNode.gain.setValueAtTime(0.5, ctx.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.15); // Short beep
}

function showCountdown() {
  document.getElementById("quiz-box").innerHTML = `
    <div class="countdown-screen">
      <h2>Quiz will start in</h2>
      <div id="countdown-circle">
        <svg width="120" height="120">
          <circle r="50" cx="60" cy="60" stroke="#eee" stroke-width="10" fill="none"/>
          <circle id="progress-ring" r="50" cx="60" cy="60" stroke="#ff66cc" stroke-width="10" fill="none"
            stroke-dasharray="314" stroke-dashoffset="0" transform="rotate(-90 60 60)" />
        </svg>
        <div id="countdown-text">5</div>
      </div>
    </div>
  `;

  let totalTime = 5;
  let startTime = performance.now();
  const progressRing = document.getElementById("progress-ring");
  const countdownText = document.getElementById("countdown-text");
  let lastSecond = 5;

  function update(now) {
    const elapsed = (now - startTime) / 1000;
    const remaining = Math.max(0, totalTime - elapsed);
    const currentSecond = Math.ceil(remaining);

    // Only update text and beep when second changes
    if (currentSecond !== lastSecond) {
      countdownText.textContent = currentSecond;
      if (currentSecond > 0) playBeep();
      lastSecond = currentSecond;
    }

    const offset = 314 * (remaining / totalTime);
    progressRing.setAttribute("stroke-dashoffset", 314 - offset);

    if (remaining > 0) {
      requestAnimationFrame(update);
    } else {
      startQuiz(); // Launch quiz
    }
  }

  requestAnimationFrame(update);
}


  let secondsLeft = 5;
  const progressCircle = document.getElementById("progress-ring");
  const countdownText = document.getElementById("countdown-text");

  const interval = setInterval(() => {
    secondsLeft--;
    countdownText.textContent = secondsLeft;

    const offset = 314 - (secondsLeft / 5) * 314;
    progressCircle.setAttribute("stroke-dashoffset", offset);

    if (secondsLeft <= 0) {
      clearInterval(interval);
      startQuiz();
    }
  }, 1000);
