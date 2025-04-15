const quizData = [
  {
      "question": "Which SQL command is used to grant permissions to users?",
      "options": ["GRANT", "REVOKE", "COMMIT", "ROLLBACK"],
      "answer": "GRANT",
      "explanation": "GRANT is a DCL (Data Control Language) command used to assign privileges to users."
  },
  {
      "question": "In ER modeling, how is a weak entity represented in the relational schema?",
      "options": ["As a separate table with a foreign key", "As a column in the strong entity's table", "As a composite attribute", "As a multivalued attribute"],
      "answer": "As a separate table with a foreign key",
      "explanation": "A weak entity requires its own table and includes a foreign key referencing the primary key of the strong entity."
  },
  {
      "question": "Which normal form eliminates transitive dependencies?",
      "options": ["1NF", "2NF", "3NF", "BCNF"],
      "answer": "3NF",
      "explanation": "3NF ensures non-key attributes depend only on the primary key, removing transitive dependencies."
  },
  {
      "question": "What type of anomaly occurs when a new record cannot be inserted due to missing data?",
      "options": ["Update anomaly", "Insertion anomaly", "Deletion anomaly", "Redundancy anomaly"],
      "answer": "Insertion anomaly",
      "explanation": "Insertion anomalies happen when adding data requires unavailable dependent information."
  },
  {
      "question": "Which SQL clause is part of DML?",
      "options": ["CREATE", "ALTER", "INSERT", "TRUNCATE"],
      "answer": "INSERT",
      "explanation": "INSERT is a DML (Data Manipulation Language) command used to add data to tables."
  },
  {
      "question": "In a relational database, a candidate key is:",
      "options": ["A foreign key in another table", "A superkey with no redundant attributes", "A primary key with auto-increment", "A composite key with two attributes"],
      "answer": "A superkey with no redundant attributes",
      "explanation": "A candidate key is a minimal superkey uniquely identifying tuples without redundant attributes."
  },
  {
      "question": "Which of the following is NOT a valid step in ER-to-relational mapping?",
      "options": ["Convert composite attributes to separate columns", "Map ternary relationships to a single table", "Replace multivalued attributes with a new table", "Merge weak entities into their strong entity's table"],
      "answer": "Merge weak entities into their strong entity's table",
      "explanation": "Weak entities are mapped to separate tables with foreign keys, not merged into the strong entity's table."
  },
  {
      "question": "A relation R(A, B, C) has FD: AB → C and C → B. Is R in BCNF?",
      "options": ["Yes", "No", "Depends on the data", "Cannot determine"],
      "answer": "No",
      "explanation": "C → B violates BCNF because C is not a superkey. BCNF requires determinants to be superkeys."
  },
  {
      "question": "Which command ensures all changes made by a transaction are permanently saved?",
      "options": ["ROLLBACK", "COMMIT", "SAVEPOINT", "TRUNCATE"],
      "answer": "COMMIT",
      "explanation": "COMMIT (TCL) finalizes transactions, making changes permanent."
  },
  {
      "question": "What is the minimal superkey in a relation called?",
      "options": ["Foreign key", "Primary key", "Candidate key", "Alternate key"],
      "answer": "Candidate key",
      "explanation": "A candidate key is a minimal set of attributes uniquely identifying tuples."
  },
  {
      "question": "Which normal form requires atomic values and eliminates repeating groups?",
      "options": ["1NF", "2NF", "3NF", "BCNF"],
      "answer": "1NF",
      "explanation": "1NF ensures all attributes contain atomic (indivisible) values."
  },
  {
      "question": "Which SQL command is used to define a table's structure?",
      "options": ["UPDATE", "CREATE", "INSERT", "GRANT"],
      "answer": "CREATE",
      "explanation": "CREATE is a DDL (Data Definition Language) command for defining database objects."
  },
  {
      "question": "If X → Y and Y → Z exist in a relation, which dependency is transitive?",
      "options": ["X → Y", "Y → Z", "X → Z", "Z → X"],
      "answer": "X → Z",
      "explanation": "Transitive dependency occurs when X → Z via X → Y and Y → Z."
  },
  {
      "question": "Which of the following is a TCL command?",
      "options": ["SELECT", "ALTER", "ROLLBACK", "DELETE"],
      "answer": "ROLLBACK",
      "explanation": "ROLLBACK (Transaction Control Language) undoes transactions."
  },
  {
      "question": "In a relation with attributes {A, B, C}, if AB is the primary key, which violates 2NF?",
      "options": ["A → C", "B → C", "AB → C", "C → B"],
      "answer": "B → C",
      "explanation": "2NF prohibits partial dependencies. If B → C, a non-key attribute (C) depends on part of the primary key (B)."
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
  
  