document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.querySelector(".primary-button");
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
        const date = document.querySelector("#date").value; // Assuming there's an input field with id="date"
        const dropdowns = [
            { id: "morning", time_of_day: "Morning" },
            { id: "noon", time_of_day: "Midday" },
            { id: "evening", time_of_day: "Evening" },
        ];

        const attendanceData = [];

        dropdowns.forEach((dropdown) => {
            const selectedOption = document.querySelector(`#${dropdown.id}`).textContent.trim();

            if (selectedOption === "Ich bin da.") {
                attendanceData.push({ time_of_day: dropdown.time_of_day, attending: 1 });
            } else if (selectedOption === "Ich bin nicht da.") {
                attendanceData.push({ time_of_day: dropdown.time_of_day, attending: 0 });
            }
            // "Ich weiss es noch nicht." is ignored
        });

        if (attendanceData.length === 0) {
            alert("No valid attendance data selected.");
            return;
        }

        try {
            for (const entry of attendanceData) {
                const response = await fetch("api/attendance/createattendance.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        date: date,
                        time_of_day: entry.time_of_day,
                        attending: entry.attending,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error:", errorData.error);
                    alert(`Error: ${errorData.error}`);
                    return;
                }
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