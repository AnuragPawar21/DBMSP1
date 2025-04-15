const quizData = [
  {
      "question": "Which data structure is most space-efficient for sparse graphs?",
      "options": ["Adjacency Matrix", "Edge List", "Adjacency List", "Incidence Matrix"],
      "answer": "Adjacency List",
      "explanation": "Adjacency lists use space proportional to the number of edges, making them efficient for sparse graphs."
  },
  {
      "question": "In Neo4j, which Cypher clause is used to create a relationship between two nodes?",
      "options": ["CREATE", "MATCH", "MERGE", "RELATE"],
      "answer": "CREATE",
      "explanation": "The `CREATE` clause creates nodes/relationships (e.g., CREATE (a)-[:FRIEND]->(b))."
  },
  {
      "question": "Which graph traversal algorithm is optimal for finding the shortest path in unweighted graphs?",
      "options": ["Depth-First Search (DFS)", "Breadth-First Search (BFS)", "Dijkstra's Algorithm", "A* Algorithm"],
      "answer": "Breadth-First Search (BFS)",
      "explanation": "BFS explores nodes level-by-level, ensuring the shortest path in unweighted graphs."
  },
  {
      "question": "What is a key property of the graph data model?",
      "options": ["Fixed schema", "Tabular structure", "Explicit relationships with properties", "Normalized data"],
      "answer": "Explicit relationships with properties",
      "explanation": "Graph models represent relationships as first-class entities, often with attributes."
  },
  {
      "question": "Which Neo4j command deletes a node and its connected relationships?",
      "options": ["DELETE", "REMOVE", "DETACH DELETE", "DROP"],
      "answer": "DETACH DELETE",
      "explanation": "`DETACH DELETE` removes a node and its relationships to avoid orphaned edges."
  },
  {
      "question": "PostgreSQL is classified as:",
      "options": ["A NoSQL database", "A key-value store", "An object-relational database", "A columnar database"],
      "answer": "An object-relational database",
      "explanation": "PostgreSQL extends relational models with object-oriented features like inheritance and custom types."
  },
  {
      "question": "In an adjacency matrix for a graph with N nodes, the space complexity is:",
      "options": ["O(N)", "O(N log N)", "O(N²)", "O(E)"],
      "answer": "O(N²)",
      "explanation": "An adjacency matrix uses an N×N grid, requiring quadratic space."
  },
  {
      "question": "Which query language is used in Neo4j?",
      "options": ["Cypher", "Gremlin", "SPARQL", "SQL"],
      "answer": "Cypher",
      "explanation": "Neo4j uses Cypher, a declarative language optimized for graph patterns."
  },
  {
      "question": "What does ACID compliance ensure in database systems like PostgreSQL?",
      "options": ["High read throughput", "Eventual consistency", "Transaction reliability", "Horizontal scaling"],
      "answer": "Transaction reliability",
      "explanation": "ACID (Atomicity, Consistency, Isolation, Durability) guarantees reliable transactions."
  },
  {
      "question": "Which graph problem is solved by Dijkstra's algorithm?",
      "options": ["Cycle detection", "Shortest path in weighted graphs", "Maximum flow", "Graph coloring"],
      "answer": "Shortest path in weighted graphs",
      "explanation": "Dijkstra's algorithm finds the shortest path in weighted graphs with non-negative edges."
  },
  {
      "question": "In PostgreSQL, which feature supports JSON data storage?",
      "options": ["PL/pgSQL", "JSONB", "Foreign Data Wrappers", "Table partitioning"],
      "answer": "JSONB",
      "explanation": "JSONB is a binary JSON format enabling efficient storage and querying of JSON data."
  },
  {
      "question": "Which is a limitation of adjacency matrices?",
      "options": ["Inefficient for edge additions", "Poor for dense graphs", "No support for weighted edges", "High memory for large graphs"],
      "answer": "High memory for large graphs",
      "explanation": "Adjacency matrices consume O(N²) space, becoming impractical for large graphs."
  },
  {
      "question": "Which Neo4j operation retrieves nodes matching a pattern?",
      "options": ["GET", "FETCH", "MATCH", "FIND"],
      "answer": "MATCH",
      "explanation": "The `MATCH` clause retrieves nodes/relationships (e.g., MATCH (a:Person {name: 'Alice'}))."
  },
  {
      "question": "PostgreSQL's 'MVCC' feature is used for:",
      "options": ["Data compression", "Concurrency control", "Replication", "Indexing"],
      "answer": "Concurrency control",
      "explanation": "Multi-Version Concurrency Control (MVCC) allows concurrent reads/writes without locking."
  },
  {
      "question": "Which algorithm detects cycles in a directed graph?",
      "options": ["Kruskal's algorithm", "Topological sorting", "Prim's algorithm", "Bellman-Ford algorithm"],
      "answer": "Topological sorting",
      "explanation": "Topological sorting identifies cycles by checking if a linear order of nodes is possible."
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
  