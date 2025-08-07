// BACKEND URL 
const BASE_URL = 'http://localhost:5000/api';

const { jsPDF } = window.jspdf || {};


function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

let timer;
let timeRemaining = 0;

function startTimer() {
  const timeDisplay = document.getElementById('timeDisplay');
  if (!timeDisplay) return;

  timer = setInterval(() => {
    if (timeRemaining <= 0) {
      clearInterval(timer);
      alert('⏰ Time is up! Submitting your test.');     
      document.getElementById('submitBtn').click(); // Calls the same function user would click
      return;
    }

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
    timeRemaining--;
  }, 1000);
}

/* ------------------ Register ------------------ */
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    //alert(' Registered successfully!');
    showToast('Registered successfully!', 'success');
    setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 2000);
  } else {
    //alert(data.msg || 'Registration failed');
    showToast(data.msg || 'Registration failed', 'error');
  }
});

/* ------------------ Login ------------------ */
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    //alert(' Logged in successfully!');
    showToast('Logged in successfully!', 'success');
const urlParams = new URLSearchParams(window.location.search);
const redirectPage = urlParams.get('redirect');
const redirectTestID = urlParams.get('testID');

setTimeout(() => {
  if (redirectPage) {
    window.location.href = `${redirectPage}?testID=${redirectTestID || ''}`;
  } else {
    window.location.href = 'dashboard.html';
  }
}, 2000);

  } else {
    //alert(data.msg || 'Login failed');
    showToast(data.msg || 'Login failed', 'error');
  }
});

/* ------------------ Auth Redirect ------------------ */
window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');

  if (window.location.pathname.includes('dashboard.html') && !token) {
    //alert('You must be logged in to access the dashboard.');
    showToast('You must be logged in to access the dashboard.', 'success');
    window.location.href = 'login.html';
  }
});

/* ------------------ Logout ------------------ */
function logoutUser() {
  localStorage.clear();
  showToast('Logged out successfully!', 'success');

  setTimeout(() => {
    window.location.href = 'login.html';
  }, 2000); 
}


/* ------------------ Dynamic Quiz Creator ------------------ */
let questionIndex = 0;

document.getElementById('addQuestion')?.addEventListener('click', () => {
  const container = document.getElementById('questionsContainer');
  const div = document.createElement('div');
  div.classList.add('question-card');

  div.innerHTML = `
    <div class="question-header">
      <h3>Question ${questionIndex + 1}</h3>
      <button type="button" class="delete-question-btn">×</button>
    </div>

    <input type="text" placeholder="Question Text" class="q-text" required />

    <select class="q-type">
      <option value="MCQ">Multiple Choice</option>
      <option value="TRUE_FALSE">True / False</option>
      <option value="BLANK">Blank Type</option>
    </select>

    <div class="options">
      <input type="text" class="option" placeholder="Option 1" required />
      <button type="button" class="remove-option-btn">×</button>
      <input type="text" class="option" placeholder="Option 2" required />
      <button type="button" class="remove-option-btn">×</button>
    </div>

    <button type="button" class="addOptionBtn">+ Add Option</button>
    <input type="text" class="correct-answer" placeholder="Correct Answer" required />

    <input type="text" class="hint" placeholder="Hint (optional)" value="No hint provided" />

    <label>Upload Image: <input type="file" class="q-image" accept="image/*" /></label>
    <img class="image-preview" style="max-width: 100px; display: none;" />

    <hr />
  `;

  container.appendChild(div);

  // Auto-fill TRUE/FALSE
  div.querySelector('.q-type').addEventListener('change', (e) => {
    const type = e.target.value;
    const optionsContainer = div.querySelector('.options');
    optionsContainer.innerHTML = '';

    if (type === 'TRUE_FALSE') {
      ['True', 'False'].forEach((val) => {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'option';
        input.value = val;
        input.readOnly = true;
        optionsContainer.appendChild(input);
      });
      div.querySelector('.addOptionBtn').style.display = 'none';
    } else if (type === 'BLANK') {
      optionsContainer.innerHTML = '<em>No options required for blank type.</em>';
      div.querySelector('.addOptionBtn').style.display = 'none';
    } else {
      optionsContainer.innerHTML = '';
      addOptionField(optionsContainer);
      addOptionField(optionsContainer);
      div.querySelector('.addOptionBtn').style.display = 'inline-block';
    }
  });

  // Add Option logic
  div.querySelector('.addOptionBtn').addEventListener('click', () => {
    const optionsContainer = div.querySelector('.options');
    addOptionField(optionsContainer);
  });

  // Delete Question logic
  div.querySelector('.delete-question-btn').addEventListener('click', () => {
    div.remove();
  });

  // Image preview logic
  div.querySelector('.q-image').addEventListener('change', (e) => {
    const file = e.target.files[0];
    const preview = div.querySelector('.image-preview');
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        preview.src = reader.result;
        preview.style.display = 'block';
        preview.dataset.base64 = reader.result;
      };
      reader.readAsDataURL(file);
    }
  });

  questionIndex++;
});

