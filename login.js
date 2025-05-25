import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    
    // Check if user is already logged in via Supabase
    (async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            // User is logged in, redirect to index.html
            window.location.href = 'index.html';
        }
        // If no session, the login page will remain, allowing the user to log in.
    })();
    
    // Handle login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value; // Changed variable name and ID
        const password = document.getElementById('password').value;
        
        (async () => {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email, // Use the new 'email' variable
                password: password
            });

            if (error) {
                showError(error.message);
            } else {
                // Login successful, redirect to home page
                // Supabase handles session storage automatically.
                window.location.href = 'index.html';
                // No need to set currentUser or rememberMe in localStorage manually
            }
        })();
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