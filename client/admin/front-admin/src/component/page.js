class PageComponent extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.basePath = this.getAttribute('base-path') || ''
  }

  connectedCallback () {
    this.checkSignin()
    this.render()
    window.onpopstate = () => this.handleRouteChange()
  }

  handleRouteChange () {
    this.render()
  }

  render () {
    const path = window.location.pathname
    this.getTemplate(path)
  }

  async checkSignin(){
    try {
      const result = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/user/check-signin`, {
          headers: {
              'Content-Type': 'application/json'
          }
      })

      if (!result.ok) {
        const data = await result.json()
        window.location.href = data.redirection
      }
    } catch (error) {
        console.log(error)
    }
  }

  async getTemplate (path) {
    const routes = {
      '/admin/usuarios': 'users.html',
      '/admin/customers': 'customers.html',
      '/admin/eventos': 'eventos.html',
      '/admin/categorias-de-eventos': 'events-categories.html',
      '/admin/bots': 'bots.html',
      '/admin/promoters': 'promoters.html',
    }

    const filename = routes[path] || '404.html'

    await this.loadPage(filename)
  }

  async loadPage (filename) {
    const response = await fetch(`${this.basePath}/pages/${filename}`)
    const html = await response.text()

    document.startViewTransition(() => {
      this.shadowRoot.innerHTML = html
      document.documentElement.scrollTop = 0
    })
  }
}

customElements.define('page-component', PageComponent)
