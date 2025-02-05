let levels = [
  {
    code: [
      '1.  import java.io.*;',
      '2.  import javax.servlet.*;',
      '3.  import javax.servlet.http.*;',
      '4.  public class WebApp extends HttpServlet {',
      '5.      protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {',
      '6.          String userInput = request.getParameter("input");',
      '7.          PrintWriter out = response.getWriter();',
      '8.          out.println("<html><body>");',
      '9.          out.println("User input: " + userInput); // XSS Vulnerability',
      '10.         out.println("</body></html>");',
      '11.     }',
      '12. }',
    ],
    correctLine: 9,
    options: [
      { text: 'Escape user input before output', correct: true },
      { text: 'Use POST instead of GET', correct: false },
      { text: 'Disable JavaScript in the browser', correct: false },
    ],
    explanation:
      "The vulnerability exists because user input is directly inserted into the HTML response without any sanitization. This allows attackers to inject malicious JavaScript code that will be executed in users' browsers.",
    correctedCode: [
      '9.          out.println("User input: " + escapeHtml(userInput)); // Fixed with proper HTML escaping',
    ],
  },
];

let currentLevel = 0;
let score = 0;
let timeLeft = 30;
let timerInterval;

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 30;
  document.getElementById('timer').textContent = timeLeft;
  updateProgress();

  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      document.getElementById('timer').textContent = timeLeft;
      updateProgress();
    } else {
      clearInterval(timerInterval);
      alert("Time's up! Try again.");
      location.reload();
    }
  }, 1000);
}

function updateProgress() {
  const progress = (timeLeft / 30) * 100;
  document.getElementById('progress').style.width = `${progress}%`;
}

function loadLevel() {
  startTimer();
  document.getElementById('explanation').style.display = 'none';
  let codeSnippet = document.getElementById('codeSnippet');
  codeSnippet.innerHTML = '';

  levels[currentLevel].code.forEach((line, index) => {
    let lineElement = document.createElement('div');
    lineElement.textContent = line;
    lineElement.dataset.line = index + 1;
    lineElement.onclick = () => checkLine(index + 1);
    codeSnippet.appendChild(lineElement);
  });

  document.getElementById('feedback').textContent = '';
  document.getElementById('options').style.display = 'none';
}

function checkLine(selectedLine) {
  let level = levels[currentLevel];
  if (selectedLine === level.correctLine) {
    document.getElementById('feedback').innerHTML =
      '<i class="fas fa-check-circle"></i> Correct! Now choose the fix.';
    document.getElementById('feedback').className = 'correct';
    document.getElementById('options').style.display = 'flex';
    showOptions(level);
  } else {
    document.getElementById('feedback').innerHTML =
      '<i class="fas fa-times-circle"></i> Incorrect. Try again!';
    document.getElementById('feedback').className = 'incorrect';
  }
}

function showOptions(level) {
  let optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = '';
  level.options.forEach((option) => {
    let button = document.createElement('button');
    button.innerHTML = `<i class="fas fa-code-branch"></i> ${option.text}`;
    button.onclick = () => selectOption(option, level);
    optionsDiv.appendChild(button);
  });
}

function selectOption(option, level) {
  if (option.correct) {
    score += 10;
    document.getElementById('score').textContent = score;
    document.getElementById('explanation').style.display = 'block';
    document.getElementById('explanationText').textContent = level.explanation;
    document.getElementById('correctedCode').textContent =
      level.correctedCode.join('\n');

    setTimeout(() => {
      if (currentLevel < levels.length - 1) {
        currentLevel++;
        loadLevel();
      } else {
        alert("🎉 Congratulations! You've completed all levels!");
        location.reload();
      }
    }, 5000);
  } else {
    document.getElementById('feedback').innerHTML =
      '<i class="fas fa-times-circle"></i> Incorrect fix. Try another option!';
    document.getElementById('feedback').className = 'incorrect';
  }
}

loadLevel();
