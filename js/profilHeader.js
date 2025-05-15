class ProfilHeader extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        // Template für den Button
        shadow.innerHTML = `
        <style>
            header {
                background: #313C66;
                width: 100%;
                height: 10vh;
                display: flex;
                justify-content: center;
                align-items: center;  
            }

            h1 {
                color: #F1F4FF;
                font-family: "Libre Franklin";
                font-weight: 500;
            }
            
            #profileLink {
                position: absolute;
                right: 20px;
            }
            
            #profileIcon {
                width: 60px;
                height: 60px;
            }

            #logo {
                width: 50px;
                position: absolute;
                left: 20px;
            }
        </style>
        <header>
            <img src="/resources/assets/LogoNeu.svg" alt="Logo" id="logo">
            <h1 id="familyname">Familie</h1>
            <a href="profile.html" id="profileLink">
                <img src="/resources/assets/User.svg" alt="Profil" id="profileIcon">
            </a>
        </header>
      `;

        // Fetch family name when component is created
        this.fetchFamilyName();
    }

    async fetchFamilyName() {
        try {
            const response = await fetch('/api/family/readfamily.php', {
                credentials: 'include' // Send session cookies
            });

            if (!response.ok) {
                throw new Error('Failed to fetch family name');
            }

            const data = await response.json();
            
            if (data.status === 'success') {
                // Update the family name in the component
                const familyNameElement = this.shadowRoot.getElementById('familyname');
                familyNameElement.textContent = data.family_name;
            }
        } catch (error) {
            console.error('Error fetching family name:', error);
        }
    }
}

customElements.define('profil-header', ProfilHeader);
