class Header extends HTMLElement {
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
                font-size: 5rem;
                font-weight: 500;
            }
        </style>
         <header>
            <h1>FamSync</h1>
         </header>
      `;
    }
}

customElements.define('main-header', Header);
