// Library data
const library = {
    books: {},      // {bookId: {title, author, available}}
    members: {}     // {memberId: {name, borrowed: []}}
};

let currentMemberId = null;

// DOM elements
const authPage = document.getElementById('authPage');
const dashboard = document.getElementById('dashboard');
const memberNameDisplay = document.getElementById('memberNameDisplay');
const bookList = document.getElementById('bookList');
const messageBox = document.getElementById('message');
const borrowSelect = document.getElementById('borrowSelect');
const returnSelect = document.getElementById('returnSelect');

// Utility to show messages
function showMessage(msg, type="success") {
    messageBox.textContent = msg;
    messageBox.className = "message " + type;
    setTimeout(() => { messageBox.textContent = ""; messageBox.className = "message"; }, 3000);
}

// Register a new member
function register() {
    const id = document.getElementById('regMemberId').value.trim();
    const name = document.getElementById('regMemberName').value.trim();

    if(!id || !name) return showMessage("Fill all fields.", "error");
    if(library.members[id]) return showMessage("Member ID already exists!", "error");

    library.members[id] = { name, borrowed: [] };
    showMessage(`Member '${name}' registered successfully.`);
}

// Login existing member
function login() {
    const id = document.getElementById('loginMemberId').value.trim();
    if(!library.members[id]) return showMessage("Member not found!", "error");

    currentMemberId = id;
    memberNameDisplay.textContent = library.members[id].name;
    authPage.style.display = "none";
    dashboard.style.display = "block";
    updateBookList();
}

// Logout
function logout() {
    currentMemberId = null;
    authPage.style.display = "block";
    dashboard.style.display = "none";
}

// Add book (optional: pre-populate some books)
function addBook(bookId, title, author) {
    if(library.books[bookId]) return showMessage("Book ID already exists!", "error");
    library.books[bookId] = { title, author, available: true };
}

// Borrow a book
function borrowBook() {
    const bookId = borrowSelect.value;
    if(!bookId) return showMessage("Select a book to borrow.", "error");
    if(!library.books[bookId].available) return showMessage("Book already borrowed.", "error");

    library.books[bookId].available = false;
    library.members[currentMemberId].borrowed.push(bookId);
    showMessage(`You borrowed '${library.books[bookId].title}'`);
    updateBookList();
}

// Return a book
function returnBook() {
    const bookId = returnSelect.value;
    if(!bookId) return showMessage("Select a book to return.", "error");

    library.books[bookId].available = true;
    library.members[currentMemberId].borrowed = library.members[currentMemberId].borrowed.filter(id => id !== bookId);
    showMessage(`You returned '${library.books[bookId].title}'`);
    updateBookList();
}

// Update book list and dropdowns
function updateBookList() {
    bookList.innerHTML = "";
    borrowSelect.innerHTML = "";
    returnSelect.innerHTML = "";

    for(let id in library.books) {
        const book = library.books[id];
        const status = book.available ? "Available ✅" : "Borrowed ❌";

        const li = document.createElement('li');
        li.textContent = `ID: ${id} | Title: ${book.title} | Author: ${book.author} | ${status}`;
        bookList.appendChild(li);

        if(book.available) {
            const opt = document.createElement('option');
            opt.value = id;
            opt.textContent = `${book.title} (${id})`;
            borrowSelect.appendChild(opt);
        }

        if(!book.available && library.members[currentMemberId].borrowed.includes(id)) {
            const opt = document.createElement('option');
            opt.value = id;
            opt.textContent = `${book.title} (${id})`;
            returnSelect.appendChild(opt);
        }
    }
}

// Download books as TXT
function downloadBooks() {
    if(Object.keys(library.books).length === 0) return showMessage("No books to save!", "error");

    let content = "Library Books:\n\n";
    for(let id in library.books) {
        const book = library.books[id];
        const status = book.available ? "Available" : "Borrowed";
        content += `ID: ${id} | Title: ${book.title} | Author: ${book.author} | Status: ${status}\n`;
    }

    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "library_books.txt";
    link.click();
    showMessage("Books saved to 'library_books.txt'.");
}

// Pre-populate some books (optional)
addBook("B001", "Harry Potter", "J.K. Rowling");
addBook("B002", "The Hobbit", "J.R.R. Tolkien");
addBook("B003", "1984", "George Orwell");


// Add a book from dashboard inputs
function addBookFromDashboard() {
    const id = document.getElementById('newBookId').value.trim();
    const title = document.getElementById('newBookTitle').value.trim();
    const author = document.getElementById('newBookAuthor').value.trim();

    if (!id || !title || !author) return showMessage("Please fill all book fields.", "error");
    if (library.books[id]) return showMessage("Book ID already exists!", "error");

    library.books[id] = { title, author, available: true };
    showMessage(`Book '${title}' added successfully.`);
    
    // Clear inputs
    document.getElementById('newBookId').value = "";
    document.getElementById('newBookTitle').value = "";
    document.getElementById('newBookAuthor').value = "";

    updateBookList();
}
