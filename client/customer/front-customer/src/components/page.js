class PageComponent extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.basePath = this.getAttribute('base-path') || ''
  }

  async connectedCallback() {
    const canContinue = await this.checkSignin()

    if (!canContinue) return

    this.render()

    window.onpopstate = () => this.handleRouteChange()
  }

  async handleRouteChange() {
    const canContinue = await this.checkSignin()

    if (!canContinue) return

    this.render()
  }

  render() {
    const path = window.location.pathname
    this.getTemplate(path)
  }

  async checkSignin() {
    const publicRoutes = ['/', '/login', '/404']
    const currentPath = window.location.pathname
    const token = localStorage.getItem('token')

    if (publicRoutes.includes(currentPath)) {
      return true
    }

    if (!token) {
      window.location.href = '/'
      return false
    }

    return true
  }

  async getTemplate(path) {
    const routes = {
      '/': 'home.html',
      '/fichajes': 'fichajes.html',
      '/dashboard': 'dashboard.html',
      '/404': '404.html',
    }

    const filename = routes[path] || '404.html'

    await this.loadPage(filename)
  }

  async loadPage(filename) {
    const response = await fetch(`${this.basePath}/pages/${filename}`)
    const html = await response.text()

    document.startViewTransition(() => {
      this.shadowRoot.innerHTML = html
      document.documentElement.scrollTop = 0
    })
  }
}

customElements.define('page-component', PageComponent)