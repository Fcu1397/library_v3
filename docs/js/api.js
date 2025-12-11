
// Mock API Layer to simulate network requests
// This acts as a bridge between the frontend and the mock database (db.js)

window.LibraryAPI = {
    // Helper: Simulate network delay (300ms - 800ms)
    _delay: () => new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500)),

    /**
     * Get books with optional filters
     * @param {Object} filters - { query, categoryMain, categorySub, author, publisher, tag }
     * @returns {Promise<Array>}
     */
    async getBooks(filters = {}) {
        await this._delay();
        let books = window.mockDB.books;

        // Simulate Backend Filtering Logic
        if (filters.query) {
            const q = filters.query.toLowerCase();
            books = books.filter(b =>
                b.title.toLowerCase().includes(q) ||
                b.author.toLowerCase().includes(q) ||
                b.isbn.includes(q)
            );
        }
        if (filters.categoryMain) {
            books = books.filter(b => b.categoryMain === filters.categoryMain);
        }
        if (filters.categorySub) {
            books = books.filter(b => b.categorySub === filters.categorySub);
        }
        if (filters.author) {
            books = books.filter(b => b.author === filters.author);
        }
        if (filters.publisher) {
            books = books.filter(b => b.publisher === filters.publisher);
        }
        if (filters.tag) {
            books = books.filter(b => b.tags.includes(filters.tag));
        }

        return JSON.parse(JSON.stringify(books));
    },

    /**
     * Get a single book by ID
     * @param {string} id
     * @returns {Promise<Object>}
     */
    async getBookById(id) {
        await this._delay();
        const book = window.mockDB.books.find(b => b.id === id);
        if (!book) throw new Error('Book not found');
        return JSON.parse(JSON.stringify(book));
    },

    /**
     * Get current logged-in user profile and data
     * @returns {Promise<Object>}
     */
    async getCurrentUser() {
        await this._delay();
        return JSON.parse(JSON.stringify(window.mockDB.currentUser));
    },

    /**
     * Reserve a book
     * @param {string} bookId
     * @returns {Promise<Object>}
     */
    async reserveBook(bookId) {
        await this._delay();
        const { data, save } = window.mockDB;
        
        const book = data.books.find(b => b.id === bookId);
        if (!book) throw new Error('Book not found');

        const isAlreadyReserved = data.currentUser.reservations.some(r => r.bookId === bookId);
        if (isAlreadyReserved) {
            throw new Error('您已經預約過這本書了。');
        }

        data.currentUser.reservations.push({
            bookId: bookId,
            reservationDate: new Date().toISOString().slice(0, 10),
            status: 'waiting',
            queuePosition: Math.floor(Math.random() * 5) + 1
        });

        save();
        return { success: true, message: '預約成功！', bookTitle: book.title };
    },

    /**
     * Cancel a reservation
     * @param {string} bookId
     * @returns {Promise<Object>}
     */
    async cancelReservation(bookId) {
        await this._delay();
        const { data, save } = window.mockDB;

        const index = data.currentUser.reservations.findIndex(r => r.bookId === bookId);
        if (index === -1) {
            throw new Error('找不到該筆預約紀錄。');
        }

        data.currentUser.reservations.splice(index, 1);
        save();

        return { success: true, message: '已取消預約。' };
    },

    /**
     * Borrow a book (holding)
     * @param {string} bookId
     * @param {string} holdingId
     * @returns {Promise<Object>}
     */
    async borrowBook(bookId, holdingId) {
        await this._delay();
        const { data, save } = window.mockDB;

        const book = data.books.find(b => b.id === bookId);
        if (!book) throw new Error('Book not found');

        const holding = book.holdings.find(h => h.id === holdingId);
        if (!holding) throw new Error('Holding not found');

        if (holding.status !== 'available') {
            throw new Error('此書籍目前無法借閱。');
        }

        const today = new Date();
        const dueDate = new Date();
        dueDate.setDate(today.getDate() + 30);

        holding.status = 'loaned';
        holding.dueDate = dueDate.toISOString().slice(0, 10);

        data.currentUser.loans.push({
            bookId: bookId,
            holdingId: holdingId,
            loanDate: today.toISOString().slice(0, 10),
            dueDate: holding.dueDate
        });

        save();
        return { success: true, message: '借閱成功！請於 ' + holding.dueDate + ' 前歸還。' };
    },

    /**
     * Return a book
     * @param {string} holdingId
     * @returns {Promise<Object>}
     */
    async returnBook(holdingId) {
        await this._delay();
        const { data, save } = window.mockDB;

        const loanIndex = data.currentUser.loans.findIndex(l => l.holdingId === holdingId);
        if (loanIndex === -1) throw new Error('找不到借閱紀錄。');
        const loan = data.currentUser.loans[loanIndex];

        const book = data.books.find(b => b.id === loan.bookId);
        if (!book) throw new Error('Book not found');
        const holding = book.holdings.find(h => h.id === holdingId);
        if (!holding) throw new Error('Holding not found');

        holding.status = 'available';
        delete holding.dueDate;

        const today = new Date().toISOString().slice(0, 10);
        data.currentUser.history.unshift({
            bookId: loan.bookId,
            loanDate: loan.loanDate,
            returnDate: today
        });
        data.currentUser.loans.splice(loanIndex, 1);

        save();
        return { success: true, message: '還書成功！' };
    },

    /**
     * Add a book to favorites
     * @param {string} bookId
     * @returns {Promise<Object>}
     */
    async addToFavorites(bookId) {
        await this._delay();
        const { data, save } = window.mockDB;

        const book = data.books.find(b => b.id === bookId);
        if (!book) throw new Error('Book not found');

        if (data.currentUser.favorites.some(f => f.bookId === bookId)) {
            return { success: false, message: '已在收藏清單中' };
        }

        data.currentUser.favorites.push({
            bookId: bookId,
            addedDate: new Date().toISOString().slice(0, 10)
        });

        save();
        return { success: true, message: '已加入收藏！' };
    },

    /**
     * Remove a book from favorites
     * @param {string} bookId
     * @returns {Promise<Object>}
     */
    async removeFromFavorites(bookId) {
        await this._delay();
        const { data, save } = window.mockDB;

        const index = data.currentUser.favorites.findIndex(f => f.bookId === bookId);
        if (index === -1) {
            return { success: false, message: '不在收藏清單中' };
        }

        data.currentUser.favorites.splice(index, 1);

        save();
        return { success: true, message: '已從收藏移除！' };
    },

    /**
     * Get metadata (authors, publishers) for filters
     * @returns {Promise<Object>}
     */
    async getMetadata() {
        await this._delay();
        return {
            authors: window.mockDB.authors,
            publishers: window.mockDB.publishers
        };
    },

    /**
     * Login a user
     * @param {string} username
     * @param {string} password
     * @returns {Promise<Object>}
     */
    async login(username, password) {
        await this._delay();
        const { currentUser } = window.mockDB.data;

        if (username === currentUser.profile.username && password === '1234') {
            const authData = {
                isLoggedIn: true,
                username: currentUser.profile.username,
                name: currentUser.profile.name
            };
            sessionStorage.setItem('library_auth', JSON.stringify(authData));
            return { success: true, message: '登入成功！' };
        } else {
            throw new Error('帳號或密碼錯誤。');
        }
    },

    /**
     * Logout a user
     */
    logout() {
        sessionStorage.removeItem('library_auth');
        window.location.href = 'login.html';
    },

    /**
     * Get authentication status
     * @returns {Object}
     */
    getAuth() {
        const authData = sessionStorage.getItem('library_auth');
        return authData ? JSON.parse(authData) : { isLoggedIn: false };
    },

    /**
     * Get user notifications
     * @returns {Promise<Array>}
     */
    async getNotifications() {
        await this._delay();
        return JSON.parse(JSON.stringify(window.mockDB.currentUser.notifications));
    },

    /**
     * Mark a notification as read
     * @param {string} notificationId
     * @returns {Promise<Object>}
     */
    async markNotificationAsRead(notificationId) {
        await this._delay();
        const { data, save } = window.mockDB;
        const notification = data.currentUser.notifications.find(n => n.id === notificationId);
        
        if (notification) {
            notification.read = true;
            save();
        }
        return { success: true };
    },

    /**
     * Mark all notifications as read
     * @returns {Promise<Object>}
     */
    async markAllNotificationsAsRead() {
        await this._delay();
        const { data, save } = window.mockDB;
        
        data.currentUser.notifications.forEach(n => n.read = true);
        save();
        return { success: true };
    }
};
