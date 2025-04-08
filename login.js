document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    
    // Check if user is already logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        window.location.href = 'index.html';
    }
    
    // Handle login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || {};
        
        // Check if user exists and password is correct
        if (users[username] && users[username].password === password) {
            // Store current user in localStorage
            const userData = {
                username: username,
                fullname: users[username].fullname,
                email: users[username].email,
                joined: users[username].joined
            };
            
            localStorage.setItem('currentUser', JSON.stringify(userData));
            
            // If remember me is checked, store login state
            if (remember) {
                localStorage.setItem('rememberMe', 'true');
            }
            
            // Redirect to home page
            window.location.href = 'index.html';
        } else {
            // Show error message
            showError('Invalid username or password');
        }
    });
    
    // Show error message
    function showError(message) {
        // Check if error element already exists
        let errorElement = document.querySelector('.error-message');
        
        if (!errorElement) {
            // Create error element
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            loginForm.insertBefore(errorElement, loginForm.firstChild);
        }
        
        // Set error message
        errorElement.textContent = message;
        
        // Add error styles
        errorElement.style.color = '#dc3545';
        errorElement.style.backgroundColor = '#f8d7da';
        errorElement.style.border = '1px solid #f5c6cb';
        errorElement.style.borderRadius = '4px';
        errorElement.style.padding = '10px';
        errorElement.style.marginBottom = '15px';
        errorElement.style.textAlign = 'center';
        
        // Remove error after 3 seconds
        setTimeout(() => {
            errorElement.remove();
        }, 3000);
    }
}); 