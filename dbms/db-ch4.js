const quizData = [
  {
      "question": "Which characteristic is unique to columnar databases compared to row-based databases?",
      "options": ["Efficient for transactional workloads", "Stores data in columns for analytical queries", "Supports complex joins", "Uses rigid schemas"],
      "answer": "Stores data in columns for analytical queries",
      "explanation": "Columnar databases store data column-wise, optimizing read-heavy analytical queries by accessing only relevant columns."
  },
  {
      "question": "In Apache Cassandra, the primary data model is based on:",
      "options": ["Key-value pairs", "Document storage", "Wide-column/column-family", "Graph structures"],
      "answer": "Wide-column/column-family",
      "explanation": "Cassandra uses a wide-column store model, organizing data into column families for scalability and flexible schema design."
  },
  {
      "question": "In MongoDB, data is stored as:",
      "options": ["Tables with rows and columns", "JSON-like documents", "Key-value pairs", "Columnar structures"],
      "answer": "JSON-like documents",
      "explanation": "MongoDB stores data as BSON (binary JSON) documents, allowing nested structures and schema flexibility."
  },
  {
      "question": "Which CAP theorem properties does Apache Cassandra prioritize?",
      "options": ["Consistency and Partition Tolerance", "Availability and Partition Tolerance", "Consistency and Availability", "None of the above"],
      "answer": "Availability and Partition Tolerance",
      "explanation": "Cassandra is an AP system, prioritizing high availability and partition tolerance with eventual consistency."
  },
  {
      "question": "Which CQL command is used to create a namespace for tables in Cassandra?",
      "options": ["CREATE DATABASE", "CREATE KEYSPACE", "CREATE SCHEMA", "CREATE COLUMNFAMILY"],
      "answer": "CREATE KEYSPACE",
      "explanation": "A keyspace in Cassandra is analogous to a database in SQL, created using `CREATE KEYSPACE`."
  },
  {
      "question": "What is the default primary key field in MongoDB?",
      "options": ["_id", "_key", "id", "primary_key"],
      "answer": "_id",
      "explanation": "MongoDB automatically generates an `_id` field as the primary key if not explicitly defined."
  },
  {
      "question": "Which normalization rule is typically unnecessary in document databases like MongoDB?",
      "options": ["Atomicity of values", "Eliminating redundancy", "Avoiding nested data", "Schema enforcement"],
      "answer": "Eliminating redundancy",
      "explanation": "Document databases allow denormalized data to optimize read performance, reducing the need for joins."
  },
  {
      "question": "Apache Cassandra uses which architecture for fault tolerance?",
      "options": ["Master-slave", "Peer-to-peer ring", "Client-server", "Hierarchical"],
      "answer": "Peer-to-peer ring",
      "explanation": "Cassandra uses a decentralized peer-to-peer ring architecture, ensuring no single point of failure."
  },
  {
      "question": "Which method does MongoDB use for horizontal scaling?",
      "options": ["Replication", "Sharding", "Indexing", "Partitioning"],
      "answer": "Sharding",
      "explanation": "MongoDB scales horizontally via sharding, distributing data across multiple servers using a shard key."
  },
  {
      "question": "Which use case is best suited for Apache Cassandra?",
      "options": ["Banking transactions", "Real-time IoT data storage", "Small-scale blogging platforms", "Complex joins across tables"],
      "answer": "Real-time IoT data storage",
      "explanation": "Cassandra excels in handling high-velocity, time-series, and large-scale distributed data like IoT streams."
  },
  {
      "question": "What query language does MongoDB use?",
      "options": ["CQL", "SQL", "MQL (MongoDB Query Language)", "GraphQL"],
      "answer": "MQL (MongoDB Query Language)",
      "explanation": "MongoDB uses MQL, a JSON-like syntax for CRUD operations (e.g., `db.collection.find({age: 25})`)."
  },
  {
      "question": "Which advantage do columnar databases offer for storage?",
      "options": ["Higher write throughput", "Better data compression", "Support for ACID transactions", "Simpler indexing"],
      "answer": "Better data compression",
      "explanation": "Columnar storage allows efficient compression due to homogeneous data types within columns."
  },
  {
      "question": "Which feature does MongoDB support for transactional operations?",
      "options": ["Multi-document ACID transactions", "Only single-document transactions", "No transaction support", "Eventual consistency only"],
      "answer": "Multi-document ACID transactions",
      "explanation": "MongoDB introduced multi-document ACID transactions in version 4.0 for complex operations."
  },
  {
      "question": "What consistency level in Cassandra ensures data is written to all replicas?",
      "options": ["ONE", "QUORUM", "ALL", "LOCAL_ONE"],
      "answer": "ALL",
      "explanation": "The `ALL` consistency level in Cassandra requires writes to all replicas, ensuring strong consistency."
  },
  {
      "question": "How does MongoDB differ from Cassandra in data modeling?",
      "options": ["MongoDB uses rigid schemas", "Cassandra supports nested documents", "MongoDB is schema-less", "Cassandra uses JSON documents"],
      "answer": "MongoDB is schema-less",
      "explanation": "MongoDB allows dynamic schemas, while Cassandra requires predefined column families with optional flexible columns."
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
  