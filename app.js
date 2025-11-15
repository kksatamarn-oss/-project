// API Base URL
const API_BASE_URL = 'http://localhost:8080/api';

// Token storage
let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
let currentUserRole = localStorage.getItem('userRole') || 'USER';
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    if (authToken) {
        updateUserInfo();
        // Hide login/register tabs if logged in
        document.querySelectorAll('.tab-btn').forEach(btn => {
            if (btn.textContent.includes('เข้าสู่ระบบ') || btn.textContent.includes('สมัครสมาชิก')) {
                btn.style.display = 'none';
            }
        });
        // Show admin tab if admin
        if (currentUserRole === 'ADMIN') {
            const adminTab = document.getElementById('admin-tab-btn');
            if (adminTab) adminTab.style.display = 'flex';
        }
    } else {
        // Hide books/borrowings tabs if not logged in
        document.getElementById('books-tab-btn').style.display = 'none';
        document.getElementById('borrowings-tab-btn').style.display = 'none';
        document.getElementById('admin-tab-btn').style.display = 'none';
    }
    
    // Form handlers
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    
    // Search input enter key
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchBooks();
        }
    });
    
    // Load books on page load if logged in
    if (authToken) {
        loadBooks();
        loadBorrowings();
    }
});

// Tab switching
function showTab(tabName, buttonElement) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const tabElement = document.getElementById(tabName + '-tab');
    if (tabElement) {
        tabElement.classList.add('active');
    }
    
    if (buttonElement) {
        buttonElement.classList.add('active');
    } else {
        // Find button by tab name
        const btn = Array.from(document.querySelectorAll('.tab-btn')).find(btn => 
            btn.textContent.includes(getTabName(tabName))
        );
        if (btn) btn.classList.add('active');
    }
    
    // Load data if needed
    if (tabName === 'books' && authToken) {
        loadBooks();
    } else if (tabName === 'borrowings' && authToken) {
        loadBorrowings();
    } else if (tabName === 'admin' && authToken && currentUserRole === 'ADMIN') {
        loadAdminDashboard();
    }
}

function getTabName(tabName) {
    const names = {
        'login': 'เข้าสู่ระบบ',
        'register': 'สมัครสมาชิก',
        'books': 'ค้นหาหนังสือ',
        'borrowings': 'การยืมของฉัน'
    };
    return names[tabName] || '';
}

// Show/Hide Loading
function showLoading(show = true) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.toggle('active', show);
    }
}

function showButtonLoading(buttonId, show = true) {
    const btn = document.getElementById(buttonId);
    if (btn) {
        const btnText = btn.querySelector('.btn-text');
        const btnLoader = btn.querySelector('.btn-loader');
        if (btnText && btnLoader) {
            btnText.style.display = show ? 'none' : 'inline';
            btnLoader.style.display = show ? 'inline-block' : 'none';
            btn.disabled = show;
        }
    }
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Login
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!username || !password) {
        showMessage('login-message', 'กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
        return;
    }
    
    showButtonLoading('login-btn', true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.token) {
            authToken = data.token;
            currentUser = { username: data.username || username };
            currentUserRole = data.role || 'USER';
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            localStorage.setItem('userRole', currentUserRole);
            
            showMessage('login-message', 'เข้าสู่ระบบสำเร็จ!', 'success');
            showToast('เข้าสู่ระบบสำเร็จ!', 'success');
            updateUserInfo();
            
            // Show books/borrowings tabs, hide login/register
            document.getElementById('books-tab-btn').style.display = 'flex';
            document.getElementById('borrowings-tab-btn').style.display = 'flex';
            document.querySelectorAll('.tab-btn').forEach(btn => {
                if (btn.textContent.includes('เข้าสู่ระบบ') || btn.textContent.includes('สมัครสมาชิก')) {
                    btn.style.display = 'none';
                }
            });
            
            // Show admin tab if admin
            if (currentUserRole === 'ADMIN') {
                const adminTab = document.getElementById('admin-tab-btn');
                if (adminTab) adminTab.style.display = 'flex';
            }
            
            setTimeout(() => {
                showTab('books', document.getElementById('books-tab-btn'));
                loadBooks();
            }, 1000);
        } else {
            showMessage('login-message', data.message || 'เข้าสู่ระบบไม่สำเร็จ', 'error');
            showToast(data.message || 'เข้าสู่ระบบไม่สำเร็จ', 'error');
        }
    } catch (error) {
        let errorMsg = 'เกิดข้อผิดพลาด: ' + error.message;
        
        if (error.message.includes('fetch') || error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMsg = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้\n\nกรุณาตรวจสอบว่า:\n1. Backend Services รันอยู่ (ใช้ start-services.bat หรือ start-services.sh)\n2. API Gateway รันที่ http://localhost:8080\n3. เปิด check-services.html เพื่อตรวจสอบสถานะ Services';
        }
        
        showMessage('login-message', errorMsg, 'error');
        showToast('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้', 'error');
    } finally {
        showButtonLoading('login-btn', false);
    }
}