function addOptionField(container) {
  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.alignItems = 'center';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'option';
  input.placeholder = `Option ${container.querySelectorAll('.option').length + 1}`;
  input.required = true;

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.textContent = '❌';
  removeBtn.className = 'remove-option-btn';
  removeBtn.style.marginLeft = '5px';
  removeBtn.onclick = () => wrapper.remove();

  wrapper.appendChild(input);
  wrapper.appendChild(removeBtn);
  container.appendChild(wrapper);
}

/* ------------------ Submit Quiz ------------------ */
document.getElementById('quizForm')?.addEventListener('submit', async (e) => {
  
  e.preventDefault();
  const testName = document.getElementById('testName').value;
  const maxAttempts = parseInt(document.getElementById('maxAttempts').value);
  const timeLimit = parseInt(document.getElementById('timeLimit').value);
  const questionsDOM = document.querySelectorAll('.question-card');
const questions = [];

questionsDOM.forEach((card) => {
  const questionText = card.querySelector('.q-text')?.value;
  const type = card.querySelector('.q-type')?.value;
  const correctAnswer = card.querySelector('.correct-answer')?.value;
  const hint = card.querySelector('.hint')?.value || 'No hint provided';
  const image = card.querySelector('.image-preview')?.dataset.base64 || '';

  const options = type === 'BLANK' ? [] : Array.from(card.querySelectorAll('.option')).map(i => i.value);

  questions.push({ questionText, type, options, correctAnswer, hint, image });
});

  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/quiz/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ testName, maxAttempts, questions }),
    body: JSON.stringify({ testName, maxAttempts, timeLimit, questions }),
    

  });

  const data = await res.json();
  if (res.ok) {
    const shareableLink = `http://localhost:3000/pages/writeTest.html?testID=${data.testID}`;
document.getElementById('testIdDisplay').innerHTML = `
  ✔ Test Created!<br>
  <strong>Test ID:</strong> ${data.testID}<br>
  <strong>Shareable Link:</strong> <a href="${shareableLink}" target="_blank">${shareableLink}</a>
`;
showToast('Quiz created successfully!', 'success');

  } else {
    showToast(data.msg || '❌ Quiz creation failed', 'error');
  }
});

/* ------------------ Write Test Logic ------------------ */
let quizData = [];
let currentQuestionIndex = 0;
let userAnswers = [];

