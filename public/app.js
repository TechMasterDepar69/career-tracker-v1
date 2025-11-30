const form = document.getElementById('job-form');
const jobList = document.getElementById('job-list');
const statsDisplay = document.getElementById('stats-display');

// 1. Load jobs when page opens
document.addEventListener('DOMContentLoaded', getJobs);

// 2. Handle Form Submit
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newJob = {
        company: document.getElementById('company').value,
        position: document.getElementById('position').value,
        salaryExpectation: Number(document.getElementById('salary').value),
        status: document.getElementById('status').value
    };

    // Send to Backend (The "Waiter")
    await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob)
    });

    // Clear form and reload list
    form.reset();
    getJobs();
});

// 3. Fetch and Display Jobs
async function getJobs() {
    const res = await fetch('/api/jobs');
    const data = await res.json();

    // --- Analyst Logic Start ---

    // 1. Calulate Total
    const total = data.count;

    // 2. Calulate Interviews (Filter the data)
    const interviews = data.data.filter(job => job.status === 'Interviewing').length;

    // 3. Calculate Success Rate (Math)
    // Avoid dividing by zero! if total is 0, rate is 0.
    const rate = total === 0 ? 0 : Math.round((interviews / total) * 100);

    // 4. Update the UI
    document.getElementById('stat-total').innerText = total;
    document.getElementById('stat-interviews').innerText = interviews;
    document.getElementById('stat-rate').innerText = `${rate}`;

    // --- Analyst Logic End ---

    // --- Chart logic start ---

    // 1. Get Counts for the chart
    const appliedCount = data.data.filter(j => j.status === 'Applied').length;
    const interviewCount = data.data.filter(j => j.status === 'Interviewing').length;
    const offerCount = data.data.filter(j => j.status === 'Offer').length;
    const rejectedCount = data.data.filter(j => j.status === 'Rejected').length;

    // 2. Destory old chart if it exists (so don't draw chart on top of chart)
    if (window.myJobChart) {
        window.myJobChart.destroy();
    }

    // 3. Draw new chart
    const ctx = document.getElementById('myChart').getContext('2d');
    window.myJobChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Applied', 'Interviewing', 'Offer', 'Rejected'],
            datasets: [{
                label: 'Application',
                data: [appliedCount, interviewCount, offerCount, rejectedCount],
                backgroundColor: [
                    '#007bff', // Blue (Applied)
                    '#ffc107', // Yellow (Interviewing)
                    '#28a745', // Green (Offer)
                    '#dc3545'  // Red (Rejected)
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right' }
            }
        }
    });
    // --- Chart logic end ---

    // Clear current list
    jobList.innerHTML = '';

    // Loop through jobs amd create HTML cards
    data.data.forEach(job => {
        const div = document.createElement('div');
        div.classList.add('job-card');

        //Dynamic HTML
        div.innerHTML = `
            <div class="job-info">
                <h3>${job.company}</h3>
                <p>${job.position} <small>($${job.salaryExpectation || 0})</small></p>
            </div>
            <div class="job-actions">
                <select onchange="updateStatus('${job._id}', this.value)" class="status-select ${job.status.toLowerCase()}">
                    <option value="Applied" ${job.status === 'Applied' ? 'selected' : ''}>Applied</option>
                    <option value="Interviewing" ${job.status === 'Interviewing' ? 'selected' : ''}>Interviewing</option>
                    <option value="Offer" ${job.status === 'Offer' ? 'selected' : ''}>Offer</option>
                    <option value="Rejected" ${job.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                </select>
            
                <button class="delete-btn" onclick="deleteJob('${job._id}')">🗑️</button>
            </div>
            `;
        jobList.appendChild(div);
    });
}

// 4. Delete Job Function
async function deleteJob(id) {
    if (confirm('Are you sure you want to delete this job?')) {
        try {
            const res = await fetch(`/api/jobs/${id}`, {
                method: 'DELETE'
            });

            const data = await res.json();

            if (data.success) {
                // Refresh the list to remove the deleted item
                getJobs();
            } else {
                alert('Failed to delete Job');
            }

        } catch (error) {
            console.error('Error deleting Job', error);
        }
    }
}

// 5. Update Status Function
async function updateStatus(id, newStatus) {
    try {
        const res = await fetch(`/api/jobs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        const data = await res.json();

        if (data.success) {
            // Reload the list to update the Dashboard numbers immediately
            getJobs();
        } else {
            alert('Update failed');
        }
    } catch (error) {
        console.error('Error updating job:', error);
    }
}

// 6. Export to Excel (CSV)
function exportToCSV() {
    // 1. Get the raw data from the server again (or use a global variable)
    // For simplicity, let's just grab the data we already fetched.
    // NOTE: We need to ensure 'allJobs' is available. 
    // TRICK: We will fetch it fresh to be sure.

    fetch('/api/jobs')
        .then(res => res.json())
        .then(data => {
            const items = data.data;

            // 2. Define the Header Row
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "Company,Position,Salary,Status,Date\r\n"; // Column Names

            // 3. Loop through data and format as CSV rows
            items.forEach(job => {
                // Handle dates to look nice
                const date = new Date(job.dateApplied).toLocaleDateString();
                // Create a row: "Google,Analyst,90000,Applied,11/28/2025"
                const row = `${job.company},${job.position},${job.salaryExpectation},${job.status},${date}`;
                csvContent += row + "\r\n";
            });

            // 4. Create a fake download link and click it
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "my_career_data.csv");
            document.body.appendChild(link);
            link.click(); // Auto-click
            document.body.removeChild(link); // Cleanup
        });
}