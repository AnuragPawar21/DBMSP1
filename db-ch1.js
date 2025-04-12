const quizData = [
    {
      question: "What is the main purpose of a Database Management System?",
      options: ["Data processing", "Data storage", "Data manipulation", "Data organization"],
      answer: "Data manipulation",
      explanation: "DBMS provides tools to insert, update, delete, and query data effectively."
    },
    {
      question: "Which key uniquely identifies each record in a table?",
      options: ["Foreign Key", "Candidate Key", "Primary Key", "Alternate Key"],
      answer: "Primary Key",
      explanation: "The Primary Key ensures each row is uniquely identifiable."
    },
    {
      question: "What does SQL stand for?",
      options: ["Structured Question Language", "Structured Query Language", "Sequential Query Logic", "Simple Query Language"],
      answer: "Structured Query Language",
      explanation: "SQL is used to manage and manipulate relational databases."
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
  
    const audio = new Audio(selected === correct ? "correct.mp3" : "wrong.mp3");
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
  
  function showCountdown() {
    document.getElementById("quiz-box").innerHTML = `
      <div class="countdown-screen">
        <h2>Quiz will start in</h2>
        <div id="countdown-circle">
          <svg width="120" height="120">
            <circle r="50" cx="60" cy="60" stroke="#eee" />
            <circle id="progress-ring" r="50" cx="60" cy="60" stroke-dasharray="314" stroke-dashoffset="0" />
          </svg>
          <div id="countdown-text">5</div>
        </div>
      </div>
    `;
  
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
  }
  