class Header extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  async connectedCallback () {
    await this.render()
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      main{
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 1rem;
        margin: 0;
        padding: 0;
        font-family: inherit;
        color: inherit; 
      }
      
    </style>

    <header class="menu">
      <slot name="menu"></slot>
    </header>

  `
  }
}

customElements.define('header-component', Header)
