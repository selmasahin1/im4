document.addEventListener("DOMContentLoaded", () => {
    initializeDateDisplay();
    setupDateSwitcher();
    setupSubmitButton();
    setupDropdownLogic();
    loadAttendanceForDate(getCurrentDate());
    setupGlobalClickListener();
});

// Initialize the date display
function initializeDateDisplay() {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString('default', { month: 'long' });
    const readableDate = `${day}. ${month}`;
    const formattedDate = today.toISOString().split('T')[0];

    const dateDisplay = document.getElementById('date');
    if (dateDisplay) {
        dateDisplay.innerHTML = readableDate;
        dateDisplay.setAttribute('data-date', formattedDate);
    }
}

// Set up date switcher buttons
function setupDateSwitcher() {
    const prevDateBtn = document.getElementById('prevDate');
    const nextDateBtn = document.getElementById('nextDate');

    if (prevDateBtn) {
        prevDateBtn.addEventListener('click', () => changeDate(-1));
    }

    if (nextDateBtn) {
        nextDateBtn.addEventListener('click', () => changeDate(1));
    }
}

// Handle date changes
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


    loadAttendanceForDate(newDate);
}

// Set up the submit button
function setupSubmitButton() {
    const submitButton = document.querySelector(".primary-button");
    submitButton.addEventListener("click", async (event) => {
        event.preventDefault();

        const date = getCurrentDate();
        const attendanceData = collectAttendanceData(date);

        if (attendanceData.length === 0) {
            alert("No valid attendance data selected.");
            return;
        }

        try {
            await submitAttendanceData(attendanceData);
            alert("Attendance records successfully submitted!");
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while submitting attendance records.");
        }
    });
}

// Get the current date from the date display
function getCurrentDate() {
    const date = document.getElementById('date');
    return date.getAttribute('data-date') || new Date().toISOString().split('T')[0];
}

// Collect attendance data from dropdowns
function collectAttendanceData(date) {
    const dropdowns = [
        { id: "morning", time_of_day: "Morning", date },
        { id: "midday", time_of_day: "Midday", date },
        { id: "evening", time_of_day: "Evening", date },
    ];

    const attendanceData = [];
    dropdowns.forEach((dropdown) => {
        const selectedOption = document.querySelector(`#${dropdown.id}`).textContent.trim();

        if (selectedOption === "Ich bin da.") {
            attendanceData.push({ time_of_day: dropdown.time_of_day, attending: 1, date: dropdown.date });
        } else if (selectedOption === "Ich bin nicht da.") {
            attendanceData.push({ time_of_day: dropdown.time_of_day, attending: 0, date: dropdown.date });
        }
    });

    return attendanceData;
}

// Submit attendance data to the server
async function submitAttendanceData(attendanceData) {
    for (const entry of attendanceData) {
        const formData = new URLSearchParams();
        formData.append('date', entry.date);
        formData.append('time_of_day', entry.time_of_day);
        formData.append('attending', entry.attending);

        const response = await fetch("api/attendance/createattendance.php", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData,
        });

        const result = await response.json();
    }
}

// Set up dropdown logic
function setupDropdownLogic() {
    const dropdownButtons = document.querySelectorAll(".dropdown-button");
    dropdownButtons.forEach((button) => {
        const dropdownContent = button.nextElementSibling;

        button.addEventListener("click", (event) => {
            event.stopPropagation();

            document.querySelectorAll(".dropdown-content").forEach((dropdown) => {
                if (dropdown !== dropdownContent) {
                    dropdown.style.display = "none";
                }
            });

            dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
        });

        dropdownContent.querySelectorAll("a").forEach((option) => {
            option.addEventListener("click", (e) => {
                e.preventDefault();
                button.textContent = option.textContent.trim();
                dropdownContent.style.display = "none";
                button.classList.add('selected');
                adjustButtonTextSize(button);
            });
        });
    });
}

// Load attendance data for a specific date
async function loadAttendanceForDate(date) {
    try {
        const response = await fetch(`api/attendance/readAttendanceForDate.php?date=${date}`);
        const result = await response.json();

        if (result.length > 0) {
            result.forEach((entry) => {
                const button = document.querySelector(`#${entry.time_of_day.toLowerCase()}`);
                if (entry.attending === 1) {
                    button.textContent = "Ich bin da.";
                } else if (entry.attending === 0) {
                    button.textContent = "Ich bin nicht da.";
                } else {
                    button.textContent = "Ich weiss es nicht.";
                }
                adjustButtonTextSize(button);
            });
        } else {
            const buttons = document.querySelectorAll(".dropdown-button");
            buttons.forEach((button) => {
                button.textContent = "Auswahl";
                adjustButtonTextSize(button);
            });
        }
    } catch (error) {
        console.error("Error loading attendance data:", error);
    }
}

// Adjust button text size dynamically
function adjustButtonTextSize(button) {
    let fontSize = 60;
    button.style.fontSize = `${fontSize}px`;
    button.style.whiteSpace = 'normal';
    button.style.wordBreak = 'break-word';

    const maxHeight = parseFloat(getComputedStyle(button).height);
    const maxWidth = parseFloat(getComputedStyle(button).width);

    const tester = document.createElement("div");
    tester.style.position = "absolute";
    tester.style.visibility = "hidden";
    tester.style.width = `${maxWidth}px`;
    tester.style.fontFamily = getComputedStyle(button).fontFamily;
    tester.style.fontWeight = getComputedStyle(button).fontWeight;
    tester.style.lineHeight = "1.2";
    tester.style.padding = "0";
    tester.style.border = "none";
    tester.style.whiteSpace = "normal";
    tester.style.wordBreak = "break-word";
    tester.innerText = button.textContent;
    document.body.appendChild(tester);

    while ((tester.offsetHeight > maxHeight || tester.offsetWidth > maxWidth) && fontSize > 10) {
        fontSize -= 2;
        tester.style.fontSize = `${fontSize}px`;
    }

    button.style.fontSize = `${fontSize}px`;
    document.body.removeChild(tester);
}

// Set up a global click listener to close dropdowns
function setupGlobalClickListener() {
    document.addEventListener("click", function (event) {
        document.querySelectorAll(".dropdown-content").forEach((dropdown) => {
            if (!dropdown.parentElement.contains(event.target)) {
                dropdown.style.display = "none";
            }
        });
    });
}
