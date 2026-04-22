import { store } from '../../redux/store.js'
import { showFormElement } from '../../redux/crud-slice.js'

class CustomerTable extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = '/api/admin/customers'
    this.filterQuery = null
    this.unsubscribe = null
  }

  async connectedCallback () {
    this.unsubscribe = store.subscribe(() => {
      const currentState = store.getState()

      if (currentState.crud.filterQuery.query && currentState.crud.filterQuery.endPoint === this.endpoint) {
        this.filterQuery = currentState.crud.filterQuery.query
        const endpoint = `${this.endpoint}?${currentState.crud.filterQuery.query}`
        this.loadData(endpoint).then(() => this.render())
      }

      if (!currentState.crud.filterQuery.query && currentState.crud.tableEndpoint === this.endpoint) {
        this.loadData().then(() => this.render())
      }
    })

    await this.loadData()
    await this.render()
  }

  async loadData (endpoint = this.endpoint) {
    try {
      const response = await fetch(endpoint)

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`)
      }

      this.data = await response.json()
    } catch (error) {
      console.error('Error loading data:', error)
      this.data = null
    }
  }

  render () {
    if (!this.data || !this.data.meta || !this.data.rows) {
      this.shadow.innerHTML = '<p>Error al cargar los datos.</p>'
      return
    }

    this.shadow.innerHTML = /* html */`
      <style>
      *{
        box-sizing: border-box;
        font-family: "Nunito Sans", serif;
        font-optical-sizing: auto;
      }

      h1, h2, h3, h4, h5, h6, p{
        margin: 0;
      }

      h1, h2, h3, h4, h5, h6, p, a, span, li, label, input, button{
        font-family: "Nunito Sans", serif;
        font-optical-sizing: auto;
      }

      ul{
        list-style: none;
        margin: 0;
        padding: 0;
      }

      li{
        margin-top: 0;
      }

      button{
        background-color: transparent;
        border: none;
        cursor: pointer;
        outline: none;
        padding: 0;
      }

      .table {
        display:flex;
        flex-direction: column;
        gap: 1rem;
      }

      .table__header {
        display: flex;
        justify-content: flex-start; /* Icono alineado a la izquierda */
        background-color: hsl(0, 0.00%, 100.00%);
        height: 30px;
        border-radius: 5px;
      }

      .table__header-icon{
        margin-left: 5px;
      }

      .table__header-icon ,
      .edit-icon ,
      .delete-icon ,
      .clean-icon,
      .save-icon,
      .table-page-logo {
        width: 30px;
        height: 30px;
        fill: black;
      }

      .table__header-icon svg:hover,
      .edit-icon svg:hover,
      .delete-icon svg:hover,
      .table-page-logo{
       
        fill: hsl(0 , 0% , 25%);
      }

      .table__body {
        align-items: center;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
        min-height: 75vh;
        max-height: 75vh ;
        overflow-y: scroll;
        padding-right: 1rem;
      }

      .table__body::-webkit-scrollbar {
        width: 8px; /* ancho del scrollbar */
      }

      .table__body::-webkit-scrollbar-track {
        background: #e0e0e0; /* color del fondo de la barra */
        border-radius: 10px;
      }

      .table__body::-webkit-scrollbar-thumb {
        background:hsl(271, 75.80%, 52.90%); /* color azul del "pulgar" */
        border-radius: 10px;
      }

      .table__body::-webkit-scrollbar-thumb:hover {
        background:hsl(271, 75.80%, 52.90%); /* más oscuro al hacer hover */
      }

      .table__body-box {
        width: 90%;
      }

      .table-box__data {
        padding: 15px;
        background-color: hsl(0, 0.00%, 0.00%);
        border-radius: 0 0 10px 10px;
        color:hsl(0, 0.00%, 100.00%);
      }

      .table-box__upper-row {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 10px;
        background-color: hsl(0, 0.00%, 100.00%);
        border-radius: 10px 10px 0 0;
      }

      /* Footer de la tabla */
      .table__footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 10px;
        background-color: hsl(0, 0.00%, 100.00%);
        border-radius: 5px;
      }

      .table__footer-box {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
      }

      .table-page-info {
        text-align: left;
        color: rgb(0, 0, 0);
      }

      .pages{
        align-content: center;
        justify-items: center;
      }

      .pagination-button{
        width: 20px;
        height: 20px;
        fill: rgb(0, 0, 0);
        cursor: pointer;
      }

      .buttonPages{
        display: grid;
        grid-template-columns: repeat(5, 1fr);
      }

      .pagination-button.disabled{
        cursor: not-allowed;
      }

      .pagination-button.disabled svg {
        fill:hsl(271, 75.80%, 52.90%);
      }
      
      .tooltip {
        position: absolute;
        background-color: #4f46e5;
        color: #ffffff;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.875rem;
        white-space: nowrap;
        transform: translateY(-120%);
        margin-bottom: 0.25rem;
        opacity: 0;
        transition: opacity 0.2s ease;  
        z-index: 10;
      }

      .button {
        position: relative;
      }

      .button:hover .tooltip {
        opacity: 1;
      }
      </style>

      <section class="table">
        <div class="table__header">
          <div class="table__header-box">

            <button class="button filter-icon table__header-icon">
                <span class="tooltip">Filtrar</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12 12V19.88C12.04 20.18 11.94 20.5 11.71 20.71C11.32 21.1 10.69 21.1 10.3 20.71L8.29 18.7C8.06 18.47 7.96 18.16 8 17.87V12H7.97L2.21 4.62C1.87 4.19 1.95 3.56 2.38 3.22C2.57 3.08 2.78 3 3 3H17C17.22 3 17.43 3.08 17.62 3.22C18.05 3.56 18.13 4.19 17.79 4.62L12.03 12H12M17.75 21L15 18L16.16 16.84L17.75 18.43L21.34 14.84L22.5 16.25L17.75 21" />
                </svg>
            </button>
          </div>
        </div>
        <div class="table__body"></div>
        <div class="table__footer">
          <div class="table__footer-box">
            <div class="table-page-info">
              ${this.data.meta.total || 0} registro(s), mostrando ${this.data.meta.size || 0} por página.
            </div>
            <div class="buttonPages">
              <div class="button pagination-button ${this.data.meta.currentPage === 1 ? 'disabled' : ''}" data-page="1">
                <span class="tooltip">Principio</span>
                <svg viewBox="0 0 512 512" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M297.2,478l20.7-21.6L108.7,256L317.9,55.6L297.2,34L65.5,256L297.2,478z M194.1,256L425.8,34l20.7,21.6L237.3,256 l209.2,200.4L425.8,478L194.1,256z"></path></g></svg>
              </div>
              <div class="button pagination-button ${this.data.meta.currentPage === 1 ? 'disabled' : ''}" data-page="${this.data.meta.currentPage > 1 ? this.data.meta.currentPage - 1 : 1}">
                <span class="tooltip">Anterior</span>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" xml:space="preserve" transform="matrix(-1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="next"> <g> <polygon points="6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12 "></polygon> </g> </g> </g></svg>
              </div>
              <div class="pages">
                <p>${this.data.meta.currentPage} / ${this.data.meta.pages} </p>
              </div>
              <div class="button pagination-button ${this.data.meta.currentPage === this.data.meta.pages ? 'disabled' : ''}"  data-page="${this.data.meta.currentPage < this.data.meta.pages ? this.data.meta.currentPage + 1 : this.data.meta.currentPage}">
                <span class="tooltip">Siguiente</span>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" xml:space="preserve" transform="matrix(1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="next"> <g> <polygon points="6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12 "></polygon> </g> </g> </g></svg>
              </div>
              <div class="button pagination-button ${this.data.meta.currentPage === this.data.meta.pages ? 'disabled' : ''}" data-page=${this.data.meta.pages}>
                <span class="tooltip">Final</span>
                <svg viewBox="0 0 512 512" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" transform="matrix(-1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M297.2,478l20.7-21.6L108.7,256L317.9,55.6L297.2,34L65.5,256L297.2,478z M194.1,256L425.8,34l20.7,21.6L237.3,256 l209.2,200.4L425.8,478L194.1,256z"></path></g></svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    `

    this.data.rows.forEach(element => {
      const tableBody = this.shadow.querySelector('.table__body')
      const userBox = document.createElement('div')
      userBox.classList.add('table__body-box')
      tableBody.appendChild(userBox)

      const upperRow = document.createElement('div')
      upperRow.classList.add('table-box__upper-row')
      userBox.appendChild(upperRow)

      const editIcon = document.createElement('button')
      editIcon.classList.add('button', 'edit-icon')
      editIcon.dataset.id = element.id
      upperRow.appendChild(editIcon)
      editIcon.innerHTML = `
              <span class="tooltip">Editar</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
              </svg>`
      const deleteIcon = document.createElement('button')
      deleteIcon.classList.add('button', 'delete-icon')
      deleteIcon.dataset.id = element.id
      upperRow.appendChild(deleteIcon)
      deleteIcon.innerHTML = `
              <span class="tooltip">Eliminar</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
              </svg>`

      const data = document.createElement('div')
      data.classList.add('table-box__data')
      userBox.appendChild(data)

      const ul = document.createElement('ul')
      data.appendChild(ul)

      const name = document.createElement('li')
      const nameLabel = document.createElement('span')
      nameLabel.textContent = 'Nombre: '
      nameLabel.style.fontWeight = 'bold'
      name.appendChild(nameLabel)
      name.append(` ${element.name}`)
      ul.appendChild(name)

      const email = document.createElement('li')
      const emailLabel = document.createElement('span')
      emailLabel.textContent = 'Email: '
      emailLabel.style.fontWeight = 'bold'
      email.appendChild(emailLabel)
      email.append(` ${element.email}`)
      ul.appendChild(email)

      const createdAt = document.createElement('li')
      const createdAtLabel = document.createElement('span')
      createdAtLabel.textContent = 'Fecha de creación: '
      createdAtLabel.style.fontWeight = 'bold'
      createdAt.appendChild(createdAtLabel)
      createdAt.append(` ${element.createdAt}`)
      ul.appendChild(createdAt)

      const updatedAt = document.createElement('li')
      const updatedAtLabel = document.createElement('span')
      updatedAtLabel.textContent = 'Fecha de actualización: '
      updatedAtLabel.style.fontWeight = 'bold'
      updatedAt.appendChild(updatedAtLabel)
      updatedAt.append(` ${element.updatedAt}`)
      ul.appendChild(updatedAt)
    })

    this.renderButtons()
  }

  renderButtons () {
    this.shadow.querySelector('.table').addEventListener('click', async event => {
      if (event.target.closest('.edit-icon')) {
        const element = event.target.closest('.edit-icon')
        const id = element.dataset.id
        const endpoint = `${this.endpoint}/${id}`

        try {
          const response = await fetch(endpoint)

          if (response.status === 500 || response.status === 404) {
            throw response
          }

          const data = await response.json()

          const formElement = {
            endPoint: this.endpoint,
            data
          }

          store.dispatch(showFormElement(formElement))
        } catch (error) {
          document.dispatchEvent(new CustomEvent('notice', {
            detail: {
              message: 'No se han podido recuperar el dato',
              type: 'error'
            }
          }))
        }
      }

      if (event.target.closest('.delete-icon')) {
        const element = event.target.closest('.delete-icon')
        const id = element.dataset.id
        document.dispatchEvent(new CustomEvent('showDeleteModal', {
          detail: {
            endpoint: this.endpoint,
            elementId: id
          }
        }))
      }

      if (event.target.closest('.filter-icon')) {
        document.dispatchEvent(new CustomEvent('showFilterModal', {
          detail: {
            endpoint: this.endpoint
          }
        }))
      }

      if (event.target.closest('.pagination-button') && !event.target.closest('.pagination-button').classList.contains('.disabled')) {
        const page = event.target.closest('.pagination-button').dataset.page
        let endpoint = `${this.endpoint}?page=${page}`

        if (this.filterQuery) {
          endpoint = `${endpoint}&${this.filterQuery}`
        }

        this.loadData(endpoint).then(() => this.render())
      }
    })
  }
}

customElements.define('customer-table-component', CustomerTable)
