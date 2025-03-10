const books = [];

function addBook() {
    const genreInput = document.getElementById("genreInput");
    const bookInput = document.getElementById("bookInput");
    const seriesInput = document.getElementById("seriesInput");
    const pageInput = document.getElementById("pageInput");
    const ratingInput = document.getElementById("ratingInput");
    const completedInput = document.getElementById("completedInput");
    
    const genre = genreInput.value;
    const bookTitle = bookInput.value;
    const series = seriesInput.value;
    const pages = pageInput.value;
    const rating = ratingInput.value;
    const completed = completedInput.checked;

    if (bookTitle && pages && rating >= 1 && rating <= 5) {
        fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${bookTitle}`)
            .then(response => response.json())
            .then(data => {
                const cover = data.items && data.items[0] ? data.items[0].volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/100x150';
                const newBook = { 
                    genre: genre || "Unknown",
                    title: bookTitle, 
                    series: series || "", 
                    pages, 
                    rating, 
                    completed, 
                    cover: cover,
                    timestamp: new Date().toLocaleString()
                };

                books.push(newBook);
                genreInput.value = "";
                bookInput.value = "";
                seriesInput.value = "";
                pageInput.value = "";
                ratingInput.value = "";
                completedInput.checked = false;

                renderGenreGroups();
                renderBookGroups();
            })
            .catch(error => {
                alert("Error fetching book data from Google API");
            });
    } else {
        alert("Please enter a book title, page count, and a rating between 1 and 5.");
    }
}

function renderGenreGroups() {
    const genreGroupsContainer = document.getElementById("genreGroups");
    genreGroupsContainer.innerHTML = "";

    const groups = {};

    books.forEach(book => {
        const groupKey = book.genre;
        if (!groups[groupKey]) {
            groups[groupKey] = [];
        }
        groups[groupKey].push(book);
    });

    for (const groupKey in groups) {
        const groupHTML = `
            <div class="genre-group">
                <h3>${groupKey}</h3>
                <div class="books">
                    ${groups[groupKey].map(book => `
                        <div class="book-item" data-title="${book.title}">
                            <img src="${book.cover}" alt="${book.title}" width="100">
                            <div class="book-info">
                                <h4>${book.title}</h4>
                                <p>Rating: ${book.rating} / 5</p>
                                <p><strong>Series:</strong> ${book.series || 'N/A'}</p>
                                <p><strong>Pages:</strong> ${book.pages}</p>
                                <p><strong>Completed:</strong> ${book.completed ? '✔️' : '❌'}</p>
                                <p><strong>Added on:</strong> ${book.timestamp}</p>
                            </div>
                            <button class="remove-btn">Remove</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        genreGroupsContainer.innerHTML += groupHTML;
    }

    // Event delegation for remove buttons
    genreGroupsContainer.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('remove-btn')) {
            const bookTitle = event.target.closest('.book-item').getAttribute('data-title');
            removeBook(bookTitle);
        }
    });
}

function renderBookGroups() {
    const bookGroupsContainer = document.getElementById("bookGroups");
    bookGroupsContainer.innerHTML = "";

    const groups = {};

    books.forEach(book => {
        const groupKey = book.series || 'Standalone';
        if (!groups[groupKey]) {
            groups[groupKey] = [];
        }
        groups[groupKey].push(book);
    });

    for (const groupKey in groups) {
        const groupHTML = `
            <div class="series-group">
                <h3>${groupKey}</h3>
                <div class="books">
                    ${groups[groupKey].map(book => `
                        <div class="book-item" data-title="${book.title}">
                            <img src="${book.cover}" alt="${book.title}" width="100">
                            <div class="book-info">
                                <h4>${book.title}</h4>
                                <p>Rating: ${book.rating} / 5</p>
                                <p><strong>Genre:</strong> ${book.genre}</p>
                                <p><strong>Pages:</strong> ${book.pages}</p>
                                <p><strong>Completed:</strong> ${book.completed ? '✔️' : '❌'}</p>
                                <p><strong>Added on:</strong> ${book.timestamp}</p>
                            </div>
                            <button class="remove-btn">Remove</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        bookGroupsContainer.innerHTML += groupHTML;
    }

    // Event delegation for remove buttons
    bookGroupsContainer.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('remove-btn')) {
            const bookTitle = event.target.closest('.book-item').getAttribute('data-title');
            removeBook(bookTitle);
        }
    });
}

function removeBook(title) {
    const bookIndex = books.findIndex(book => book.title === title);
    if (bookIndex > -1) {
        books.splice(bookIndex, 1);
        renderGenreGroups();
        renderBookGroups();
    }
}
