
// 1. API endpoint
const API_URL = "https://jsonplaceholder.typicode.com/posts";

// 2. Select HTML elements
const loadBtn = document.getElementById("load-btn");
const statusMessage = document.getElementById("status");
const notesList = document.getElementById("notes-list");

// 3. Reusable request function
async function request(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    return response;
}

// 4. Display status messages
function showStatus(message, type = "") {
    statusMessage.textContent = message;
    statusMessage.className = type;
}

// 5. Display notes on the page
function displayNotes(notes) {
    notesList.innerHTML = "";

    if (notes.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.textContent = "No notes found.";
        notesList.appendChild(emptyMessage);
        return;
    }

    notes.forEach(note => {
        const li = document.createElement("li");

        const title = document.createElement("h3");
        title.textContent = note.title;

        const body = document.createElement("p");
        body.textContent = note.body;

        li.appendChild(title);
        li.appendChild(body);

        notesList.appendChild(li);
    });
}

// 6. GET request - Load 10 notes
async function loadNotes() {
    loadBtn.disabled = true;
    showStatus("Loading notes...", "loading");

    try {
        const response = await request(`${API_URL}?_limit=10`);
        const notes = await response.json();

        displayNotes(notes);

        if (notes.length === 0) {
            showStatus("No notes found.", "success");
        } else {
            showStatus(`Loaded ${notes.length} notes from the server.`, "success");
        }

    } catch (error) {
        showStatus("Sorry, we could not load notes. Please try again.", "error");
        console.error(error);

    } finally {
        loadBtn.disabled = false;
    }
}

// 7. Listen for button click
loadBtn.addEventListener("click", loadNotes);
