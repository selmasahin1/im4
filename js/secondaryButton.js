class SecondaryButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const href = this.getAttribute('href');
    const tag = href ? 'a' : 'button';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }

        a, button {
          display: flex;
          justify-content: center;
          align-items: center;

          width: 60vw;
          height: 7vh;
          flex-shrink: 0;
          border-radius: 10px;
          background: #EFF1F9;
          font-size: 48px;
          font-weight: 500;
          color: #313C66;
          font-family: "Libre Franklin", sans-serif;
          fill: #EFF1F9;
          stroke-width: 4px;
          stroke: var(--Blau, #313C66);
          text-decoration: none;
          border: none;
          box-sizing: border-box;
          cursor: pointer;
        }

        a:hover, button:hover {
          background-color: #5568AF;
          color: #EFF1F9;
        }
      </style>
      <${tag} ${href ? `href="${href}"` : ''}><slot></slot></${tag}>
    `;
  }
}

customElements.define('secondary-button', SecondaryButton);
