const quizData = [
  {
      "question": "What does the 'C' in the CAP theorem stand for?",
      "options": ["Consistency", "Concurrency", "Clustering", "Compaction"],
      "answer": "Consistency",
      "explanation": "CAP theorem states a distributed system can only guarantee two of three properties: Consistency, Availability, and Partition Tolerance."
  },
  {
      "question": "Which NoSQL database type is best suited for social networks?",
      "options": ["Key-Value", "Document", "Column-Family", "Graph"],
      "answer": "Graph",
      "explanation": "Graph databases (e.g., Neo4j) efficiently model relationships between entities, making them ideal for social networks."
  },
  {
      "question": "Which property is NOT associated with key-value databases?",
      "options": ["High scalability", "Schema flexibility", "Complex joins", "Low latency"],
      "answer": "Complex joins",
      "explanation": "Key-value stores prioritize speed and simplicity but lack support for complex queries like joins."
  },
  {
      "question": "What is a major weakness of RDBMS in modern applications?",
      "options": ["Fixed schema", "ACID compliance", "Vertical scalability", "Structured querying"],
      "answer": "Vertical scalability",
      "explanation": "RDBMS scales vertically (adding hardware), which is costly and less flexible compared to NoSQL's horizontal scaling."
  },
  {
      "question": "In Redis, which command is used to set a key-value pair?",
      "options": ["SET", "PUT", "INSERT", "CREATE"],
      "answer": "SET",
      "explanation": "Redis uses the `SET` command to store a value associated with a key (e.g., SET user:1 'Alice')."
  },
  {
      "question": "Which NoSQL database type stores data as JSON-like documents?",
      "options": ["Key-Value", "Document", "Column-Family", "Graph"],
      "answer": "Document",
      "explanation": "Document databases (e.g., MongoDB) store semi-structured data like JSON/BSON documents."
  },
  {
      "question": "What does the 'A' in the CAP theorem prioritize?",
      "options": ["Atomicity", "Availability", "Aggregation", "Authentication"],
      "answer": "Availability",
      "explanation": "Availability ensures every request receives a response, even if it's not the latest data."
  },
  {
      "question": "Which is a disadvantage of NoSQL databases?",
      "options": ["Lack of ACID transactions", "Fixed schema", "Poor scalability", "Limited query language"],
      "answer": "Lack of ACID transactions",
      "explanation": "NoSQL systems often sacrifice ACID guarantees (e.g., consistency) for scalability and performance."
  },
  {
      "question": "In a key-value database, how is data uniquely identified?",
      "options": ["By a composite key", "By a primary key", "By a unique value", "By a hash index"],
      "answer": "By a primary key",
      "explanation": "Each entry is identified by a unique key, which acts as the primary identifier for retrieval."
  },
  {
      "question": "Which consistency model is used by most NoSQL systems?",
      "options": ["Strong consistency", "Eventual consistency", "Immediate consistency", "ACID consistency"],
      "answer": "Eventual consistency",
      "explanation": "NoSQL systems often use eventual consistency to ensure high availability and partition tolerance."
  },
  {
      "question": "Which NoSQL type organizes data into columns instead of rows?",
      "options": ["Key-Value", "Document", "Column-Family", "Graph"],
      "answer": "Column-Family",
      "explanation": "Column-family databases (e.g., Cassandra) store data in columns grouped by families for efficient read/write operations."
  },
  {
      "question": "What is the primary use case for Redis?",
      "options": ["Transactional systems", "Real-time analytics", "Caching and session management", "Complex joins"],
      "answer": "Caching and session management",
      "explanation": "Redis, a key-value store, excels in low-latency tasks like caching and session storage due to its in-memory design."
  },
  {
      "question": "Which theorem implies that a distributed database cannot achieve all three of consistency, availability, and partition tolerance simultaneously?",
      "options": ["ACID theorem", "BASE theorem", "CAP theorem", "PACELC theorem"],
      "answer": "CAP theorem",
      "explanation": "CAP theorem states that only two of the three properties can be guaranteed in a distributed system."
  },
  {
      "question": "Which command is used to delete a key in Redis?",
      "options": ["DEL", "REMOVE", "DELETE", "ERASE"],
      "answer": "DEL",
      "explanation": "The `DEL` command removes a key and its associated value in Redis (e.g., DEL user:1)."
  },
  {
      "question": "What does BASE stand for in NoSQL systems?",
      "options": ["Basic Availability, Soft state, Eventual consistency", "Basically Available, Soft state, Eventual consistency", "Basic Atomicity, Scalability, Efficiency", "Backup, Availability, Scalability, Efficiency"],
      "answer": "Basically Available, Soft state, Eventual consistency",
      "explanation": "BASE (Basically Available, Soft state, Eventual consistency) is a model used by NoSQL systems to prioritize flexibility over strict consistency."
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
  