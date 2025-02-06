const quizData = {
  phishing: {
    tutorial:
      'Phishing is a type of cyber attack in which attackers deceive individuals into providing sensitive information...',
    questions: [
      {
        question: 'What is Phishing?',
        options: [
          'A type of malware',
          'A fake website',
          'An attempt to trick you into giving personal info',
          'A strong encryption method',
        ],
        correct: 2,
      },
      {
        question: 'Which of the following is an example of Phishing?',
        options: [
          'An email asking for personal information',
          'A secured login page',
          'A trusted website',
          'A firewall protection',
        ],
        correct: 0,
      },
    ],
  },
  malware: {
    tutorial:
      'Malware is software designed to disrupt, damage, or gain unauthorized access to a computer system.',
    questions: [
      {
        question: 'What is Malware?',
        options: [
          'Harmless software',
          'A type of cyber attack',
          'Software designed to harm or exploit any device',
          'Firewall',
        ],
        correct: 2,
      },
      {
        question: 'Which of these is an example of Malware?',
        options: ['Antivirus', 'Spyware', 'Cloud storage', 'Firewall'],
        correct: 1,
      },
    ],
  },
  // Additional topics (ransomware, cryptography, etc.)
};

// Load tutorial content based on the selected topic
const urlParams = new URLSearchParams(window.location.search);
const topic = urlParams.get('topic');

if (document.getElementById('topic-name')) {
  document.getElementById('topic-name').textContent =
    topic.charAt(0).toUpperCase() + topic.slice(1);
  document.getElementById('tutorial-content').textContent =
    quizData[topic].tutorial;
}

if (document.getElementById('quiz-topic-name')) {
  document.getElementById('quiz-topic-name').textContent =
    topic.charAt(0).toUpperCase() + topic.slice(1);
}

// Populate quiz questions dynamically
if (document.getElementById('quiz-questions')) {
  const quizContainer = document.getElementById('quiz-questions');
  const questions = quizData[topic].questions;

  questions.forEach((q, index) => {
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('quiz-question');
    const questionText = document.createElement('p');
    questionText.textContent = q.question;
    questionDiv.appendChild(questionText);

    const optionsDiv = document.createElement('div');
    optionsDiv.classList.add('quiz-options');

    q.options.forEach((option, i) => {
      const optionButton = document.createElement('button');
      optionButton.textContent = option;
      optionButton.onclick = () => selectAnswer(index, i);
      optionsDiv.appendChild(optionButton);
    });

    questionDiv.appendChild(optionsDiv);
    quizContainer.appendChild(questionDiv);
  });
}

let userAnswers = [];

function selectAnswer(questionIndex, optionIndex) {
  userAnswers[questionIndex] = optionIndex;
}

// document.getElementById('submit-quiz').addEventListener('click', () => {
//     const questions = quizData[topic].questions;
//     let score = 0;

//     questions.forEach((question, index) => {
//         if (userAnswers[index] === question.correct) {
//             score++;
//         }
//     });

//     alert(`You scored ${score} out of ${questions.length}`);
//     updateLeaderboard(score);
// });

let leaderboard = [
  { user: 'User1', score: 85 },
  { user: 'User2', score: 78 },
  { user: 'User3', score: 70 },
];

function updateLeaderboard(score) {
  const leaderboardTable = document.querySelector('.leaderboard-table');
  leaderboard.push({ user: `User${leaderboard.length + 1}`, score });
  leaderboard.sort((a, b) => b.score - a.score);

  leaderboardTable.innerHTML = '';
  leaderboard.forEach((entry) => {
    const row = document.createElement('div');
    row.classList.add('leaderboard-row');
    row.innerHTML = `<span>${entry.user}</span><span>${entry.score} points</span>`;
    leaderboardTable.appendChild(row);
  });
}

// Security Topic page handling
let currentPageNumber = 1;
const totalPages = 4; // Total number of pages

const leftPageArrow = document.querySelector('.security-topic .left-arrow');
const rightPageArrow = document.querySelector('.security-topic .right-arrow');
const container = document.querySelector('.container'); // The container holding all the pages
const pages = document.querySelectorAll('.page');

// Function to update navigation and show the correct page
function updateNavigation() {
  // Update the transform of the container based on the current page
  container.style.transform = `translateX(-${(currentPageNumber - 1) * 100}vw)`;

  // Enable or disable navigation arrows
  if (currentPageNumber === 1) {
    leftPageArrow.classList.add('disabled');
    leftPageArrow.removeAttribute('href'); // Prevent navigation
  } else {
    leftPageArrow.classList.remove('disabled');
    leftPageArrow.href = `#page${currentPageNumber - 1}`;
  }

  if (currentPageNumber === totalPages) {
    rightPageArrow.classList.add('disabled');
    rightPageArrow.removeAttribute('href'); // Prevent navigation
  } else {
    rightPageArrow.classList.remove('disabled');
    rightPageArrow.href = `#page${currentPageNumber + 1}`;
  }
}

// Event listeners for navigation buttons
leftPageArrow.addEventListener('click', (e) => {
  if (currentPageNumber > 1) {
    currentPageNumber--;
    updateNavigation();
  }
  e.preventDefault(); // Prevent anchor default behavior
});

rightPageArrow.addEventListener('click', (e) => {
  if (currentPageNumber < totalPages) {
    currentPageNumber++;
    updateNavigation();
  }
  e.preventDefault(); // Prevent anchor default behavior
});

// Initialize navigation state
updateNavigation();
