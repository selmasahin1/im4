document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.querySelector(".primary-button");
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString('default', { month: 'long' });
    const readableDate = `${day}. ${month}`;
    
    // Format today's date in YYYY-MM-DD format
    const formattedDate = today.toISOString().split('T')[0];

    // Display today's date in a readable format
    const dateDisplay = document.getElementById('date');
    if (dateDisplay) {
        dateDisplay.innerHTML = readableDate;
        // Add this line to set the data-date attribute initially
        dateDisplay.setAttribute('data-date', formattedDate);
    }

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

    submitButton.addEventListener("click", async (event) => {
        event.preventDefault();

        // Collect data from the dropdown menus
        const date = document.getElementById('date');

        const currentDate = new Date(date.getAttribute('data-date') || new Date());
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        
        const newDate = `${year}-${month}-${day}`;
        console.log('newDate', newDate)
        const dropdowns = [
            { id: "morning", time_of_day: "Morning", date: newDate },
            { id: "noon", time_of_day: "Midday", date: newDate },
            { id: "evening", time_of_day: "Evening", date: newDate },
        ];

        const attendanceData = [];

        dropdowns.forEach((dropdown) => {
            const selectedOption = document.querySelector(`#${dropdown.id}`).textContent.trim();

            if (selectedOption === "Ich bin da.") {
                attendanceData.push({ time_of_day: dropdown.time_of_day, attending: 1, date: dropdown.date });
            } else if (selectedOption === "Ich bin nicht da.") {
                attendanceData.push({ time_of_day: dropdown.time_of_day, attending: 0, date: dropdown.date });
            }
            // "Ich weiss es noch nicht." is ignored
        });

        if (attendanceData.length === 0) {
            alert("No valid attendance data selected.");
            return;
        }

        try {
            for (const entry of attendanceData) {
                // Create form data
                const formData = new URLSearchParams();
                formData.append('date', entry.date);
                formData.append('time_of_day', entry.time_of_day);
                formData.append('attending', entry.attending);
                
                const response = await fetch("api/attendance/createattendance.php", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded", // Use form encoding instead of JSON
                    },
                    body: formData, // Send form data instead of JSON
                });
                
                const result = await response.json();
                console.log(result);
            }

            alert("Attendance records successfully submitted!");
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while submitting attendance records.");
        }
    });

    // Add event listeners to dropdown buttons to update their text
    const dropdownButtons = document.querySelectorAll(".dropdown-button");
    dropdownButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const dropdownContent = button.nextElementSibling;
            dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";

            dropdownContent.querySelectorAll("a").forEach((option) => {
                option.addEventListener("click", (e) => {
                    e.preventDefault();
                    button.textContent = option.textContent.trim();
                    dropdownContent.style.display = "none";
                });
            });
        });
    });
});

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

}