async function loadTestByID(testID) {
  const token = localStorage.getItem('token');

  // 1. Check attempt count first
  const attemptRes = await fetch(`${BASE_URL}/quiz/attempts/${testID}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const attemptData = await attemptRes.json();

  if (!attemptRes.ok) {
    alert(attemptData.msg || 'Failed to check attempts');
    return;
  }

  if (attemptData.attempts >= attemptData.maxAttempts) {
    //alert(`❌ You have reached the max attempt limit (${attemptData.maxAttempts}) for this test.`);
    showToast(`❌ Maximum Attempts (${attemptData.maxAttempts}) Reached`, 'error');
    return;
  }

  // 2. Now load the quiz
  const quizRes = await fetch(`${BASE_URL}/quiz/${testID}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const quiz = await quizRes.json();

  quizData = quiz;
console.log("✔ Quiz Data Loaded:", quizData); 

if (!quizRes.ok) {
  const quiz = await quizRes.json();
  showToast(quiz.msg || 'Quiz not found', 'error');
  return;
}

  quizData = quiz;
  userAnswers = new Array(quizData.questions.length).fill(null);
  currentQuestionIndex = 0;

  timeRemaining = quizData.timeLimit * 60;
  startTimer();

  document.getElementById('quizContainer').style.display = 'block';
  document.getElementById('testIdInputContainer').style.display = 'none';
  showQuestion();
}

document.getElementById('startTestBtn')?.addEventListener('click', () => {
  const testID = document.getElementById('testIDInput').value.trim();
  if (!testID) return alert('Please enter Test ID');
  loadTestByID(testID);
});

window.addEventListener('DOMContentLoaded', () => {
  const testIDFromURL = getQueryParam('testID');
  if (testIDFromURL) {
    document.getElementById('testIDInput').value = testIDFromURL;
    loadTestByID(testIDFromURL);
  }
});

function showQuestion() {
  const q = quizData.questions[currentQuestionIndex];
  const container = document.getElementById('questionBox');
    if (!q) {
    container.innerHTML = '<p>Question not found.</p>';
    return;
  }

  let optionsHtml = '';

  if (q.type === 'BLANK') {
    const existingValue = userAnswers[currentQuestionIndex] || '';
    optionsHtml = `<input type="text" placeholder="Type your answer..." class="blank-input" value="${existingValue}" />`;
  } else {
    optionsHtml = q.options.map((opt) => {
      const isChecked = userAnswers[currentQuestionIndex] === opt ? 'checked' : '';
      return `
        <label>
          <input type="radio" name="option" value="${opt}" ${isChecked} />
          ${opt}
        </label><br>
      `;
    }).join('');
  }

  container.innerHTML = `
  <div class="question-wrapper">
    <div class="hint-toggle-container">
      <button class="hint-toggle-btn">💡 Show Hint</button>
      <p class="hint-block" style="display: none;">${q.hint || 'No hint provided'}</p>
    </div>

    <h3 style="margin-bottom: 10px;">${q.questionText}</h3>

    ${q.image ? `<img src="${q.image}" alt="Question Image" class="question-image" />` : ''}

    ${optionsHtml}
  </div>
`;

container.querySelector('.hint-toggle-btn')?.addEventListener('click', (e) => {
  const hint = container.querySelector('.hint-block');
  const btn = e.target;

  if (hint.style.display === 'none') {
    hint.style.display = 'block';
    btn.textContent = '💡 Hide Hint';
  } else {
    hint.style.display = 'none';
    btn.textContent = '💡 Show Hint';
  }
});
document.getElementById('nextBtn')?.addEventListener('click', () => {
  if (currentQuestionIndex < quizData.questions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  }
});

document.getElementById('prevBtn')?.addEventListener('click', () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion();  
  }
});

  document.getElementById('prevBtn').style.display =
    currentQuestionIndex > 0 ? 'inline-block' : 'none';

  document.getElementById('nextBtn').style.display =
    currentQuestionIndex < quizData.questions.length - 1 ? 'inline-block' : 'none';

  document.getElementById('submitBtn').style.display =
    currentQuestionIndex === quizData.questions.length - 1 ? 'inline-block' : 'none';

  if (q.type === 'BLANK') {
    container.querySelector('.blank-input').addEventListener('input', (e) => {
      userAnswers[currentQuestionIndex] = e.target.value.trim();
    });
  } else {
    container.querySelectorAll('input[name="option"]').forEach((el) =>
      el.addEventListener('change', () => {
        userAnswers[currentQuestionIndex] = el.value;
      })
    );
  }
}


