#  InQuiza - Interactive Quiz 

An interactive full-stack quiz system where:
-  Admins can create custom quizzes with questions, hints, images, and constraints.
-  Users can take quizzes using test IDs or shareable links, view results, and download full PDF scorecards.
-  All results are stored, visible in a dashboard, and restricted by attempt limits.

Live Demo: [https://inquiza.netlify.app](https://inquiza.netlify.app)
---

## Features

### User Authentication
- User registration/login via email + password
- Google Sign-In using OAuth2
- Session maintained via JWT tokens

### Test Creation (Admin Side)
- Create custom tests with:
  - Dynamic number of questions
  - Question types: Multiple Choice (MCQ), True/False, Blank
  - Dynamic options
  - Hints per question
  - Optional image upload
  - Score per question
  - Time limit per test
  - Max number of attempts per user

- Generates a **unique Test ID**
- Shareable link for easy distribution

### Writing Tests (User Side)
- Enter Test ID or visit shared test link
- View one question at a time with:
  - Navigation: **Next/Previous**
  - Display of question image and hint (if provided)
  - Timer countdown (auto-submit on timeout)
  - Support for MCQ, True/False, Blank answers

### Results & Dashboard
- After submission:
  - Score is calculated
  - Answers are saved
  - Result is shown immediately
  - Attempt limits enforced
- Results saved in MongoDB Atlas
- Results shown in dashboard (per user)
- Quiz creator receives a copy of each submission

### PDF Scorecard
- Downloadable from dashboard after submission
- Contains:
  - User info (name, email)
  - Test ID and name
  - Attempt date
  - Score

---

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas
- **Authentication**: JWT, Google OAuth2
- **PDF Generation**: jsPDF + html2canvas
- **File Upload**: Base64 (images embedded)
- **Deployment**: Render / Vercel / Netlify (user choice)

---

## Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/EswarReddyBoyi/interactive-quiz.git
cd interactive-quiz
```

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Setup Environment Variables
Create .env inside backend/:
```bash
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
```

### 4. Run Server
```bash
npm start
```
Server will run on: http://localhost:5000

### 5. Run Frontend
You can open frontend/index.html directly in browser or host it using:
Live Server (VS Code)

Netlify / Vercel for deployment

### Environment Variables Explained
Variable	Description
PORT	Backend server port
MONGODB_URI	MongoDB Atlas connection string
JWT_SECRET	Secret for signing JWT tokens
GOOGLE_CLIENT_ID	Google OAuth2 client ID for Google Sign-In

### Screenshots
<table>
  <tr>
    <th> Home Page</th>
    <th> Home Page</th>
    <th> Dashboard</th>
  </tr>
  <tr>
    <td><img src="frontend/assets/images/indexpages.png" width="270"/> </td>
    <td><img src="frontend/assets/images/indexpage.png" width="270"/> </td>
    <td><img src="frontend/assets/images/dashboard.png" width="270"/></td>
  </tr>
</table>

<table>
  <tr>
    <th> Login Page</th>
    <th> Register Page</th>
    <th> Settings</th>
  </tr>
  <tr>
    <td><img src="frontend/assets/images/login.png" width="270"/></td>
    <td><img src="frontend/assets/images/register.png" width="270"/></td>
    <td><img src="frontend/assets/images/settings.png" width="270"/></td>
  </tr>
</table>

<table>
  <tr>
    <th> Result Page</th>
    <th> Write Test Page</th>
    <th> Create Test Page</th>
  </tr>
  <tr>
    <td><img src="frontend/assets/images/viewresults.png" width="270"/></td>
    <td><img src="frontend/assets/images/writeTest.png" width="270"/></td>
    <td><img src="frontend/assets/images/createTest.png" width="270"/></td>
  </tr>
</table>


### Example Test Flow
Admin logs in → Creates Test → Gets Test ID or shareable link

User logs in → Enters Test ID → Answers questions one-by-one

Timer (if set) counts down

User submits test → Result shown → Saved to DB

Dashboard displays user's past results

PDF download enabled from results page

### Access Control
All actions require login.
Backend endpoints protected with JWT auth.
Test attempt limits enforced per user.
Google Sign-In tokens verified on backend.

### Result Notification to Creator
After test submission:
The result (score + answers) is sent to test creator’s email or logged in backend (based on your email setup).

### Test Question Types
1. Multiple Choice (MCQ)
2. True / False
3. Blank (text input)

Each supports:
Optional hint
Optional image

### Deployment Links
🔸 Frontend (Netlify)
URL: https://inquiza.netlify.app
Deployed using Netlify. This is the main web interface where users can register, log in, take tests, and view their results.

🔸 Backend (Render)
URL: https://iq-backend-ys3b.onrender.com
Hosted on Render. This handles all API requests such as authentication, test creation, submission, and result storage.

### CORS Configuration
To ensure the frontend and backend communicate securely across domains:
The backend includes proper CORS headers allowing requests from https://inquiza.netlify.app.
Make sure to use the deployed backend URL in all frontend API calls.

📜 License
MIT License
Eswar Reddy Boyi
22BCE8093-Eswar

📞 Contact
Have questions or need help?

📧 Email: eswarboyi7@gmail.com
🌐 GitHub: [https://github.com/EswarReddyBoyi](https://github.com/EswarReddyBoyi)














