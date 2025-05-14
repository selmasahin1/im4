document.addEventListener('DOMContentLoaded', async () => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const day = today.getDate();
    const month = today.toLocaleString('default', { month: 'long' });
    const readableDate = `${day}. ${month}`;

    // Display today's date in a readable format
    const dateDisplay = document.getElementById('date');
    if (dateDisplay) {
        dateDisplay.innerHTML = readableDate
    }

    // Fetch attendance data when page loads
    await fetchAttendance(formattedDate);

    // Set up date switcher buttons if they exist
    const prevDateBtn = document.getElementById('prevDate');
    const nextDateBtn = document.getElementById('nextDate');

    if (prevDateBtn) {
        prevDateBtn.addEventListener('click', () => {
            changeDate(-1);
            console.log('Previous date button clicked');
        });
    }

    if (nextDateBtn) {
        nextDateBtn.addEventListener('click', () => changeDate(1));
    }
});

// Function to fetch attendance data for a specific date
async function fetchAttendance(date) {
    try {
        const response = await fetch(`/api/attendance/readattendance.php?date=${date}`, {
            credentials: 'include' // Important: send cookies/session info
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'success') {
            displayAttendanceRecords(data.records, date);
            console.log('Attendance records:', data.records);
        } else {
            console.error('API returned error:', data.error);
            displayError('Failed to load attendance data');
        }
    } catch (error) {
        console.error('Error fetching attendance:', error);
        displayError('Failed to load attendance data');
    }
}

// Function to display attendance records
function displayAttendanceRecords(records, date) {
    const container = document.getElementById('attendanceContainer');
    if (!container) return;

    // Clear previous records
    container.innerHTML = '';

    if (records.length === 0) {
        container.innerHTML = '<p>No attendance records for this date.</p>';
        return;
    }

    container.innerHTML = records;
}

// Function to display error messages
function displayError(message) {
    const container = document.getElementById('attendanceContainer');
    if (container) {
        container.innerHTML = `<p class="error">${message}</p>`;
    }
}

// Function to change date (for prev/next buttons)
function changeDate(delta) {
    const dateDisplay = document.getElementById('date');
    if (!dateDisplay) return;
    console.log('date', dateDisplay)

    const currentDate = new Date(dateDisplay.getAttribute('data-date') || new Date());
    currentDate.setDate(currentDate.getDate() + delta);

    const newDate = currentDate.toISOString().split('T')[0];
    const day = currentDate.getDate();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const readableDate = `${day}. ${month}`;
    dateDisplay.innerHTML = readableDate;
    dateDisplay.setAttribute('data-date', newDate);

    fetchAttendance(newDate);
}