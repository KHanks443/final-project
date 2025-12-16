Baseball Training Log

Semester Web Development Project

Overview

This project is a full-stack web application created for a semester web development course. It demonstrates how a frontend website can interact with a backend server and database.

The website allows a user to:

View information on the homepage

Submit a training session through a form

Store session data in a database

Retrieve and display stored data on another page

The project uses HTML, CSS, JavaScript, Express, and SQLite and is served entirely through the backend (no Live Server).

Project Theme

Baseball Training Log

The theme is a training log for baseball players to track workouts, intensity, and goals. This fits the requirement for a general theme and keeps the project cohesive.

Technologies Used

HTML5 (semantic elements)

CSS3 (Flexbox, Grid, responsive design)

JavaScript (DOM manipulation, form validation, fetch API)

Node.js

Express.js

SQLite3

Project Structure
semester-project/
│── server.js
│── package.json
│── training.db
│
└── public/
    │── index.html
    │── add.html
    │── logs.html
    │── styles.css
    │── app.js
    └── images/
        └── glove.jpg

Frontend Features

3 HTML pages (Home, Add Session, View Logs)

Pages are linked together using a navigation bar

Mobile-friendly design with a hamburger menu

Use of semantic HTML elements (header, nav, main, section, article, footer)

Styled using CSS with:

Background colors

Flexbox and Grid

Responsive layout changes

Styled form error messages

Includes:

A table

Lists

One local image and one remote image

External link to an outside website (MLB.com)

Form & JavaScript

Form includes multiple input types:

Text input

Textarea

Checkbox

Radio buttons

Dropdown select

Special inputs (email, date)

JavaScript validates the form before submission

Clear error messages are displayed if inputs are invalid

Uses fetch() to submit form data to the backend

Redirects to the logs page after successful submission

Backend Features

Built using Express

Serves all frontend files (HTML, CSS, JS, images)

Uses SQLite to store submitted training sessions

API includes at least 3 routes:

GET all sessions

GET a single session

POST a new session

Frontend uses:

POST route to submit form data

GET route to retrieve and display stored data