// Register
async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    
    if (!username || !email || !password) {
        showMessage('register-message', 'กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('register-message', 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร', 'error');
        return;
    }
    
    if (!email.includes('@')) {
        showMessage('register-message', 'กรุณากรอกอีเมลให้ถูกต้อง', 'error');
        return;
    }
    
    showButtonLoading('register-btn', true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage('register-message', 'สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ', 'success');
            showToast('สมัครสมาชิกสำเร็จ!', 'success');
            setTimeout(() => {
                showTab('login', document.querySelector('[onclick*="login"]'));
                // Clear form
                document.getElementById('register-form').reset();
            }, 1500);
        } else {
            showMessage('register-message', data.message || 'สมัครสมาชิกไม่สำเร็จ', 'error');
            showToast(data.message || 'สมัครสมาชิกไม่สำเร็จ', 'error');
        }
    } catch (error) {
        let errorMsg = 'เกิดข้อผิดพลาด: ' + error.message;
        
        if (error.message.includes('fetch') || error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMsg = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้\n\nกรุณาตรวจสอบว่า:\n1. Backend Services รันอยู่ (ใช้ start-services.bat หรือ start-services.sh)\n2. API Gateway รันที่ http://localhost:8080\n3. เปิด check-services.html เพื่อตรวจสอบสถานะ Services';
        }
        
        showMessage('register-message', errorMsg, 'error');
        showToast('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้', 'error');
    } finally {
        showButtonLoading('register-btn', false);
    }
}

// Handle Search Key Press
function handleSearchKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchBooks();
    }
}

// Search Books
async function searchBooks() {
    const searchTerm = document.getElementById('search-input').value.trim();
    await loadBooks(searchTerm);
}

// Filter Books
function filterBooks(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    loadBooks(document.getElementById('search-input').value.trim());
}

