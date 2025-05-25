document.addEventListener('DOMContentLoaded', async () => {
    // Ensure Supabase client is available
    if (typeof supabase === 'undefined') {
        console.error('Supabase client is not loaded. Redirecting to login.');
        alert('Error: Application not initialized. Please login again.');
        window.location.href = 'login.html';
        return;
    }

    // DOM Elements for stats
    const totalQuizzesElement = document.getElementById('total-quizzes');
    const averageScoreElement = document.getElementById('average-score');
    const bestScoreElement = document.getElementById('best-score');
    const timeSpentElement = document.getElementById('time-spent');
    const activityListElement = document.getElementById('activity-list');

    // Chart instances
    let categoryChartInstance = null;
    let progressChartInstance = null;

    // Utility to format time from seconds to a more readable format (e.g., Xh Ym Zs or Ym Zs)
    function formatTotalTime(totalSeconds) {
        if (totalSeconds === 0) return '0 min';
        if (totalSeconds === null || typeof totalSeconds === 'undefined') return 'N/A';

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        let formattedTime = '';
        if (hours > 0) formattedTime += `${hours}h `;
        if (minutes > 0) formattedTime += `${minutes}m `;
        if (seconds > 0 && hours === 0) formattedTime += `${seconds}s`; // Show seconds if no hours
        
        return formattedTime.trim() || '0s'; // Default to 0s if everything is 0 after formatting
    }
    
    // Utility to format date for display
    function formatDate(isoString) {
        if (!isoString) return 'N/A';
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }


    async function loadDashboardData() {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                console.error('Error fetching user or user not logged in:', authError);
                alert('You are not logged in. Redirecting to login page.');
                window.location.href = 'login.html';
                return;
            }

            // Fetch all quiz results for the user
            const { data: quizResults, error: resultsError } = await supabase
                .from('quiz_results')
                .select('quiz_category, score, total_questions, percentage, completed_at, time_taken_seconds')
                .eq('user_id', user.id)
                .order('completed_at', { ascending: false });

            if (resultsError) {
                console.error('Error fetching quiz results:', resultsError);
                // Display error messages in stat cards or a general message
                totalQuizzesElement.textContent = 'Error';
                averageScoreElement.textContent = 'Error';
                bestScoreElement.textContent = 'Error';
                timeSpentElement.textContent = 'Error';
                activityListElement.innerHTML = '<li>Could not load recent activity.</li>';
                return;
            }

            if (!quizResults || quizResults.length === 0) {
                totalQuizzesElement.textContent = '0';
                averageScoreElement.textContent = '0%';
                bestScoreElement.textContent = '0%';
                timeSpentElement.textContent = '0 min';
                activityListElement.innerHTML = '<li>No quizzes taken yet.</li>';
                // Initialize empty charts or charts with "No data" message
                renderCategoryChart({});
                renderProgressChart([]);
                return;
            }

            // Calculate Stats
            totalQuizzesElement.textContent = quizResults.length;

            const totalPercentage = quizResults.reduce((sum, result) => sum + result.percentage, 0);
            averageScoreElement.textContent = `${(totalPercentage / quizResults.length).toFixed(0)}%`;

            const maxScore = quizResults.reduce((max, result) => Math.max(max, result.percentage), 0);
            bestScoreElement.textContent = `${maxScore.toFixed(0)}%`;

            const totalTime = quizResults.reduce((sum, result) => sum + (result.time_taken_seconds || 0), 0);
            timeSpentElement.textContent = formatTotalTime(totalTime);

            // Populate Recent Activity (e.g., last 5)
            activityListElement.innerHTML = ''; // Clear placeholders
            quizResults.slice(0, 5).forEach(result => {
                const activityItem = document.createElement('div');
                activityItem.className = 'activity-item'; // Add a class for styling if needed
                activityItem.innerHTML = `
                    <p><strong>${result.quiz_category}</strong> - Score: ${result.score}/${result.total_questions} (${result.percentage.toFixed(0)}%)</p>
                    <span>${formatDate(result.completed_at)}</span>
                `;
                activityListElement.appendChild(activityItem);
            });
            if (quizResults.length === 0) {
                 activityListElement.innerHTML = '<li>No recent activity.</li>';
            }


            // Prepare data for Performance by Category chart
            const performanceByCategory = quizResults.reduce((acc, result) => {
                if (!acc[result.quiz_category]) {
                    acc[result.quiz_category] = { sum: 0, count: 0 };
                }
                acc[result.quiz_category].sum += result.percentage;
                acc[result.quiz_category].count++;
                return acc;
            }, {});

            const categoryLabels = Object.keys(performanceByCategory);
            const categoryAverages = categoryLabels.map(cat => 
                (performanceByCategory[cat].sum / performanceByCategory[cat].count).toFixed(0)
            );
            renderCategoryChart({ labels: categoryLabels, data: categoryAverages });


            // Prepare data for Progress Over Time chart (using percentage)
            const progressData = quizResults.map(result => ({
                x: new Date(result.completed_at), // Chart.js can handle Date objects for time series
                y: result.percentage
            })).sort((a, b) => a.x - b.x); // Ensure data is sorted by date for line chart

            renderProgressChart(progressData);

        } catch (error) {
            console.error('Unexpected error loading dashboard:', error);
            alert('An unexpected error occurred while loading the dashboard. Please try refreshing.');
        }
    }

    function renderCategoryChart(data) {
        const ctx = document.getElementById('category-chart')?.getContext('2d');
        if (!ctx) return;

        if (categoryChartInstance) {
            categoryChartInstance.destroy();
        }
        categoryChartInstance = new Chart(ctx, {
            type: 'bar', // or 'pie' or 'doughnut'
            data: {
                labels: data.labels || [],
                datasets: [{
                    label: 'Average Score by Category (%)',
                    data: data.data || [],
                    backgroundColor: [ // Add more colors if more categories are expected
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)',
                        'rgba(255, 159, 64, 0.7)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100, // Percentages
                        title: { display: true, text: 'Average Percentage' }
                    }
                },
                plugins: {
                    legend: { display: (data.labels && data.labels.length > 0) },
                    title: { display: false } // Already have <h2>
                }
            }
        });
    }

    function renderProgressChart(data) {
        const ctx = document.getElementById('progress-chart')?.getContext('2d');
        if (!ctx) return;

        if (progressChartInstance) {
            progressChartInstance.destroy();
        }
        progressChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Quiz Performance Over Time (%)',
                    data: data, // Expects array of {x: Date, y: value}
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            tooltipFormat: 'MMM D, YYYY', // e.g., Jan 1, 2023
                            displayFormats: {
                                day: 'MMM D' // e.g., Jan 1
                            }
                        },
                        title: { display: true, text: 'Date' }
                    },
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: { display: true, text: 'Percentage Score' }
                    }
                },
                plugins: {
                    legend: { display: (data && data.length > 0) },
                    title: { display: false }
                }
            }
        });
    }
    
    // Also handle logout if the button is present in the navbar on this page
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
    loadDashboardData();
});
