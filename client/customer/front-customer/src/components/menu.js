class Menu extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
    }

    async connectedCallback() {
        await this.render()
        this.setActive()
        this.addEventListeners()
    }

    setActive() {
        const path = window.location.pathname
        const items = this.shadow.querySelectorAll('nav li:not(.logout)')
        items.forEach(li => {
            if (li.dataset.path === path) {
                li.classList.add('active')
            } else {
                li.classList.remove('active')
            }
        })
    }

    addEventListeners() {
        const items = this.shadow.querySelectorAll('nav li:not(.logout)')
        items.forEach(li => {
            li.addEventListener('click', () => {
                if (li.dataset.path) {
                    window.history.pushState({}, '', li.dataset.path)
                    window.dispatchEvent(new Event('popstate'))
                }
            })
        })

        const logout = this.shadow.querySelector('.logout')
        if (logout) {
            logout.addEventListener('click', () => {
                // Perform logout logic here, then redirect
                window.location.href = '/'
            })
        }
    }

    render() {
        this.shadow.innerHTML =
    /* html */`
    <style>
        .lateralMenu {
            height: 100dvh;
            background-color: #1a1a1a;
            border-right: 2px solid #383838;
        }
        .headerMenu {
            padding: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
        }

        .headerMenu img {
            height: auto;
            width: 100px;
            background-color: #000;
            border-radius: 1rem;
            border: 2px solid #383838;
        }

        .headerMenu span {
            font-weight: 600;
            font-size: 1.5rem;
            color: #fff;
        }

        nav ul {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding: 1rem 2rem;
        }

        nav li {
            display: flex;
            gap: 1rem;
            color: white;
            align-items: center;
            padding: 1rem;
            font-weight: 600;
            border-radius: 1rem;
            cursor: pointer;
        }

        nav li:hover {
            background-color: #272727;
        }

        li.active {
            background-color: #ffc40054;
            border: 2px solid #ffc400;
            color: #ffc400;
        }

        li.active:hover {
            background-color: #ffc40054;
            border: 2px solid #ffc400;
            color: #ffc400;
        }

        nav svg {
            height: auto;
            width: 40px;
        }

        .logout {
            background-color: #ff000054;
            border: 2px solid #ff5757;
            color: #ff5757;
        }

        .logout:hover {
            background-color: #ff5757;
            border: 2px solid #ff5757;
            color: #fff;
        }
    </style>

        <section class="lateralMenu">
            <div class="headerMenu">
                <img src="images/logo.png">
                <span>Benny's Originals</span>
            </div>
            <nav>
                <ul>
                    <li data-path="/fichajes">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
                                <path
                                    d="M1 10h1.389v7a.5.5 0 0 0 .5.5H16.11a.5.5 0 0 0 .5-.5v-7H18a.5.5 0 0 0 .33-.875l-8.5-7.5a.5.5 0 0 0-.66 0l-8.5 7.5A.5.5 0 0 0 1 10m1.889-1h-.567L9.5 2.667L16.678 9h-.567a.5.5 0 0 0-.5.5v7H3.39v-7a.5.5 0 0 0-.5-.5" />
                                <path
                                    d="M10.708 11.5h-2.5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1m-2.5 5v-4h2.5v4z" />
                            </g>
                        </svg>
                        <span>Fichajes</span>
                    </li>
                    <li data-path="/dashboard">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15">
                            <path fill="currentColor"
                                d="M5.25 8c.228 0 .426 0 .6.042a1.5 1.5 0 0 1 1.11 1.107c.04.175.04.373.04.601v2.5c0 .228 0 .426-.041.6a1.5 1.5 0 0 1-1.109 1.11c-.174.04-.372.04-.6.04h-2.5c-.228 0-.426 0-.6-.041a1.5 1.5 0 0 1-1.108-1.108C1 12.676 1 12.478 1 12.25v-2.5c0-.228 0-.426.042-.6a1.5 1.5 0 0 1 1.107-1.108C2.324 8 2.522 8 2.75 8zm7 0c.228 0 .426 0 .6.042a1.5 1.5 0 0 1 1.109 1.107c.042.175.041.373.041.601v2.5c0 .228 0 .426-.041.6a1.5 1.5 0 0 1-1.108 1.109c-.175.042-.373.041-.601.041h-2.5c-.228 0-.426 0-.6-.041a1.5 1.5 0 0 1-1.108-1.108C8 12.676 8 12.478 8 12.25v-2.5c0-.228 0-.426.042-.6a1.5 1.5 0 0 1 1.107-1.108C9.324 8 9.522 8 9.75 8zM2.8 9c-.307 0-.373.003-.416.014a.5.5 0 0 0-.37.37c-.01.043-.014.11-.014.416v2.4c0 .308.003.374.014.417a.5.5 0 0 0 .37.37c.043.01.11.013.416.013h2.4c.308 0 .374-.003.417-.014a.5.5 0 0 0 .37-.369c.01-.043.013-.11.013-.417V9.8c0-.307-.003-.373-.014-.416a.5.5 0 0 0-.369-.37C5.574 9.004 5.507 9 5.2 9zm7 0c-.307 0-.373.003-.416.014a.5.5 0 0 0-.37.37c-.01.043-.014.11-.014.416v2.4c0 .308.003.374.014.417a.5.5 0 0 0 .37.37c.043.01.11.013.416.013h2.4c.308 0 .374-.003.417-.014a.5.5 0 0 0 .37-.369c.01-.043.013-.11.013-.417V9.8c0-.307-.004-.373-.014-.416a.5.5 0 0 0-.369-.37c-.043-.01-.11-.014-.417-.014zM5.25 1c.228 0 .426 0 .6.042a1.5 1.5 0 0 1 1.11 1.107c.04.175.04.373.04.601v2.5c0 .228 0 .426-.041.6A1.5 1.5 0 0 1 5.85 6.96c-.174.04-.372.04-.6.04h-2.5c-.228 0-.426 0-.6-.041A1.5 1.5 0 0 1 1.041 5.85C1 5.676 1 5.478 1 5.25v-2.5c0-.228 0-.426.042-.6a1.5 1.5 0 0 1 1.107-1.108C2.324 1 2.522 1 2.75 1zm7 0c.228 0 .426 0 .6.042a1.5 1.5 0 0 1 1.109 1.107c.042.175.041.373.041.601v2.5c0 .228 0 .426-.041.6a1.5 1.5 0 0 1-1.109 1.11c-.174.04-.372.04-.6.04h-2.5c-.228 0-.426 0-.6-.041A1.5 1.5 0 0 1 8.041 5.85C8 5.676 8 5.478 8 5.25v-2.5c0-.228 0-.426.042-.6a1.5 1.5 0 0 1 1.107-1.108C9.324 1 9.522 1 9.75 1zM2.8 2c-.307 0-.373.003-.416.014a.5.5 0 0 0-.37.37c-.01.043-.014.11-.014.416v2.4c0 .308.003.374.014.417a.5.5 0 0 0 .37.37c.043.01.11.013.416.013h2.4c.308 0 .374-.003.417-.014a.5.5 0 0 0 .37-.369c.01-.043.013-.11.013-.417V2.8c0-.307-.003-.373-.014-.416a.5.5 0 0 0-.369-.37C5.574 2.004 5.507 2 5.2 2zm7 0c-.307 0-.373.003-.416.014a.5.5 0 0 0-.37.37c-.01.043-.014.11-.014.416v2.4c0 .308.003.374.014.417a.5.5 0 0 0 .37.37c.043.01.11.013.416.013h2.4c.308 0 .374-.003.417-.014a.5.5 0 0 0 .37-.369c.01-.043.013-.11.013-.417V2.8c0-.307-.004-.373-.014-.416a.5.5 0 0 0-.369-.37c-.043-.01-.11-.014-.417-.014z" />
                        </svg>
                        <span>Dashboard</span>
                    </li>
                    <li data-path="/productos">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2">
                                <path
                                    d="M3.977 9.84A2 2 0 0 1 5.971 8h12.058a2 2 0 0 1 1.994 1.84l.803 10A2 2 0 0 1 18.833 22H5.167a2 2 0 0 1-1.993-2.16z" />
                                <path d="M16 11V6a4 4 0 0 0-4-4v0a4 4 0 0 0-4 4v5" />
                            </g>
                        </svg>
                        <span>Productos & Ventas</span>
                    </li>
                    <li data-path="/registros">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path fill="currentColor"
                                d="M10.197 7.464C10.82 7.167 11.634 7 12.5 7s1.681.167 2.303.464C15.378 7.739 16 8.24 16 9s-.621 1.26-1.197 1.536c-.622.297-1.437.464-2.303.464s-1.681-.167-2.303-.464C9.622 10.261 9 9.76 9 9s.622-1.26 1.197-1.536m.54 1.128c-.465.222-.487.408-.487.408s.022.186.487.408c.419.2 1.041.342 1.763.342s1.344-.141 1.763-.342c.465-.222.487-.408.487-.408s-.022-.186-.487-.408c-.419-.2-1.041-.342-1.763-.342s-1.344.141-1.763.342M12.5 12c1.41 0 2.67-.433 3.495-1.11q.005.055.005.11c0 1.105-1.567 2-3.5 2S9 12.105 9 11q0-.055.005-.11C9.83 11.567 11.09 12 12.5 12m0 2c1.41 0 2.67-.433 3.495-1.11q.005.055.005.11c0 1.105-1.567 2-3.5 2S9 14.105 9 13q0-.055.005-.11C9.83 13.567 11.09 14 12.5 14m-6-12A2.5 2.5 0 0 0 4 4.5v15A2.5 2.5 0 0 0 6.5 22h13.25a.75.75 0 0 0 0-1.5H6.5a1 1 0 0 1-1-1h14.25a.75.75 0 0 0 .75-.75V4.5A2.5 2.5 0 0 0 18 2zM19 18H5.5V4.5a1 1 0 0 1 1-1H18a1 1 0 0 1 1 1z" />
                        </svg>
                        <span>Registros</span>
                    </li>
                    <li data-path="/beneficios">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path fill="currentColor"
                                d="m8.85 16.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm3.15-.723l-3.63 2.192q-.16.079-.297.064q-.136-.016-.265-.094q-.13-.08-.196-.226t-.012-.319l.966-4.11l-3.195-2.77q-.135-.11-.178-.263t.019-.293t.165-.23q.104-.087.28-.118l4.216-.368l1.644-3.892q.068-.165.196-.238T12 5.364t.288.073t.195.238l1.644 3.892l4.215.368q.177.03.281.119q.104.088.166.229q.061.14.018.293t-.178.263l-3.195 2.77l.966 4.11q.056.171-.011.318t-.197.226q-.128.08-.265.095q-.136.015-.296-.064zm0-3.852" />
                        </svg>
                        <span>Beneficios</span>
                    </li>
                    <li class="logout">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g fill="none">
                                <path
                                    d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                                <path fill="currentColor"
                                    d="M12 3a1 1 0 0 1 .117 1.993L12 5H7a1 1 0 0 0-.993.883L6 6v12a1 1 0 0 0 .883.993L7 19h4.5a1 1 0 0 1 .117 1.993L11.5 21H7a3 3 0 0 1-2.995-2.824L4 18V6a3 3 0 0 1 2.824-2.995L7 3zm5.707 5.464l2.828 2.829a1 1 0 0 1 0 1.414l-2.828 2.829a1 1 0 1 1-1.414-1.415L17.414 13H12a1 1 0 1 1 0-2h5.414l-1.121-1.121a1 1 0 0 1 1.414-1.415" />
                            </g>
                        </svg>
                        <span>Cerrar Sesión</span>
                    </li>
                </ul>
            </nav>
        </section>
        <slot></slot>
    `
        const logout = this.shadow.querySelector('.logout')
        logout.addEventListener('click', () => {
            localStorage.removeItem('token')
            window.location.href = '/'
        })
    }
}

customElements.define('menu-component', Menu)
