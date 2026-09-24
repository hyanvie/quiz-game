// 1. 题库数据
// 每一题：题干、4个选项、正确答案的下标(0~3)
const quizData = [
  {
    question: "What does HTML stand for?",
    answers: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink and Text Markup Language", "Home Tool Markup Language"],
    correct: 0,
  },
  {
    question: "Which CSS property is used to set the text color of an element?",
    answers: ["font-color", "text-color", "color", "background-color"],
    correct: 2,
  },
  {
    question: "In JavaScript, which keyword lets you reassign a variable but not redeclare it?",
    answers: ["const", "let", "var", "static"],
    correct: 1,
  },
  {
    question: "Which of the following is NOT a JavaScript data type?",
    answers: ["Number", "Boolean", "Character", "Undefined"],
    correct: 2,
  },
  {
    question: "Which CSS value turns an element into a flexible box layout container?",
    answers: ["display: block", "display: flex", "display: grid-row", "display: inline"],
    correct: 1,
  },
  {
    question: "What does document.querySelector() do?",
    answers: ["Creates a new element", "Returns the first element that matches a CSS selector", "Deletes an element", "Changes a stylesheet"],
    correct: 1,
  },
  {
    question: "Which Git command pushes local commits to a remote repository?",
    answers: ["git pull", "git commit", "git push", "git clone"],
    correct: 2,
  },
];

// 2. 获取页面元素
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionEl = document.getElementById("current-question");
const totalQuestionsEl = document.getElementById("total-questions");
const scoreEl = document.getElementById("score");
const progressEl = document.getElementById("progress");

const finalScoreEl = document.getElementById("final-score");
const maxScoreEl = document.getElementById("max-score");
const resultMessageEl = document.getElementById("result-message");

// 3. 状态变量
let currentIndex = 0; // 当前是第几题（从 0 开始）
let score = 0; // 当前得分

// 4. 切换屏幕的通用函数
// 把所有 .screen 的 active 类去掉，只给目标屏幕加上
function showScreen(screen) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  screen.classList.add("active");
}

// 5. 开始测验：重置状态，显示第一题
function startQuiz() {
  currentIndex = 0;
  score = 0;
  totalQuestionsEl.textContent = quizData.length;
  maxScoreEl.textContent = quizData.length;
  scoreEl.textContent = score;
  showScreen(quizScreen);
  renderQuestion();
}

// 6. 渲染当前这道题：题干 + 4个选项按钮 + 进度条
function renderQuestion() {
  const item = quizData[currentIndex];
  questionText.textContent = item.question;
  currentQuestionEl.textContent = currentIndex + 1;

  // 更新进度条宽度（已完成题数 / 总题数）
  progressEl.style.width = `${(currentIndex / quizData.length) * 100}%`;

  // 清空上一题的选项，重新生成这一题的
  answersContainer.innerHTML = "";
  item.answers.forEach((answerText, index) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = answerText;
    btn.dataset.index = index;
    btn.addEventListener("click", () => selectAnswer(index));
    answersContainer.appendChild(btn);
  });
}

// 7. 用户选择答案后的处理
// 高亮正确/错误选项，禁用所有按钮，短暂停留后进入下一题
function selectAnswer(selectedIndex) {
  const item = quizData[currentIndex];
  const buttons = answersContainer.querySelectorAll(".answer-btn");

  // 选完之后禁止再点，同时标出正确答案和用户选错的那个
  buttons.forEach((btn, index) => {
    btn.classList.add("disabled");
    if (index === item.correct) {
      btn.classList.add("correct");
    } else if (index === selectedIndex) {
      btn.classList.add("incorrect");
    }
  });

  if (selectedIndex === item.correct) {
    score++;
    scoreEl.textContent = score;
  }

  // 停顿 800ms 让用户看清对错反馈，再进入下一题或结果页
  setTimeout(() => {
    currentIndex++;
    if (currentIndex < quizData.length) {
      renderQuestion();
    } else {
      showResult();
    }
  }, 800);
}

// 8. 显示结果页
function showResult() {
  progressEl.style.width = "100%";
  finalScoreEl.textContent = score;

  const percentage = score / quizData.length;
  if (percentage === 1) {
    resultMessageEl.textContent = "Perfect score! Amazing!";
  } else if (percentage >= 0.7) {
    resultMessageEl.textContent = "Good Job! Well done!";
  } else if (percentage >= 0.4) {
    resultMessageEl.textContent = "Not bad, a bit more review will help";
  } else {
    resultMessageEl.textContent = "Don't worry, give it another try!";
  }

  showScreen(resultScreen);
}

// 9. 绑定按钮事件
startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", startQuiz);