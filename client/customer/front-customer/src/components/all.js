class All extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
    }

    async connectedCallback() {
        await this.render()
    }

    render() {
        this.shadow.innerHTML =
    /* html */`
    <style>
    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        font-family: Arial, Helvetica, sans-serif;
    }

    .all {
        height: 100dvh;
        display: grid;
        grid-template-columns: 20% 80%;
    }
    </style>
        <div class="all">
            <slot></slot>
        </div>
    `
    }
}

customElements.define('all-component', All)
