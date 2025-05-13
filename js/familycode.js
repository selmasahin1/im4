document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("familycodeForm");
    const input = document.getElementById("familycode");
    const btnCreate = document.getElementById("newFamily");

    // Assign existing family code
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("Form submitted");

        const familycode = input.value.trim();
        if (!familycode) {
            alert("Bitte gib einen Familiencode ein.");
            return;
        }

        const response = await fetch("api/familycode.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Cache-Control": "no-cache"
            },
            credentials: "include",
            body: new URLSearchParams({
                action: "assign",
                familycode
            }),
        });


        const result = await response.json();
        console.log("JSON Ergebnis:", result);
        if (result.status === "success") {
            window.location.href = "home.html";
        } else {
            alert(result.message || "Ungültiger Familiencode.");
        }
    });

    // Create new family and assign user
    btnCreate.addEventListener("click", async () => {
        try {
            const response = await fetch("api/familycode.php", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Cache-Control": "no-cache"
                },
                body: new URLSearchParams({ action: "create" }),
            });

            const result = await response.json();
            if (result.status === "success") {
                const code = encodeURIComponent(result.familycode);
                window.location.href = `newfamily.html?code=${code}`;
            } else {
                alert(result.message || "Erstellen der Familie fehlgeschlagen.");
            }
        } catch (error) {
            console.error("Fehler beim Erstellen der Familie:", error);
            alert("Ein Fehler ist aufgetreten. Bitte versuch es erneut.");
        }
    });
});