async function loadBooks(searchTerm = '') {
    if (!authToken) {
        showMessage('books-message', 'กรุณาเข้าสู่ระบบก่อน', 'error');
        return;
    }
    
    const booksList = document.getElementById('books-list');
    const booksLoading = document.getElementById('books-loading');
    const booksEmpty = document.getElementById('books-empty');
    
    booksLoading.style.display = 'block';
    booksEmpty.style.display = 'none';
    booksList.innerHTML = '';
    
    try {
        let url = `${API_BASE_URL}/books`;
        const params = new URLSearchParams();
        if (searchTerm) {
            params.append('title', searchTerm);
        }
        if (params.toString()) {
            url += '?' + params.toString();
        }
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch books');
        }
        
        let books = await response.json();
        
        // Apply filter
        if (currentFilter === 'available') {
            books = books.filter(book => book.status === 'AVAILABLE');
        } else if (currentFilter === 'borrowed') {
            books = books.filter(book => book.status === 'BORROWED');
        }
        
        booksLoading.style.display = 'none';
        
        if (books.length === 0) {
            booksEmpty.style.display = 'block';
            return;
        }
        
        booksList.innerHTML = books.map(book => `
            <div class="book-card">
                <h3>${escapeHtml(book.title || 'ไม่มีชื่อ')}</h3>
                <p><strong>ผู้แต่ง:</strong> ${escapeHtml(book.author || 'ไม่ระบุ')}</p>
                <p><strong>หมวดหมู่:</strong> ${escapeHtml(book.category || 'ไม่ระบุ')}</p>
                <p><strong>ISBN:</strong> ${escapeHtml(book.isbn || 'ไม่ระบุ')}</p>
                <span class="book-status ${book.status === 'AVAILABLE' ? 'status-available' : 'status-borrowed'}">
                    ${book.status === 'AVAILABLE' ? '✓ พร้อมให้ยืม' : '✗ ถูกยืมแล้ว'}
                </span>
                ${book.status === 'AVAILABLE' ? `
                    <button class="btn btn-success" style="width: 100%; margin-top: 15px;" 
                            onclick="borrowBook(${book.bookId || book.id})">
                        📖 ยืมหนังสือ
                    </button>
                ` : ''}
            </div>
        `).join('');
    } catch (error) {
        booksLoading.style.display = 'none';
        console.error('Error loading books:', error);
        booksList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⚠️</div>
                <h3>เกิดข้อผิดพลาด</h3>
                <p>ไม่สามารถโหลดข้อมูลหนังสือได้</p>
                <button class="btn btn-primary" onclick="loadBooks()">ลองอีกครั้ง</button>
            </div>
        `;
    }
}

// Borrow Book
async function borrowBook(bookId) {
    if (!authToken) {
        showToast('กรุณาเข้าสู่ระบบก่อน', 'error');
        return;
    }
    
    if (!confirm('คุณต้องการยืมหนังสือเล่มนี้ใช่หรือไม่?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/borrowings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ bookId })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('ยืมหนังสือสำเร็จ!', 'success');
            loadBooks();
            loadBorrowings();
        } else {
            showToast(data.message || 'ยืมหนังสือไม่สำเร็จ', 'error');
        }
    } catch (error) {
        showToast('เกิดข้อผิดพลาด: ' + error.message, 'error');
    }
}

// Load Borrowings
async function loadBorrowings() {
    if (!authToken) {
        return;
    }
    
    const borrowingsList = document.getElementById('borrowings-list');
    const borrowingsLoading = document.getElementById('borrowings-loading');
    const borrowingsEmpty = document.getElementById('borrowings-empty');
    
    borrowingsLoading.style.display = 'block';
    borrowingsEmpty.style.display = 'none';
    borrowingsList.innerHTML = '';
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/me/borrowings`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        let borrowings = [];
        if (response.ok) {
            borrowings = await response.json();
        }
        
        borrowingsLoading.style.display = 'none';
        
        if (!borrowings || borrowings.length === 0) {
            borrowingsEmpty.style.display = 'block';
            return;
        }
        
        borrowingsList.innerHTML = borrowings.map(borrowing => {
            const isOverdue = !borrowing.returnDate && new Date(borrowing.dueDate) < new Date();
            return `
                <div class="borrowing-item ${isOverdue ? 'overdue' : ''}">
                    <h3>${escapeHtml(borrowing.bookTitle || 'หนังสือ')}</h3>
                    <p><strong>📅 วันที่ยืม:</strong> ${formatDate(borrowing.borrowDate)}</p>
                    <p><strong>📆 กำหนดส่งคืน:</strong> ${formatDate(borrowing.dueDate)} ${isOverdue ? '⚠️ เกินกำหนด' : ''}</p>
                    ${borrowing.returnDate ? 
                        `<p><strong>✅ วันที่ส่งคืน:</strong> ${formatDate(borrowing.returnDate)}</p>` :
                        `<button class="btn btn-danger" onclick="returnBook(${borrowing.borrowId || borrowing.id})">ส่งคืนหนังสือ</button>`
                    }
                </div>
            `;
        }).join('');
    } catch (error) {
        borrowingsLoading.style.display = 'none';
        console.error('Error loading borrowings:', error);
        borrowingsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⚠️</div>
                <h3>เกิดข้อผิดพลาด</h3>
                <p>ไม่สามารถโหลดข้อมูลได้</p>
                <button class="btn btn-primary" onclick="loadBorrowings()">ลองอีกครั้ง</button>
            </div>
        `;
    }
}

// Return Book
async function returnBook(borrowId) {
    if (!authToken) {
        showToast('กรุณาเข้าสู่ระบบก่อน', 'error');
        return;
    }
    
    if (!confirm('คุณต้องการส่งคืนหนังสือเล่มนี้ใช่หรือไม่?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/borrowings/${borrowId}/return`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('ส่งคืนหนังสือสำเร็จ!', 'success');
            loadBorrowings();
            loadBooks();
        } else {
            showToast(data.message || 'ส่งคืนหนังสือไม่สำเร็จ', 'error');
        }
    } catch (error) {
        showToast('เกิดข้อผิดพลาด: ' + error.message, 'error');
    }
}

