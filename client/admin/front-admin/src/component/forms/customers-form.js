import isEqual from 'lodash-es/isEqual'
import { store } from '../../redux/store.js'
import { refreshTable, showFormElement } from '../../redux/crud-slice.js'

class CustomerForm extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = '/api/admin/customers'
    this.unsubscribe = null
    this.formElementData = null
  }

  connectedCallback () {
    this.unsubscribe = store.subscribe(() => {
      const currentState = store.getState()

      if (currentState.crud.formElement.data && currentState.crud.formElement.endPoint === this.endpoint && !isEqual(this.formElementData, currentState.crud.formElement.data)) {
        this.formElementData = currentState.crud.formElement.data
        this.showElement(this.formElementData)
      }

      if (!currentState.crud.formElement.data && currentState.crud.formElement.endPoint === this.endpoint) {
        this.resetForm()
      }
    })

    this.render()
  }

  render () {
    this.shadow.innerHTML = /* html */`
      <style>

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Nunito Sans", serif;
        }

        /* SECTION FORM */
        .toolbar {
          padding-right: 1rem;
          align-items: center;
          border-radius: 5px;
          height: 2rem;
          width: 100%;
          display: flex;
          justify-content: space-between;
          background-color: hsl(0, 0%, 100%);
        }

        .toolbarSVGs {
          display: flex;
          gap: 1rem;
          padding: 0 0.5rem;
        }

        .toolbarSVGs svg {
          width: 2rem;
          height: 2rem;
          cursor: pointer;
          color: hsl(271, 76%, 53%);
        }

        .tabs{
          display: flex;
          height: 100%;
        }

        /* ESTILO BOTON GENERAL TOOLBAR */

        .tab{
          align-items: center;
          cursor: pointer;
          display: flex;
          height: 100%;
          padding: 0 0.5rem;
        }

        .tab{
          color: hsl(271, 76%, 53%);
          font-weight: 600;
        }

        .active-tab{
          color: hsl(0, 0%, 100%);
          background-color: hsl(271, 76%, 53%);

        }

        .tab-content{
          
        }

   
        /* SECTION MAIN */

        .tab-content {
          display: none;
        }

        .tab-content.active{
          display: flex;
          gap: 2rem; 
          justify-self: center;
          width: 95%;
        }

        .fieldGroup {
          display: flex;
          flex-direction: column;
          flex: 1; 
        }

        .sectionMain input {
          padding: 0.5rem;
          border-radius: 5px;
          font-family: Verdana, Geneva, Tahoma, sans-serif;
          border: none;
          width: 100%;
        }
        .sectionMain label{
          color: hsl(0, 0%, 100%);
          font-family: Verdana, Geneva, Tahoma, sans-serif;
          padding: 1rem 0 1rem 0;
        }
        
        .button{
          align-items: center;
          display: flex;
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

      .v-active input{
        border: 1px solid red;
        background-color:rgb(255, 225, 143);
      }

   

      .validation-errors{
        display: none;
        color: #fff;
        background-color: #585858;
        padding: 2rem 1rem;
        margin-top: 1rem;
        border: 2px solid #fff;
        border-radius: 0.5rem;
        position: relative;
      }

      .validation-errors.active{
        display: block;
      }

      .validation-errors ul{
        list-style: none;
      }

      .validation-errors p{
        font-weight: 700;
        font-size: 1.2rem;
      }

      .validation-errors .close-validation-errors{
        cursor: pointer;
        position: absolute;
        right: 0.5rem;
        top: 0.5rem;
      }

      .close-validation-errors svg{
        fill: hsl(100, 100%, 100%);
        height: 2rem;
        width: 2rem;
      }
      </style>
      <div class="form">
        <div class="toolbar">
          <div class="tabs">
            <div class="tab active-tab" data-tab="general">
              <span>General</span>
            </div>
            <div class="tab" data-tab="images">
              <span>Imágenes</span>
            </div>
          </div>
          <div class="toolbarSVGs">
            <div class="button clean-button">
              <span class="tooltip">Limpiar</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 24 24">
                <path fill="none" stroke="#000000" stroke-width="2"
                  d="M10,4 C10,2.8954305 10.8954305,2 12,2 C13.1045695,2 14,2.8954305 14,4 L14,10 L20,10 L20,14 L4,14 L4,10 L10,10 L10,4 Z 
                    M4,14 L20,14 L20,22 L12,22 L4,22 L4,14 Z 
                    M16,22 L16,16.3646005 M8,22 L8,16.3646005 M12,22 L12,16.3646005"/>
              </svg>
            </div>
            <div class="button save-button">
              <span class="tooltip">Guardar</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 32 32">
                <path fill="none" stroke="#000000" stroke-width="2"
                  d="M4 4 H28 V28 H4 Z
                    M10 4 V12 H22 V4
                    M10 28 V20
                    M16 28 V20
                    M22 28 V20" />
              </svg>
            </div>
          </div>
        </div>
        <div class="sectionMain">
          <div class="validation-errors">
            <p>Error en la validación, revisa los siguientes errores: </p>
            <ul></ul>
            <div class="button close-validation-errors">
              <span class="tooltip">Cerrar</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z" /></svg>
            </div>
          </div>
          <form>
            <input type="hidden" name="id">
            <div class="tab-content active" data-tab="general">
              <div class="fieldGroup">
                <label for="name">Nombre</label>
                <input type="text" id="name" name="name">
              </div>
              <div class="fieldGroup">
                <label for="email">Email</label>
                <input type="text" id="email" name="email">
              </div>
            </div>
            <div class="tab-content" data-tab="images">
              <div class="fieldGroup">
                <label for="image">Imagen</label>
                <input type="file" id="image" name="image">
              </div>
            </div>
          </form>
        </div>
      </div>
    `

    this.renderButtons()
  }

  renderButtons () {
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault()
      }
    })

    this.shadow.querySelector('.form').addEventListener('click', async event => {
      event.preventDefault()

      if (event.target.closest('.save-button')) {
        const form = this.shadow.querySelector('form')

        const formDataJson = {}

        for (const [key, value] of new FormData(form).entries()) {
          formDataJson[key] = value !== '' ? value : null
        }

        const id = this.shadow.querySelector('[name="id"]').value
        const endpoint = id ? `${this.endpoint}/${id}` : this.endpoint
        const method = id ? 'PUT' : 'POST'
        delete formDataJson.id

        try {
          const response = await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formDataJson)
          })

          if (!response.ok) throw response

          store.dispatch(showFormElement({
            endPoint: this.endpoint,
            data: null
          }))

          store.dispatch(refreshTable(this.endpoint))

          this.resetForm()

          document.dispatchEvent(new CustomEvent('notice', {
            detail: { message: 'Datos guardados correctamente', type: 'success' }
          }))
        } catch (error) {
          if (error.status === 422) {
            const data = await error.json()
            this.showValidationErrors(data.message)

            document.dispatchEvent(new CustomEvent('notice', {
              detail: { message: 'Hay errores de validación', type: 'error' }
            }))
          } else if (error.status === 500) {
            document.dispatchEvent(new CustomEvent('notice', {
              detail: { message: 'No se han podido guardar los datos', type: 'error' }
            }))
          }
        }
      }

      if (event.target.closest('.tab')) {
        const clickedTab = event.target.closest('.tab')

        this.shadow.querySelector('.tab.active-tab')?.classList.remove('active-tab')
        clickedTab.classList.add('active-tab')

        this.shadow.querySelector('.tab-content.active')?.classList.remove('active')
        this.shadow.querySelector(`.tab-content[data-tab='${clickedTab.dataset.tab}']`).classList.add('active')
      }

      if (event.target.closest('.clean-button')) {
        this.resetForm()
      }

      if (event.target.closest('.close-validation-errors')) {
        this.closeValidationErrors()
      }
    })
  }

  showElement (data) {
    Object.entries(data).forEach(([key, value]) => {
      const input = this.shadow.querySelector(`[name="${key}"]`)
      if (input) input.value = value
    })
  }

  showValidationErrors (errors) {
    const errorsContainer = this.shadow.querySelector('.validation-errors')
    const errorsList = this.shadow.querySelector('.validation-errors ul')
    errorsList.innerHTML = ''

    errors.forEach(error => {
      const errorMessage = document.createElement('li')
      errorMessage.textContent = error.message
      errorsList.appendChild(errorMessage)
    })

    errorsContainer.classList.add('active')
  }

  closeValidationErrors () {
    this.shadow.querySelector('.validation-errors').classList.remove('active')
  }

  resetForm () {
    const form = this.shadow.querySelector('form')
    form.reset()
    this.shadow.querySelector('[name="id"]').value = ''
    this.formElementData = null
    this.closeValidationErrors()
  }
}

customElements.define('customers-form-component', CustomerForm)
