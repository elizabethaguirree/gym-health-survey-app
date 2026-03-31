# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## 1. PROJECT TITLE
Gym & Health Habits Survey

## 2. OVERVIEW
This project is a web-based survey application designed to collect and analyze user gym and health habits. The survey will gather insights into workout frequency, fitness goals, exercise preferences, and perceived health challenges.

The application will store responses in a Supabase database and provide users with a results page that gives general feedback based on their answers.

## 3. OBJECTIVE
The goal of this project is to:
- Collect structured data on gym and health habits
- Practice building a full-stack application using AI-assisted development
- Store and retrieve data using Supabase
- Deploy a working application using Azure Static Web Apps

## 4. TARGET USERS
- College students
- Young adults interested in fitness
- Individuals with varying levels of gym experience

## 5. SURVEY QUESTIONS
The survey will include 7 questions, ordered from easy to more thoughtful:

### Q1 (Radio Buttons)
How often do you go to the gym?
- Daily
- 3–5 times per week
- 1–2 times per week
- Rarely
- Never

### Q2 (Dropdown)
What is your primary fitness goal?
- Build muscle
- Lose weight
- Improve endurance
- Stay healthy
- Other

### Q3 (Checkboxes)
What types of workouts do you typically do? (Select all that apply)
- Weightlifting
- Cardio
- Classes (yoga, pilates, etc.)
- Sports
- None

### Q4 (Radio Buttons)
How would you rate your overall diet?
- Very healthy
- Somewhat healthy
- Neutral
- Somewhat unhealthy
- Very unhealthy

### Q5 (Checkboxes)
What motivates you to stay active? (Select all that apply)
- Physical appearance
- Mental health
- Social reasons
- Routine/habit
- Athletic performance

### Q6 (Text Input)
What is your biggest challenge when it comes to staying consistent with your health or fitness?

### Q7 (Text Input)
What is one health or fitness goal you are currently working toward?

## 6. FUNCTIONAL REQUIREMENTS
The application must:
- Display all survey questions in a clean, user-friendly format
- Support radio buttons, dropdown menus, checkboxes, and text input fields
- Validate required inputs before submission
- Store all responses in a Supabase database
- Redirect users to a results page after submission
- Display a confirmation message on completion

## 7. RESULTS PAGE REQUIREMENTS
After submitting the survey, users will see:
- A thank you message
- General feedback based on their answers
- Encouragement or suggestions related to consistency, goals, or activity level

## 8. NON-FUNCTIONAL REQUIREMENTS
- Responsive design for desktop and mobile
- Fast load times
- Simple, clean UI
- Secure handling of API keys using environment variables

## 9. TECH STACK
| Technology | Purpose |
|-----------|--------|
| HTML/CSS | Structure and styling |
| JavaScript (Vite) | Frontend logic |
| Supabase | Database and backend |
| Replit | Development environment |
| Azure Static Web Apps | Deployment |

## 10. SUCCESS METRICS
- Survey successfully collects and stores responses
- Application deploys correctly to Azure
- At least 15 users complete the survey
- No major errors during submission or data storage

## 11. FUTURE IMPROVEMENTS
- Add charts or graphs
- Add personalized feedback
- Add a dashboard for aggregated results
- Export survey data
