# QuickNotes – API Client and System Design

## 1. Project Description

QuickNotes is a simple online note-taking application that allows users to create, view and delete notes.

This project demonstrates how a frontend application communicates with a REST API using JavaScript Fetch API.

The frontend uses HTML, CSS and JavaScript, while JSONPlaceholder is used as a practice API for GET, POST and DELETE requests.

The project also includes system design documentation describing how QuickNotes could be developed into a scalable online service supporting up to 1 million registered users.

## 2. Technologies Used

- HTML5 – Application structure.
- CSS3 – Application styling.
- JavaScript – API requests and frontend functionality.
- JSONPlaceholder – Practice REST API.
- PostgreSQL – Proposed production database.
- Redis – Proposed caching system.
- Git and GitHub – Version control and project hosting.

## 3. Project Features

- Load 10 notes from the API.
- Create new notes using POST requests.
- Delete notes using DELETE requests.
- Validate note titles before submission.
- Display loading, success, error and empty states.
- Disable buttons while requests are running.
- Display friendly error messages.
- Responsive and readable interface.

## 4. Project Structure

quicknotes-system-design/
│
├── index.html
├── style.css
├── api.js
├── README.md
│
└── docs/
├── api-design.md
├── data-model.md
└── architecture.md

## 5. How to Run the API Client

1. Clone the repository:

   git clone https://github.com/AKahenya-debug/quicknotes-system-design

2. Open the project folder in Visual Studio Code.

3. Install the Live Server extension if it is not already installed.

4. Right-click index.html.

5. Select Open with Live Server.

6. Click the Load Notes button to retrieve notes from JSONPlaceholder.

7. Use the form to create a new note.

8. Use the Delete button to remove a note from the displayed list.

Note: JSONPlaceholder is a practice API. POST and DELETE requests simulate server operations but do not permanently change the server's stored data.

## 6. System Design Documentation

The following documents describe the proposed production system:

- [API Design](docs/api-design.md) – REST endpoints, HTTP methods, request and response examples, and error handling.

- [Data Model](docs/data-model.md) – Database entities, relationships, SQL statements, queries and indexes.

- [Architecture Design](docs/architecture.md) – System requirements, load estimates, architecture diagram, request flows, scalability and reliability.

## 7. What I Learned

Through this project, I learned:

1. How to use JavaScript Fetch API to communicate with REST APIs using GET, POST and DELETE methods.

2. How to handle asynchronous requests using async/await, try/catch and finally.

3. How to validate user input and display loading, success, error and empty states.

4. How to design relational databases using primary keys, foreign keys and many-to-many relationships.

5. How to write SQL queries involving SELECT, INSERT, JOIN and indexes.

6. How to design scalable system architectures using load balancers, caching, application servers, read replicas and message queues.

7. How to use Git and GitHub for version control and project collaboration.

## 8. Future Improvements

- Implement user registration and authentication.
- Connect the application to a real PostgreSQL backend.
- Add note editing functionality.
- Introduce note searching and filtering.
- Support tags and categories.
- Deploy the application online.

## 9. Author

Developed as part of a software engineering learning project.

---

**Project:** QuickNotes System Design  
**Repository:** quicknotes-system-design
