class Usuario extends HTMLElement
{
	constructor ()
	{
		super()
		this.shadow = this.attachShadow({ mode: 'open' })
	}

	async connectedCallback ()
	{
		await this.render()
		await this.loadProfile()
	}

	async loadProfile ()
	{
		const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/customer/profile`)

		if (response.ok) {
			const data = await response.json()

			const nameSpan = this.shadow.querySelector('.nameUser span')
			const emailSpan = this.shadow.querySelector('.emailUser span')

			if (nameSpan) nameSpan.textContent = data.name
			if (emailSpan) emailSpan.textContent = data.email
		}
	}

	render ()
	{
		this.shadow.innerHTML =
    /* html */`
    <style>
      .userLoged {
		background-color: #ffffff;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        position: fixed;
        bottom: 0;
        left: 0;
        margin: 20px;
        display: flex;
        gap: 1rem;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #000000;
        padding: 1rem;
        border-radius: 5px;
        max-width: 400px;
        min-width: 300px;
        width: auto;
    	}

			.user {
				display: flex;
				flex-direction: column;
				gap: 0.5rem;
			}

			.nameUser {
				font-weight: bold;
			}

			.emailUser {
				font-size: 0.8rem;
				color: #666;
			}

			.logout button {
				background-color: #f0f0f0;
				border: 1.5px solid #ffffffff;
				border-radius: 2rem;
				padding: 0.5rem;
				cursor: pointer;
			}

			.logout button:hover {
				background-color: #fa4949;
				border: 1.5px solid #f0f0f0;
			}

			.logout button svg {
				width: 24px;
				height: 24px;
			}
    </style>

    <section class="userLoged">
        <div class="user">
            <div class="nameUser">
                <span></span>
            </div>
            <div class="emailUser">
                <span></span>
            </div>
        </div>
        <div class="logout">
            <button>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z" />
                </svg>
            </button>
        </div>
    </section>
    `
		this.shadow.querySelector('.logout button').addEventListener('click', async () =>
		{
			const logout = await fetch('/api/auth/customer/logout', {
				method: 'DELETE'
			})
			window.location.href = '/login'
			console.log(logout)
		})
	}
}

customElements.define('usuario-component', Usuario)
