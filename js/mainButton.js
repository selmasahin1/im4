class MainButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const href = this.getAttribute('href');
    const type = this.getAttribute('type') || 'button';
    const tag = href ? 'a' : 'button';

    this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-block;
          }
  
          a, button {
            display: flex; /* Makes width/height apply and centers text */
            justify-content: center;
            align-items: center;
  
            width: 70vw;
            height: 7vh;
            flex-shrink: 0;
            border-radius: 10px;
            background: #313C66;
            font-size: 60px;
            color: #F1F4FF;
            font-family: "Libre Franklin", sans-serif;
            text-decoration: none;
            border: none;
            box-sizing: border-box;
            cursor: pointer;
          }
  
          a:hover, button:hover {
            background-color: #5568AF;
          }
        </style>
        <${tag} ${href ? `href="${href}"` : `type="${type}"`}><slot></slot></${tag}>
      `;

    if (!href && type === 'submit') {
      this.shadowRoot.querySelector('button').addEventListener('click', () => {
        // Find nearest form and submit it
        const form = this.closest('form');
        if (form) form.requestSubmit(); // Modern and reliable way
      });
    }
  }
}

customElements.define('main-button', MainButton);
