class Paneles extends HTMLElement
{
  constructor ()
  {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  async connectedCallback ()
  {
    await this.render()
  }

  render ()
  {
    this.shadow.innerHTML =
    /* html */`
    <style>
      .dashboard {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        padding: 24px;
        width: 80%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .panel {
        background-color: #ffffff;
        border: 2px solid #000;
        border-radius: 8px;
        padding: 14px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .panel-content h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 700;
        color: #000;
      }

      .panel-content p {
        margin: 4px 0 0;
        font-size: 13px;
        color: #555;
      }

      .panel-action {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: none;
        background-color: #f2f2f2;
        color: #000;
        font-size: 18px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .panel-action:hover {
        background-color: #e5e5e5;
      }

      .panel-action svg {
        width: 24px;
        height: auto;
      }
    </style>

    <div class="dashboard">
      <div class="panel">
        <div class="panel-content">
          <h3>Facturas</h3>
          <p>Gestiona y descarga tus facturas</p>
        </div>
        <button class="panel-action">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>
        </button>
      </div>
      <div class="panel">
        <div class="panel-content">
          <h3>Bots suscritos</h3>
          <p>Consulta tus bots activos</p>
        </div>
        <button class="panel-action">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>
        </button>
      </div>
    </div>


    `
  }
}

customElements.define('paneles-component', Paneles)
