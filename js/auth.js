// Helper to get users from localStorage or empty array
function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

// Helper to save users array to localStorage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Hash password (simple hash for demo, replace with real hashing in production)
function simpleHash(password) {
    // Simple example: sum char codes (NOT secure, demo only)
    return password.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

// Signup handler
function handleSignup(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;

    if (!username || !email || !password) {
        alert('Please fill all fields.');
        return;
    }

    let users = getUsers();

    if (users.find(u => u.email === email)) {
        alert('Email already registered.');
        return;
    }

    const hashedPassword = simpleHash(password);

    users.push({ username, email, password: hashedPassword });
    saveUsers(users);

    alert('Signup successful! Please login.');
    window.location.href = 'login.html';
}

// Login handler
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const hashedPassword = simpleHash(password);

    let users = getUsers();

    const user = users.find(u => u.email === email && u.password === hashedPassword);
    if (!user) {
        alert('Invalid email or password.');
        return;
    }

    // Save logged in user session (store email)
    localStorage.setItem('loggedInUser', JSON.stringify(user));

    alert('Login successful!');
    window.location.href = 'dashboard.html';
}

// Logout handler
function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
}

// Check login status helper
function getLoggedInUser() {
    const user = localStorage.getItem('loggedInUser');
    return user ? JSON.parse(user) : null;
}

// Attach event listeners if forms exist
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});