// Logout
function logout() {
    if (!confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
        return;
    }
    
    authToken = null;
    currentUser = null;
    currentUserRole = 'USER';
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    document.getElementById('user-info').style.display = 'none';
    
    // Show login/register tabs, hide books/borrowings/admin
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.textContent.includes('เข้าสู่ระบบ') || btn.textContent.includes('สมัครสมาชิก')) {
            btn.style.display = 'flex';
        }
    });
    document.getElementById('books-tab-btn').style.display = 'none';
    document.getElementById('borrowings-tab-btn').style.display = 'none';
    document.getElementById('admin-tab-btn').style.display = 'none';
    
    showTab('login', document.querySelector('[onclick*="login"]'));
    showToast('ออกจากระบบสำเร็จ', 'success');
}

// Update User Info
function updateUserInfo() {
    if (currentUser) {
        const userName = currentUser.username || 'ผู้ใช้';
        const roleText = currentUserRole === 'ADMIN' ? ' (Admin)' : '';
        document.getElementById('user-name').textContent = userName + roleText;
        document.getElementById('user-initial').textContent = userName.charAt(0).toUpperCase();
        document.getElementById('user-info').style.display = 'flex';
        
        // Update avatar color for admin
        const avatar = document.querySelector('.user-avatar');
        if (avatar && currentUserRole === 'ADMIN') {
            avatar.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
        }
    }
}

// Show Message
function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.className = `message ${type}`;
        setTimeout(() => {
            element.className = 'message';
        }, 5000);
    }
}

