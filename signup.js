document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    
    // Check if user is already logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        window.location.href = 'index.html';
    }
    
    // Handle signup form submission
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const fullname = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;
        
        // Validate form
        if (!validateForm(username, password, confirmPassword, fullname, email)) {
            return;
        }
        
        // Get existing users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || {};
        
        // Check if username already exists
        if (users[username]) {
            showError('Username already exists');
            return;
        }
        
        // Create new user
        users[username] = {
            password: password,
            fullname: fullname,
            email: email,
            joined: new Date().toISOString(),
            scores: []
        };
        
        // Save users to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        // Show success message
        showSuccess('Account created successfully! Redirecting to login...');
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });
    
    // Validate form
    function validateForm(username, password, confirmPassword, fullname, email) {
        // Username validation
        if (username.length < 3) {
            showError('Username must be at least 3 characters long');
            return false;
        }
        
        // Password validation
        if (password.length < 6) {
            showError('Password must be at least 6 characters long');
            return false;
        }
        
        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return false;
        }
        
        // Full name validation
        if (fullname.trim() === '') {
            showError('Full name is required');
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('Please enter a valid email address');
            return false;
        }
        
        return true;
    }
    
    // Show error message
    function showError(message) {
        let errorElement = document.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            signupForm.insertBefore(errorElement, signupForm.firstChild);
        }
        
        errorElement.textContent = message;
        errorElement.style.color = '#dc3545';
        errorElement.style.backgroundColor = '#f8d7da';
        errorElement.style.border = '1px solid #f5c6cb';
        errorElement.style.borderRadius = '4px';
        errorElement.style.padding = '10px';
        errorElement.style.marginBottom = '15px';
        errorElement.style.textAlign = 'center';
        
        setTimeout(() => {
            errorElement.remove();
        }, 3000);
    }
    
    // Show success message
    function showSuccess(message) {
        let successElement = document.querySelector('.success-message');
        
        if (!successElement) {
            successElement = document.createElement('div');
            successElement.className = 'success-message';
            signupForm.insertBefore(successElement, signupForm.firstChild);
        }
        
        successElement.textContent = message;
        successElement.style.color = '#28a745';
        successElement.style.backgroundColor = '#d4edda';
        successElement.style.border = '1px solid #c3e6cb';
        successElement.style.borderRadius = '4px';
        successElement.style.padding = '10px';
        successElement.style.marginBottom = '15px';
        successElement.style.textAlign = 'center';
    }
}); 