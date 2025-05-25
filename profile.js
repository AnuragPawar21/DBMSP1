document.addEventListener('DOMContentLoaded', async () => {
    // Ensure Supabase client is available
    if (typeof supabase === 'undefined') {
        console.error('Supabase client is not loaded. Redirecting to login.');
        alert('Error: Application not initialized. Please login again.');
        window.location.href = 'login.html'; // Or an error page
        return;
    }

    const profileNameElement = document.getElementById('profile-name');
    const profileUsernameElement = document.getElementById('profile-username');
    const profileEmailElement = document.getElementById('profile-email');
    const fullnameValueElement = document.getElementById('fullname-value');
    const emailValueElement = document.getElementById('email-value');
    const usernameValueElement = document.getElementById('username-value');
    const joinedValueElement = document.getElementById('joined-value');
    const quizHistoryTableBody = document.getElementById('quiz-history');
    const logoutButton = document.getElementById('logout-btn');

    // Function to format date as Month D, YYYY
    function formatDate(isoString) {
        if (!isoString) return 'N/A';
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    // Function to format time from seconds to MM:SS
    function formatTime(totalSeconds) {
        if (totalSeconds === null || typeof totalSeconds === 'undefined') return 'N/A';
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    async function loadUserProfile() {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                console.error('Error fetching user or user not logged in:', authError);
                alert('You are not logged in. Redirecting to login page.');
                window.location.href = 'login.html';
                return;
            }

            // Fetch user details from your custom 'users' table
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('username, full_name, email, created_at')
                .eq('id', user.id)
                .single(); // Expecting a single row

            if (userError) {
                console.error('Error fetching user profile data:', userError);
                alert('Could not load your profile information.');
                return;
            }

            if (userData) {
                profileNameElement.textContent = userData.full_name || 'N/A';
                profileUsernameElement.textContent = `@${userData.username}` || '@N/A';
                profileEmailElement.textContent = userData.email || 'N/A';
                
                fullnameValueElement.textContent = userData.full_name || 'N/A';
                emailValueElement.textContent = userData.email || 'N/A';
                usernameValueElement.textContent = userData.username || 'N/A';
                joinedValueElement.textContent = formatDate(userData.created_at);
            } else {
                 profileNameElement.textContent = 'User';
                 profileUsernameElement.textContent = '@username';
                 profileEmailElement.textContent = 'user@example.com';
                 alert('Profile details not found. Please complete your profile or contact support.');
            }

            // Fetch quiz history
            const { data: quizResults, error: resultsError } = await supabase
                .from('quiz_results')
                .select('completed_at, quiz_category, score, total_questions, time_taken_seconds, percentage')
                .eq('user_id', user.id)
                .order('completed_at', { ascending: false });

            if (resultsError) {
                console.error('Error fetching quiz history:', resultsError);
                quizHistoryTableBody.innerHTML = '<tr><td colspan="4">Could not load quiz history.</td></tr>';
                return;
            }

            if (quizResults && quizResults.length > 0) {
                quizHistoryTableBody.innerHTML = ''; // Clear any placeholders
                quizResults.forEach(result => {
                    const row = quizHistoryTableBody.insertRow();
                    row.insertCell().textContent = formatDate(result.completed_at);
                    row.insertCell().textContent = result.quiz_category;
                    row.insertCell().textContent = `${result.score}/${result.total_questions} (${result.percentage.toFixed(0)}%)`;
                    row.insertCell().textContent = formatTime(result.time_taken_seconds);
                });
            } else {
                quizHistoryTableBody.innerHTML = '<tr><td colspan="4">No quiz history found. Time to take some quizzes!</td></tr>';
            }

        } catch (error) {
            console.error('Unexpected error loading profile:', error);
            alert('An unexpected error occurred. Please try refreshing the page.');
            // Clear sensitive fields or redirect
            profileNameElement.textContent = 'Error';
            quizHistoryTableBody.innerHTML = '<tr><td colspan="4">Error loading data.</td></tr>';
        }
    }

    // Logout functionality
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            if (typeof supabase !== 'undefined') {
                const { error } = await supabase.auth.signOut();
                if (error) {
                    console.error('Error during sign out:', error);
                    alert('Logout failed. Please try again.');
                } else {
                    window.location.href = 'login.html'; // Redirect to login page
                }
            }
        });
    } else {
        console.warn('Logout button not found in profile.html');
    }
    
    // Initial load
    loadUserProfile();
});