// Format Date
function formatDate(dateString) {
    if (!dateString) return 'ไม่ระบุ';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (e) {
        return dateString;
    }
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Admin Functions
async function loadAdminDashboard() {
    if (currentUserRole !== 'ADMIN') {
        showToast('คุณไม่มีสิทธิ์เข้าถึง', 'error');
        return;
    }
    
    await Promise.all([
        loadAdminStats(),
        loadAdminBooks(),
        loadAdminUsers(),
        loadAdminBorrowings()
    ]);
}

async function loadAdminStats() {
    try {
        // Load books count
        const booksRes = await fetch(`${API_BASE_URL}/books`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const books = await booksRes.json();
        document.getElementById('total-books').textContent = books.length || 0;
        
        // Load users count
        const usersRes = await fetch(`${API_BASE_URL}/admin/users`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (usersRes.ok) {
            const users = await usersRes.json();
            document.getElementById('total-users').textContent = users.length || 0;
        }
        
        // Load borrowing stats
        const statsRes = await fetch(`${API_BASE_URL}/admin/borrowings/stats`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (statsRes.ok) {
            const stats = await statsRes.json();
            document.getElementById('active-borrowings').textContent = stats.activeBorrowings || 0;
            document.getElementById('overdue-borrowings').textContent = stats.overdueBorrowings || 0;
        }
    } catch (error) {
        console.error('Error loading admin stats:', error);
    }
}

async function loadAdminBooks() {
    try {
        const response = await fetch(`${API_BASE_URL}/books`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const books = await response.json();
        
        const booksList = document.getElementById('admin-books-list');
        booksList.innerHTML = books.map(book => `
            <div class="book-card">
                <h3>${escapeHtml(book.title || 'ไม่มีชื่อ')}</h3>
                <p><strong>ผู้แต่ง:</strong> ${escapeHtml(book.author || 'ไม่ระบุ')}</p>
                <p><strong>หมวดหมู่:</strong> ${escapeHtml(book.category || 'ไม่ระบุ')}</p>
                <p><strong>ISBN:</strong> ${escapeHtml(book.isbn || 'ไม่ระบุ')}</p>
                <span class="book-status ${book.status === 'AVAILABLE' ? 'status-available' : 'status-borrowed'}">
                    ${book.status === 'AVAILABLE' ? '✓ พร้อมให้ยืม' : '✗ ถูกยืมแล้ว'}
                </span>
                <div style="margin-top: 15px; display: flex; gap: 10px;">
                    <button class="btn btn-danger" style="flex: 1;" onclick="deleteBook(${book.bookId || book.id})">ลบ</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading admin books:', error);
    }
}

async function loadAdminUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (!response.ok) return;
        
        const users = await response.json();
        const usersList = document.getElementById('admin-users-list');
        usersList.innerHTML = users.map(user => `
            <div class="user-item">
                <div>
                    <h3>${escapeHtml(user.username)}</h3>
                    <p>${escapeHtml(user.email)}</p>
                    <span class="role-badge ${user.role === 'ADMIN' ? 'role-admin' : 'role-user'}">
                        ${user.role === 'ADMIN' ? '👑 แอดมิน' : '👤 ผู้ใช้'}
                    </span>
                </div>
                ${user.role !== 'ADMIN' ? `
                    <button class="btn btn-danger" onclick="deleteUser(${user.userId})">ลบ</button>
                ` : ''}
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading admin users:', error);
    }
}

async function loadAdminBorrowings() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/borrowings`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (!response.ok) return;
        
        const borrowings = await response.json();
        const borrowingsList = document.getElementById('admin-borrowings-list');
        if (borrowings.length === 0) {
            borrowingsList.innerHTML = '<p style="text-align: center; color: #666;">ยังไม่มีรายการยืม</p>';
            return;
        }
        
        borrowingsList.innerHTML = borrowings.map(borrowing => {
            const isOverdue = !borrowing.returnDate && new Date(borrowing.dueDate) < new Date();
            return `
                <div class="borrowing-item ${isOverdue ? 'overdue' : ''}">
                    <h3>${escapeHtml(borrowing.bookTitle || 'หนังสือ')}</h3>
                    <p><strong>ผู้ใช้ ID:</strong> ${borrowing.userId}</p>
                    <p><strong>📅 วันที่ยืม:</strong> ${formatDate(borrowing.borrowDate)}</p>
                    <p><strong>📆 กำหนดส่งคืน:</strong> ${formatDate(borrowing.dueDate)} ${isOverdue ? '⚠️ เกินกำหนด' : ''}</p>
                    ${borrowing.returnDate ? 
                        `<p><strong>✅ วันที่ส่งคืน:</strong> ${formatDate(borrowing.returnDate)}</p>` :
                        '<p style="color: var(--warning-color);">⏳ ยังไม่ส่งคืน</p>'
                    }
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading admin borrowings:', error);
    }
}

function showAddBookModal() {
    document.getElementById('add-book-modal').style.display = 'flex';
}

function closeAddBookModal() {
    document.getElementById('add-book-modal').style.display = 'none';
    document.getElementById('add-book-form').reset();
}

document.getElementById('add-book-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const book = {
        title: document.getElementById('book-title').value,
        author: document.getElementById('book-author').value,
        category: document.getElementById('book-category').value,
        isbn: document.getElementById('book-isbn').value,
        status: 'AVAILABLE'
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(book)
        });
        
        if (response.ok) {
            showToast('เพิ่มหนังสือสำเร็จ!', 'success');
            closeAddBookModal();
            loadAdminBooks();
            loadAdminStats();
        } else {
            showToast('เพิ่มหนังสือไม่สำเร็จ', 'error');
        }
    } catch (error) {
        showToast('เกิดข้อผิดพลาด: ' + error.message, 'error');
    }
});

async function deleteBook(bookId) {
    if (!confirm('คุณต้องการลบหนังสือเล่มนี้ใช่หรือไม่?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/books/${bookId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            showToast('ลบหนังสือสำเร็จ!', 'success');
            loadAdminBooks();
            loadAdminStats();
        } else {
            showToast('ลบหนังสือไม่สำเร็จ', 'error');
        }
    } catch (error) {
        showToast('เกิดข้อผิดพลาด: ' + error.message, 'error');
    }
}

async function deleteUser(userId) {
    if (!confirm('คุณต้องการลบผู้ใช้นี้ใช่หรือไม่?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            showToast('ลบผู้ใช้สำเร็จ!', 'success');
            loadAdminUsers();
            loadAdminStats();
        } else {
            showToast('ลบผู้ใช้ไม่สำเร็จ', 'error');
        }
    } catch (error) {
        showToast('เกิดข้อผิดพลาด: ' + error.message, 'error');
    }
}
