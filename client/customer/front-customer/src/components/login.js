class Login extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = '/api/admin/users/login'
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

      .bg {
          position: absolute;
          z-index: -1;
          height: 100dvh;
          width: 100%;
      }

      .main {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 80dvh;
          width: 30%;
          background-color: #1515157c;
          backdrop-filter: blur(5px);
          border-radius: 1rem;
          box-shadow: 0 0 10px #ffc4009c;
      }

      .logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
      }

      .logo img {
          height: 200px;
          width: auto;
      }

      .logo h1 {
          font-size: 2.5rem;
          color: #fff;
      }

      .logo span {
          background: linear-gradient(to right, #eeff00, #ff7300);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
      }

      .logo p {
          color: #a5a5a5;
          font-size: 1.1rem;
          margin-bottom: 2rem;
      }

      .login {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          width: 80%;
      }

      .login form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
      }

      .login input {
          padding: 1rem;
          border-radius: 1rem;
          border: 2px solid #ffffff1f;
          background-color: #252525;
          color: #fff;
          font-size: 1.1rem;
      }

      .login input:focus {
          outline: none;
          border-color: #ffc400;
      }

      .login .options {
          display: flex;
          justify-content: space-between;
          align-items: center;
      }

      .login .options .remember {
          display: flex;
          align-items: center;
          gap: 0.5rem;
      }

      .login .options .remember input {
          width: 1rem;
          height: 1rem;
      }

      .login .options .remember label {
          color: #d6d6d6;
          font-size: 1.1rem;
      }

      .login .options a {
          color: #ffc400;
          font-size: 1.1rem;
          text-decoration: none;
      }

      .login button {
          padding: 1rem;
          border-radius: 1rem;
          border: none;
          background-color: #ffc400;
          color: #000;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
      }

      .login button:hover {
          background-color: #ffc400a1;
      }

      .login button:active {
          transform: scale(0.98);
      }
  </style>

    <img class="bg" src="images/bg-login.webp">
    <section class="main">
        <div class="logo">
            <img src="images/logo.png">
            <h1>Benny's <span>Originals</span></h1>
            <p>Sistema de Gestión del mecánico</p>
        </div>
        <div class="login">
            <form>
                <input type="text" placeholder="Ingresa tu usuario">
                <input type="password" placeholder="Ingresa tu contraseña">
                <div class="options">
                    <div class="remember">
                        <input type="checkbox" id="remember">
                        <label for="remember">Recordarme</label>
                    </div>
                </div>
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    </section>
    `
    this.formEvent()
  }

  formEvent() {
    this.shadow.querySelector('form').addEventListener('submit', async (event) => {
      event.preventDefault()
      const name = this.shadow.querySelector('input[type="text"]').value
      const password = this.shadow.querySelector('input[type="password"]').value
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          password
        })
      })
      if (response.status === 200) {
        window.location.href = '/fichajes'
      }
    })
  }
}

customElements.define('login-component', Login)
