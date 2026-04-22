import { store } from '../../redux/store.js'
import { setFilterQuery } from '../../redux/crud-slice.js'
class UserFilter extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = '/api/admin/users'
    this.tableEndpoint = ''
    document.addEventListener('showFilterModal', this.showFilterModal.bind(this))
  }

  async connectedCallback () {
    this.render()
  }

  showFilterModal (event) {
    if (event.detail.endpoint === this.endpoint) {
      this.shadow.querySelector('.overlay').classList.add('active')
    }
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
    <style>
      *{
        font-family: "Nunito Sans", serif;
        box-sizing: border-box;
      }

      .overlay{
        align-items: center;
        background-color: hsl(0, 0%, 0%, 0.7);
        display: flex;
        flex-direction: column;
        height: 100vh;
        justify-content: center;
        left: 0;
        position: fixed;
        top: 0;
        width: 100%;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s, visibility 0.3s;
      }

      .overlay.active{
        opacity: 1;
        visibility: visible;
      }

      .validate {
        background-color: #fff;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        text-align: center;
        gap: 2rem;
        width: 25%;
      }

      .option-buttons{
        display: flex;
        justify-content: space-around;
        align-items: center;
      }

      .sectionMain{
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(20%, 1fr));
          gap:1rem;
        }
        .sectionMain form {
          justify-self: center;
          width: 95%;
          display: flex;
          gap: 2rem; 
        }

        .fieldGroup {
          display: flex;
          flex-direction: column;
          flex: 1; 
        }

        .sectionMain input {
          padding: 0.5rem;
          border-radius: 5px;
          color: #000;
          border: 1px solid #dbdbdb;
          width: 100%;
        }
        .sectionMain label{
          color: #000;
          padding: 1rem 0 1rem 0;
          border: 0px;
        }
    </style>

    <div class="overlay">
      <section class="validate">
        <div calss= "notice-info">
          <span>Escoge los datos por los que filtrar</span>
        </div>
        <div class="sectionMain">
          <form>
            <input type="hidden" name="id">
            <div class="fieldGroup">
              <label for="name">Nombre</label>
              <input type="text" id="name" name="name">
            </div>
            <div class="fieldGroup">
              <label for="email">Email</label>
              <input type="text" id="email" name="email">
            </div>
          </form>
        </div>
        <div class="option-buttons">
          <div class="acepted-button">
            <button class="acepted-button">Filtrar</button>
          </div>
          <div class="denied-button">
            <button>Cancelar</button>
          </div> 
        </div> 
      </section>
    </div>
    `
    this.renderButtons()
  }

  renderButtons () {
    const aceptedButton = this.shadow.querySelector('.acepted-button')
    const deniedButton = this.shadow.querySelector('.denied-button')

    aceptedButton.addEventListener('click', async () => {
      const form = this.shadow.querySelector('form')
      const formData = new FormData(form)
      const formDataJson = {}

      for (const [key, value] of formData.entries()) {
        formDataJson[key] = value !== '' ? value : null
      }

      const query = Object.entries(formDataJson).map(([key, value]) => `${key}=${value}`).join('&')

      const filterQuery = {
        endPoint: this.endpoint,
        query
      }

      store.dispatch(setFilterQuery(filterQuery))

      this.shadow.querySelector('.overlay').classList.remove('active')
    })

    deniedButton.addEventListener('click', event => {
      const form = this.shadow.querySelector('form')
      form.reset()

      const formData = new FormData(form)
      const formDataJson = {}

      for (const [key, value] of formData.entries()) {
        formDataJson[key] = value !== '' ? value : null
      }

      const query = Object.entries(formDataJson).map(([key, value]) => `${key}=${value}`).join('&')

      const filterQuery = {
        endPoint: this.endpoint,
        query
      }

      store.dispatch(setFilterQuery(filterQuery))

      this.shadow.querySelector('.overlay').classList.remove('active')
    })
  }
}

customElements.define('users-filter-component', UserFilter)
