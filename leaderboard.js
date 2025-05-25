document.addEventListener('DOMContentLoaded', async () => {
    // Ensure Supabase client is available
    if (typeof supabase === 'undefined') {
        console.error('Supabase client is not loaded. Please check your setup.');
        alert('Error: Application not initialized. Leaderboard cannot be loaded.');
        // Potentially hide leaderboard content or show an error message prominently
        return;
    }

    const leaderboardTableBody = document.getElementById('leaderboard-body');
    const topUserElements = {
        firstPlace: document.querySelector('.top-user.first-place'),
        secondPlace: document.querySelector('.top-user.second-place'),
        thirdPlace: document.querySelector('.top-user.third-place')
    };
    
    // Filter and pagination elements (will be made functional in a future step if needed)
    const categoryFilter = document.getElementById('category-filter');
    const timeFilter = document.getElementById('time-filter');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    const pageInfoElement = document.getElementById('page-info');

    // Initially disable filters and pagination
    categoryFilter.disabled = true;
    timeFilter.disabled = true;
    prevPageButton.disabled = true;
    nextPageButton.disabled = true;
    pageInfoElement.textContent = "Page 1 of 1";


    function formatDate(isoString) {
        if (!isoString) return 'N/A';
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function populateTopPlayer(element, rank, playerData) {
        if (!element || !playerData) {
            if(element) element.style.display = 'none'; // Hide if no data
            return;
        }
        element.style.display = ''; // Show if previously hidden
        element.querySelector('.rank').textContent = rank;
        element.querySelector('h3').textContent = playerData.username || 'N/A'; // Assuming username from view
        // The view provides average_score_percentage and total_score. Let's use average.
        element.querySelector('p').textContent = `Avg Score: ${playerData.average_score_percentage ? playerData.average_score_percentage.toFixed(0) : 0}%`;
    }

    async function loadLeaderboard() {
        try {
            // Fetch data from the leaderboard_view
            // This view should be ordered by a ranking criteria (e.g., total_score DESC, average_score_percentage DESC)
            // Let's assume the view is already sorted. We'll limit to top 20 for this example.
            const { data: leaderboardData, error } = await supabase
                .from('leaderboard_view') // Use the view created in Supabase
                .select('username, full_name, quizzes_completed, total_score, average_score_percentage, last_quiz_date')
                // The view should ideally be sorted already. If not, add .order() here.
                // For example: .order('total_score', { ascending: false }).order('average_score_percentage', { ascending: false })
                .limit(20); // Display top 20 users for now

            if (error) {
                console.error('Error fetching leaderboard data:', error);
                leaderboardTableBody.innerHTML = `<tr><td colspan="5">Could not load leaderboard: ${error.message}</td></tr>`;
                // Hide top 3 if data fails
                Object.values(topUserElements).forEach(el => { if(el) el.style.display = 'none'; });
                return;
            }

            if (!leaderboardData || leaderboardData.length === 0) {
                leaderboardTableBody.innerHTML = '<tr><td colspan="5">Leaderboard is empty. Be the first to take a quiz!</td></tr>';
                Object.values(topUserElements).forEach(el => { if(el) el.style.display = 'none'; });
                return;
            }

            // Populate Top 3
            populateTopPlayer(topUserElements.firstPlace, 1, leaderboardData[0]);
            populateTopPlayer(topUserElements.secondPlace, 2, leaderboardData[1]);
            populateTopPlayer(topUserElements.thirdPlace, 3, leaderboardData[2]);
            
            // Hide placeholders if fewer than 3 players
            if (leaderboardData.length < 3 && topUserElements.thirdPlace) topUserElements.thirdPlace.style.display = 'none';
            if (leaderboardData.length < 2 && topUserElements.secondPlace) topUserElements.secondPlace.style.display = 'none';
            if (leaderboardData.length < 1 && topUserElements.firstPlace) topUserElements.firstPlace.style.display = 'none';


            // Populate Leaderboard Table
            leaderboardTableBody.innerHTML = ''; // Clear placeholders
            leaderboardData.forEach((entry, index) => {
                const rank = index + 1;
                const row = leaderboardTableBody.insertRow();
                
                row.insertCell().textContent = rank;
                row.insertCell().textContent = entry.username || (entry.full_name || 'N/A');
                // The view is for "All Categories" for now. If category specific, this would change.
                row.insertCell().textContent = 'All Categories'; 
                // Displaying average score as the main score metric from the view
                row.insertCell().textContent = `${entry.average_score_percentage ? entry.average_score_percentage.toFixed(0) : 0}% (Total: ${entry.total_score || 0})`;
                row.insertCell().textContent = formatDate(entry.last_quiz_date);
            });

        } catch (err) {
            console.error('Unexpected error loading leaderboard:', err);
            leaderboardTableBody.innerHTML = '<tr><td colspan="5">An unexpected error occurred.</td></tr>';
            Object.values(topUserElements).forEach(el => { if(el) el.style.display = 'none'; });
        }
    }
    
    // Logout functionality (if logout button is on this page's navbar)
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            if (typeof supabase !== 'undefined') {
                const { error } = await supabase.auth.signOut();
                if (error) {
                    console.error('Error during sign out:', error);
                    alert('Logout failed. Please try again.');
                } else {
                    window.location.href = 'login.html';
                }
            }
        });
    }

    // Initial load
    loadLeaderboard();
});
