document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("editProfileForm");

    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault(); // Prevent default form submission

            const firstName = document.getElementById("firstname").value.trim();
            const lastName = document.getElementById("lastname").value.trim();

            if (!firstName || !lastName) {
                alert("Please fill in both first name and last name.");
                return;
            }

            try {
                const response = await fetch("/api/user_profile/updateuserprofile.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        first_name: firstName,
                        last_name: lastName,
                    }),
                });

                const result = await response.json();

                if (response.ok && result.status === "success") {
                    alert("Profile updated successfully!");
                    window.location.href = "profile.html";
                } else {
                    alert(result.error || "Failed to update profile.");
                }
            } catch (error) {
                console.error("Error updating profile:", error);
                alert("An error occurred while updating the profile.");
            }
        });
    }
});