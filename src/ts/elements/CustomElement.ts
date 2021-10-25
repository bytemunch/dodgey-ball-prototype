export class CustomElement extends HTMLElement {
    tempID: string = '';
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    applyStyle() {
        // walk inheritance tree to find all applicable styles
        let parentClass = Object.getPrototypeOf(Object.getPrototypeOf(this));
        let parentClassName = parentClass.constructor.name;

        let parentStyles = [];

        while (parentClassName !== 'HTMLElement') {
            let newStyle = document.createElement('link');
            newStyle.rel = "stylesheet";
            newStyle.href = `./styles/${parentClassName}.css`;

            parentStyles.push(newStyle);

            parentClass = Object.getPrototypeOf(parentClass);
            parentClassName = parentClass.constructor.name;
        }

        // reverse for correct priority
        parentStyles.reverse().forEach(style => this.shadowRoot.appendChild(style));

        let newStyle = document.createElement('link');
        newStyle.rel = "stylesheet";
        newStyle.href = `./styles/${this.constructor.name}.css`;
        this.shadowRoot.appendChild(newStyle);
    }

    connectedCallback() {
        this.applyStyle();

        const template = (<HTMLTemplateElement>document.querySelector(`#${this.tempID}-template`))?.content;

        if (template) this.shadowRoot.appendChild(template.cloneNode(true));
    }
}

customElements.define('ce-custom-element', CustomElement);