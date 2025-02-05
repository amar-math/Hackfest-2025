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
  {
    code: [
      '1.  @Controller',
      '2.  public class ProfileController {',
      '3.      @GetMapping("/profile")',
      '4.      public String showProfile(Model model, @RequestParam String userId) {',
      '5.          User user = userService.getUser(userId);',
      '6.          String customJs = user.getCustomJavaScript();',
      '7.          model.addAttribute("user", user);',
      '8.          model.addAttribute("customScript", customJs);',
      '9.          return "profile";',
      '10.     }',
      '11. }',
      '12. <!-- In profile.html -->',
      '13. <div th:utext="${customScript}"></div>',
    ],
    correctLine: 13,
    options: [
      { text: 'Use th:text instead of th:utext', correct: true },
      { text: 'Remove the script tag', correct: false },
      { text: 'Use JavaScript eval()', correct: false },
    ],
    explanation:
      'The th:utext directive in Thymeleaf renders unescaped HTML, allowing any JavaScript in customScript to execute. Using th:text instead would escape the content, preventing XSS attacks.',
    correctedCode: [
      '13. <div th:text="${customScript}"></div> // Fixed by using escaped text output',
    ],
  },
  {
    code: [
      '1.  class CommentWidget extends React.Component {',
      '2.      constructor(props) {',
      '3.          super(props);',
      "4.          this.state = { comment: '' };",
      '5.      }',
      '6.  ',
      '7.      render() {',
      '8.          return (',
      '9.              <div>',
      '10.                 <h3>User Comment:</h3>',
      '11.                 <div dangerouslySetInnerHTML={{__html: this.props.comment}} />',
      '12.             </div>',
      '13.         );',
      '14.     }',
      '15. }',
    ],
    correctLine: 11,
    options: [
      {
        text: 'Replace dangerouslySetInnerHTML with regular text rendering',
        correct: true,
      },
      { text: 'Add CSS sanitization', correct: false },
      { text: 'Use innerHTML directly', correct: false },
    ],
    explanation:
      "Using dangerouslySetInnerHTML in React can lead to XSS vulnerabilities as it bypasses React's automatic HTML escaping. Instead, use regular text rendering or a proper HTML sanitization library if HTML rendering is necessary.",
    correctedCode: [
      '11.                 <div>{this.props.comment}</div> // Fixed by using safe text rendering',
    ],
  },
];

let currentLevel = 0;
let score = 0;
let timeLeft = 30;
let timerInterval;
let timerPaused = false;

function createTryAgainButton() {
  const button = document.createElement('button');
  button.innerHTML = '<i class="fas fa-redo"></i> Try Again';
  button.className = 'try-again-button';
  button.onclick = () => {
    timerPaused = false;
    startTimer();
    button.remove();
    document.getElementById('feedback').textContent = '';
    document.getElementById('options').style.display = 'none';
  };
  document.getElementById('feedbackSection').appendChild(button);
}

function startTimer() {
  clearInterval(timerInterval);
  if (!timerPaused) {
    timeLeft = 30;
  }
  document.getElementById('timer').textContent = timeLeft;
  updateProgress();

  timerInterval = setInterval(() => {
    if (!timerPaused && timeLeft > 0) {
      timeLeft--;
      document.getElementById('timer').textContent = timeLeft;
      updateProgress();
    } else if (!timerPaused && timeLeft === 0) {
      clearInterval(timerInterval);
      timerPaused = true;
      document.getElementById('feedback').innerHTML =
        '<i class="fas fa-clock"></i> Time\'s up!';
      document.getElementById('feedback').className = 'incorrect';
      createTryAgainButton();
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
    scrollToElement('feedbackSection');
  } else {
    clearInterval(timerInterval);
    timerPaused = true;
    document.getElementById('feedback').innerHTML =
      '<i class="fas fa-times-circle"></i> Incorrect. Try again!';
    document.getElementById('feedback').className = 'incorrect';
    createTryAgainButton();
    scrollToElement('feedbackSection');
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

function createConfetti() {
  const overlay = document.getElementById('celebrationOverlay');
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.animationDelay = Math.random() * 2 + 's';
    confetti.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
    overlay.appendChild(confetti);
  }
}

function showCelebration() {
  const overlay = document.getElementById('celebrationOverlay');
  const finalScoreElement = document.getElementById('finalScore');

  overlay.style.display = 'flex';
  finalScoreElement.textContent = score;
  createConfetti();
}

function selectOption(option, level) {
  if (option.correct) {
    score += 10;
    document.getElementById('score').textContent = score;
    document.getElementById('explanation').style.display = 'block';
    document.getElementById('explanationText').textContent = level.explanation;
    document.getElementById('correctedCode').textContent =
      level.correctedCode.join('\n');
    scrollToElement('explanationSection');

    setTimeout(() => {
      if (currentLevel < levels.length - 1) {
        currentLevel++;
        timerPaused = false;
        loadLevel();
        scrollToElement('codeSection');
      } else {
        clearInterval(timerInterval);
        showCelebration();
      }
    }, 5000);
  } else {
    clearInterval(timerInterval);
    timerPaused = true;
    document.getElementById('feedback').innerHTML =
      '<i class="fas fa-times-circle"></i> Incorrect fix. Try another option!';
    document.getElementById('feedback').className = 'incorrect';
    createTryAgainButton();
    scrollToElement('feedbackSection');
  }
}

function scrollToElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    setTimeout(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
}

loadLevel();
