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
function displayAttendanceRecords(records) {
    const container = document.getElementById('attendanceContainer');
    if (!container) return;

    console.log('Attendance records:', records);
    // Clear previous records
    container.innerHTML = '';

    if (!records || records.length === 0) {
        container.innerHTML = '<p>No attendance records for this date.</p>';
        return;
    }

    // Track users who have responded vs not responded
    const respondedUsers = {};
    const nonRespondedUsers = {};
    const allUsers = {};

    // First pass: create a map of all users
    records.forEach(record => {
        const userId = record.user_profiles_id;
        if (!allUsers[userId]) {
            allUsers[userId] = {
                firstName: record.first_name,
                lastName: record.last_name,
                hasResponded: false,
                attendance: {
                    Morning: null,
                    Midday: null,
                    Evening: null
                }
            };
        }

        // When processing attendance records
        if (record.time_of_day) {
            allUsers[userId].hasResponded = true;

            // If attendance is a number or string, use triple equals
            allUsers[userId].attendance[record.time_of_day] = record.attending === 1;

            console.log(`User ${userId}, ${record.time_of_day}: ${record.attendance} → ${allUsers[userId].attendance[record.time_of_day]}`);
        }
    });

    console.log('All users:', allUsers);

    // Second pass: separate responded vs non-responded users
    Object.entries(allUsers).forEach(([userId, userData]) => {
        if (userData.hasResponded) {
            respondedUsers[userId] = userData;
        } else {
            nonRespondedUsers[userId] = userData;
        }
    });

    // Display users who have responded
    displayRespondingUsers(respondedUsers);

    // Display users who haven't responded
    displayNonRespondingUsers(nonRespondedUsers);
}

// Display users who have responded
function displayRespondingUsers(users) {
    const container = document.getElementById('attendanceContainer');
    if (!container) return;

    if (Object.keys(users).length === 0) {
        return;
    }

    // Get template
    const template = document.getElementById('userAttendanceTemplate');

    console.log('Users with attendance:', users);
    // Create user attendance elements
    Object.values(users).forEach(user => {
        // Clone the template
        const userElement = template.content.cloneNode(true);

        // Set user data
        const initials = (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
        userElement.querySelector('.initials').textContent = initials;
        userElement.querySelector('.user-name').textContent = user.firstName;

        // Set attendance status for each time period
        const icons = userElement.querySelectorAll('.attendance-icon');
        icons.forEach(icon => {
            const time = icon.getAttribute('data-time');
            const isPresent = user.attendance[time] === true;

            // Wähle das passende Icon je nach Anwesenheit
            icon.src = isPresent
                ? `/resources/assets/${time}.svg`
                : `/resources/assets/${time}Light.svg`;
        });

        // Add to container
        container.appendChild(userElement);
    });
}

// Display users who haven't responded
function displayNonRespondingUsers(users) {
    const container = document.getElementById('noResponseContainer');
    if (!container) return;

    // Clear container
    container.innerHTML = '';

    if (Object.keys(users).length === 0) {
        // Hide the section divider
        const sectionDivider = document.querySelector('.section-divider');
        if (sectionDivider) {
            sectionDivider.style.display = 'none';
        }

        return;
    }

    // Get template
    const template = document.getElementById('noResponseTemplate');

    // Create elements for each non-responding user
    Object.values(users).forEach(user => {
        // Clone template
        const userElement = template.content.cloneNode(true);

        // Set user data
        const initials = (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
        userElement.querySelector('.initials').textContent = initials;
        userElement.querySelector('.user-name').textContent = user.firstName;

        // Add to container
        container.appendChild(userElement);
    });
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