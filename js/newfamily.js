document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
        // Display the code in the element
        document.getElementById("familycode").innerHTML = code;
    }
    
    // Copy to clipboard functionality
    const copyBtn = document.getElementById("copy");
    copyBtn.addEventListener("click", () => {
        // Get the code
        const codeText = document.getElementById("familycode").textContent;
        
        // Copy to clipboard
        navigator.clipboard.writeText(codeText)
            .then(() => {
                // Create notification element
                const notification = document.createElement("div");
                notification.style.position = "fixed";
                notification.style.bottom = "20px";
                notification.style.left = "50%";
                notification.style.transform = "translateX(-50%)";
                notification.style.backgroundColor = "#313C66";
                notification.style.color = "white";
                notification.style.padding = "60px 55px";
                notification.style.borderRadius = "5px";
                notification.style.zIndex = "1000";
                notification.style.width = "75%";
                notification.style.boxSizing = "border-box";
                notification.style.display = "flex";
                notification.style.alignItems = "center";
                notification.style.fontSize = "3rem";
                notification.style.fontFamily = "Libre Franklin";
                notification.style.opacity = "0.7";
                
                // Add check icon
                const checkIcon = document.createElement("img");
                checkIcon.src = "/resources/assets/Check.svg"; // Adjust path as needed
                checkIcon.style.width = "60px";
                checkIcon.style.height = "60px";
                checkIcon.style.marginRight = "10px";
                
                // Add text node
                const textNode = document.createTextNode("Der Code wurde kopiert");
                
                // Append elements
                notification.appendChild(checkIcon);
                notification.appendChild(textNode);
                document.body.appendChild(notification);
                
                // Remove after 5 seconds
                setTimeout(() => {
                    notification.style.opacity = "0";
                    notification.style.transition = "opacity 0.5s";
                    setTimeout(() => {
                        document.body.removeChild(notification);
                    }, 500);
                }, 5000);
            })
            .catch(err => {
                console.error("Failed to copy: ", err);
            });
    });
});