document.getElementById('submitBtn')?.addEventListener('click', async () => {
  clearInterval(timer); 

  let score = 0;
  const total = quizData.questions.length;

  quizData.questions.forEach((q, i) => {
    if (userAnswers[i] === q.correctAnswer) score++;
  });

  document.getElementById('scoreDisplay').innerText = `✔ You scored ${score} out of ${total}`;
  showToast('Test Submitted successfully!', 'success');

  const token = localStorage.getItem('token');
  await fetch(`${BASE_URL}/result/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      score,
      total,
      testID: quizData.testID,
      userAnswers,
    }),
  });
const data = await res.json();

if (!res.ok) {
  showToast(data.msg || '× Submission failed.', 'error');
  return;
}

showToast('✔ Test submitted successfully!', 'success');


});

/* ------------------ Dashboard: Load Results ------------------ */
async function loadResults() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/result/myresults`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const results = await res.json();
  const container = customContainer || document.getElementById('resultContainer');

  if (!results.length) {
    container.innerHTML = '<p>No test results found.</p>';
    return;
  }

  let html = `
    <table>
      <tr><th>Test Name</th><th>Test ID</th><th>Score</th><th>Email</th><th>Date</th><th>Download</th></tr>
  `;
  results.forEach(r => {
    html += `
      <tr>
        <td>${r.testName}</td>
        <td>${r.testID}</td>
        <td>${r.score} / ${r.total}</td>
        <td>${r.email}</td>
        <td>${new Date(r.attemptDate).toLocaleString()}</td>
        <td>
  <button onclick='downloadPDF(this)' data-result='${encodeURIComponent(JSON.stringify(r))}'>
    📄 Download
  </button>
</td>
      </tr>
    `;
  });
  html += '</table>';
  container.innerHTML = html;
}

async function loadResults() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/result/myresults`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const results = await res.json();
  const container = document.getElementById('resultContainer');
  const backBtn = document.getElementById('backToDashboardBtn');

  document.querySelectorAll('.nav-buttons .btn').forEach(btn => btn.style.display = 'none');
  backBtn.style.display = 'inline-block';

  if (!results.length) {
    container.innerHTML = '<p>No test results found.</p>';
    return;
  }

  let html = `
    <table>
      <tr><th>Test Name</th><th>Test ID</th><th>Score</th><th>Email</th><th>Date</th><th>Download</th></tr>
  `;
  results.forEach(r => {
    html += `
      <tr>
        <td>${r.testName}</td>
        <td>${r.testID}</td>
        <td>${r.score} / ${r.total}</td>
        <td>${r.email}</td>
        <td>${new Date(r.attemptDate).toLocaleString()}</td>
        <td>
  <button onclick='downloadPDF(this)' data-result='${encodeURIComponent(JSON.stringify(r))}'>
    📄 Download
  </button>
</td>
      </tr>
    `;
  });
  html += `</table>`;
  container.innerHTML = html;
}
document.getElementById('backToDashboardBtn')?.addEventListener('click', () => {
  document.getElementById('resultContainer').innerHTML = '';
  document.getElementById('backToDashboardBtn').style.display = 'none';
  document.querySelectorAll('.nav-buttons .btn').forEach(btn => btn.style.display = 'inline-block');
});

async function handleGoogleSignIn(response) {
  const idToken = response.credential;

  const res = await fetch(`${BASE_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    //alert(' Logged in with Google!');
    showToast('Logged in with Google!', 'success');

    const urlParams = new URLSearchParams(window.location.search);
    const redirectPage = urlParams.get('redirect');
    const redirectTestID = urlParams.get('testID');

    setTimeout(() => {
      if (redirectPage) {
        window.location.href = `${redirectPage}?testID=${redirectTestID || ''}`;
      } else {
        window.location.href = 'dashboard.html';
      }
    }, 2000);
  } else {
    showToast(data.msg || 'Google Sign-in failed', 'error');
  }
}
async function generateScorePDF({ quizData, userAnswers, score, total }) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const testDate = new Date().toLocaleString();

  doc.setFontSize(16);
  doc.text("Interactive Quiz Scorecard", 20, 20);
  doc.setFontSize(12);
  doc.text(`Test Name: ${quizData.testName}`, 20, 30);
  doc.text(`Test ID: ${quizData.testID}`, 20, 38);
  doc.text(`Date: ${testDate}`, 20, 46);
  doc.text(`Score: ${score} / ${total}`, 20, 54);

  let y = 65;
  quizData.questions.forEach((q, i) => {
    doc.setFont(undefined, 'bold');
    doc.text(`Q${i + 1}: ${q.questionText}`, 20, y);
    y += 6;
    doc.setFont(undefined, 'normal');

    q.options.forEach((opt) => {
      const prefix = (opt === q.correctAnswer) ? "✔" : (opt === userAnswers[i] ? "❌" : "🔘");
      doc.text(`${prefix} ${opt}`, 25, y);
      y += 6;
    });

    y += 4;
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save(`Scorecard_${quizData.testID}.pdf`);
}
async function downloadPDF(btn) {
  const encodedData = btn.getAttribute('data-result');
  const parsed = JSON.parse(decodeURIComponent(encodedData));

  const result = {
    email: parsed.email,
    score: parsed.score,
    total: parsed.total,
    userAnswers: parsed.userAnswers,
    testID: parsed.testID,
    attemptDate: parsed.attemptDate,
  };

  const quizQuestions = parsed.questions || [];
  const testName = parsed.testName || 'Untitled Test';

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const date = new Date(result.attemptDate).toLocaleString();
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Unknown User' };

  // Header
  doc.setFontSize(16);
  doc.text('Full Score Report', 20, 20);

  doc.setFontSize(12);
  doc.text(`Name: ${user.name}`, 20, 30);
  doc.text(`Email: ${result.email}`, 20, 36);
  doc.text(`Test Name: ${testName}`, 20, 44);
  doc.text(`Test ID: ${result.testID}`, 20, 52);
  doc.text(`Date: ${date}`, 20, 60);
  doc.text(`Score: ${result.score} / ${result.total}`, 20, 68);

  let y = 80;

  // Loop over each question
  quizQuestions.forEach((q, i) => {
    const userAnswer = result.userAnswers?.[i] ?? 'Not Answered';
    const correctAnswer = q.correctAnswer ?? 'Not Provided';
    const isCorrect = userAnswer === correctAnswer;

    doc.setFont(undefined, 'bold');
    doc.text(`Q${i + 1}: ${q.questionText || '[No question text]'}`, 20, y);
    y += 6;

    // Render Image (if any)
    if (q.image) {
      try {
        doc.addImage(q.image, 'JPEG', 20, y, 40, 30);
        y += 35;
      } catch (err) {
        doc.text('[Image could not be rendered]', 20, y);
        y += 6;
      }
    }

    // Show Hint (if any)
    if (q.hint && q.hint !== 'No hint provided') {
      doc.setFont(undefined, 'italic');
      doc.text(`Hint: ${q.hint}`, 25, y);
      y += 6;
    }

    // All Options (MCQ / True-False)
    if (Array.isArray(q.options)) {
      q.options.forEach((opt, idx) => {
        const isUser = userAnswer === opt;
        const isCorrectOpt = correctAnswer === opt;

        // Highlight correct and user-selected
        if (isCorrectOpt && isUser) {
          doc.setTextColor(0, 128, 0); // green
          doc.text(`✔ ${opt} (Your Answer, Correct)`, 25, y);
        } else if (isCorrectOpt) {
          doc.setTextColor(0, 0, 255); // blue
          doc.text(`✔ ${opt} (Correct Answer)`, 25, y);
        } else if (isUser) {
          doc.setTextColor(255, 0, 0); // red
          doc.text(`✖ ${opt} (Your Answer)`, 25, y);
        } else {
          doc.setTextColor(0); // default
          doc.text(`• ${opt}`, 25, y);
        }

        y += 6;
      });
      doc.setTextColor(0); // Reset color
    }

    // BLANK Type
    if (q.type === 'blank') {
      doc.setFont(undefined, 'normal');
      doc.text(`Your Answer: ${userAnswer}`, 25, y);
      y += 6;
      doc.text(`Correct Answer: ${correctAnswer}`, 25, y);
      y += 6;

      doc.setTextColor(isCorrect ? 'green' : 'red');
      doc.text(isCorrect ? '✔ Correct' : '× Incorrect', 25, y);
      doc.setTextColor(0);
      y += 10;
    } else {
      y += 6;
    }
    y += 4;

    // Page break
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  // Save file
  doc.save(`Full_Scorecard_${result.testID}.pdf`);
}

function showToast(message, type = 'success', duration = 3000) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">×</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, duration);
}

window.addEventListener('DOMContentLoaded', () => {
  const flipper = document.querySelector('.flipper');
  if (flipper) {
    setTimeout(() => {
      flipper.style.transform = 'rotateY(180deg)';
    }, 3000);
  }
});


function showLoginForm() {
  document.getElementById('formTitle').textContent = "Login to InQuiza";
  document.getElementById('formSide').style.display = 'flex';
}

function showRegisterForm() {
  document.getElementById('formTitle').textContent = "Register for InQuiza";
  document.getElementById('formSide').style.display = 'flex';
}

function flipBack() {
  document.getElementById('formSide').style.display = 'none';
}
window.addEventListener('DOMContentLoaded', () => {
  const flipper = document.querySelector('.flipper');
  if (flipper) {
    setTimeout(() => {
      flipper.style.transform = 'rotateY(180deg)';
    }, 3000);
  }
});

function toggleProfileDropdown() {
  const dropdown = document.getElementById('profileDropdown');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

document.addEventListener('click', (e) => {
  const btn = document.querySelector('.profile-btn');
  const dropdown = document.getElementById('profileDropdown');
  if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.style.display = 'none';
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.name) document.getElementById('userName').textContent = user.name;
  if (user.email) document.getElementById('userEmail').textContent = user.email;
});
