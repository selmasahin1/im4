document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.querySelector(".primary-button");
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

    const prevDateBtn = document.getElementById('prevDate');
    const nextDateBtn = document.getElementById('nextDate');

    if (prevDateBtn) {
        prevDateBtn.addEventListener('click', () => {
            changeDate(-1);
        });
    }

    if (nextDateBtn) {
        nextDateBtn.addEventListener('click', () => changeDate(1));
    }

    submitButton.addEventListener("click", async (event) => {
        event.preventDefault();

        const date = document.getElementById('date');
        const currentDate = new Date(date.getAttribute('data-date') || new Date());
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');

        const newDate = `${year}-${month}-${day}`;

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
        });

        if (attendanceData.length === 0) {
            alert("No valid attendance data selected.");
            return;
        }

        try {
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
                console.log(result);
            }

            alert("Attendance records successfully submitted!");
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while submitting attendance records.");
        }
    });

    // Dropdown Logik mit Text-Anpassung
    const dropdownButtons = document.querySelectorAll(".dropdown-button");
    dropdownButtons.forEach((button) => {
        const dropdownContent = button.nextElementSibling;

        button.addEventListener("click", (event) => {
            event.stopPropagation(); // Verhindert, dass das globale Click-Event sofort schließt

            // Schließe alle anderen Dropdowns
            document.querySelectorAll(".dropdown-content").forEach((dropdown) => {
                if (dropdown !== dropdownContent) {
                    dropdown.style.display = "none";
                }
            });

            // Öffne/Schließe das aktuelle Dropdown
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

    // Lade Anwesenheitsdaten für das aktuelle Datum
    const date = document.getElementById('date').getAttribute('data-date');
    loadAttendanceForDate(date);

    async function loadAttendanceForDate(date) {
        try {
            const response = await fetch(`api/attendance/getattendance.php?date=${date}`);
            const result = await response.json();

            if (result.status === "success" && result.data.length > 0) {
                result.data.forEach((entry) => {
                    const button = document.querySelector(`#${entry.time_of_day.toLowerCase()}`);
                    if (entry.attending === 1) {
                        button.textContent = "Ich bin da.";
                    } else {
                        button.textContent = "Ich bin nicht da.";
                    }
                    adjustButtonTextSize(button);
                });
            }
        } catch (error) {
            console.error("Error loading attendance data:", error);
        }
    }

    // Schriftgröße anpassen
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
});

document.addEventListener("click", function(event) {
    document.querySelectorAll(".dropdown-content").forEach((dropdown) => {
        // Schließe, wenn das Ziel nicht Teil des Dropdowns ist
        if (!dropdown.parentElement.contains(event.target)) {
            dropdown.style.display = "none";
        }
    });
});

function changeDate(delta) {
    const dateDisplay = document.getElementById('date');
    if (!dateDisplay) return;

    const currentDate = new Date(dateDisplay.getAttribute('data-date') || new Date());
    currentDate.setDate(currentDate.getDate() + delta);

    const newDate = currentDate.toISOString().split('T')[0];  // Hier wird `newDate` korrekt gesetzt
    const day = currentDate.getDate();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const readableDate = `${day}. ${month}`;

    dateDisplay.innerHTML = readableDate;
    dateDisplay.setAttribute('data-date', newDate);

    // Lade neue Daten für das geänderte Datum
    loadAttendanceForDate(newDate);
}
