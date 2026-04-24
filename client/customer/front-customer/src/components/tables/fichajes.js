class TableFichajes extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
    }

    async connectedCallback() {
        await this.loadData()
        await this.render()

        document.addEventListener('refreshShiftsTable', async () => {
            await this.loadData()
            this.render()
        })
    }

    getUserId() {
        const token = localStorage.getItem('token')
        if (!token) return null
        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            return payload.id
        } catch (e) {
            return null
        }
    }

    async loadData() {
        try {
            const userId = this.getUserId()
            const url = userId ? `/api/admin/shifts?user_id=${userId}&size=100` : '/api/admin/shifts'
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            this.data = await response.json()
        } catch (error) {
            console.error('Error loading shifts', error)
            this.data = { rows: [] }
        }
    }

    render() {

        this.shadow.innerHTML =
    /* html */`
    <style>
        .content {
            margin-top: 1rem;
            padding: 1rem 3rem;
            background-color: #1b1b1b;
            border: 2px solid #4141413a;
            border-radius: 2rem;
            justify-self: center;
        }

        .contentHeader {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .contentTitle {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .contentHeader h1 {
            font-size: 2.5rem;
            padding: 0;
            margin: 0;
        }

        .contentHeader span {
            background: linear-gradient(to right, #0084ff, #c300ff);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }

        .contentHeader p {
            color: #d6d6d6;
            font-size: 1.1rem;
        }

        .contentHeader img {
            height: 100px;
            width: auto;
        }

        .buttons svg {
            width: auto;
            height: 60px;
        }

        .buttons {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
        }

        .btn {
            background-color: #383838;
            padding: 1rem 2rem;
            border-radius: 1rem;
            align-items: center;
            display: flex;
            gap: 1rem;
            font-weight: 700;
            cursor: pointer;
            font-size: 1.5rem;
            transition: 0.2s ease;
        }

        .btn:hover {
            transform: scale(1.02);
        }

        .btn svg {
            border: 2px solid #dbdbdb;
            padding: 1rem;
            border-radius: 20rem;
        }

        .btn.start {
            background-color: rgba(2, 128, 2, 0.226);
            border: 2px solid rgb(0, 167, 0);
        }

        .btn.start:hover {
            background-color: rgba(0, 255, 0, 0.226);
        }

        .btn.start svg {
            color: rgb(2, 255, 2);
            border-color: rgb(2, 255, 2);
        }

        .btn.end {
            background-color: rgba(128, 2, 2, 0.226);
            border: 2px solid rgb(167, 0, 0);
        }

        .btn.end:hover {
            background-color: rgba(255, 0, 0, 0.226);
        }

        .btn.end svg {
            color: rgb(255, 2, 2);
            border-color: rgb(255, 2, 2);
        }

        .btn.timeService {
            background-color: rgba(128, 105, 2, 0.226);
            border: 2px solid rgb(167, 164, 0);
        }

        .btn.timeService:hover {
            background-color: rgba(255, 238, 0, 0.226);
        }

        .btn.timeService svg {
            color: rgb(255, 217, 2);
            border-color: rgb(255, 217, 2);
        }

        .titleService {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .titleService span {
            font-weight: 500;
        }
        .table {
            margin-top: 1rem;
            padding: 1rem;
            background-color: #202020;
            border-radius: 1rem;
            height: 375px;
            max-height: 375px;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .titleShifts {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .titleShifts svg {
            height: auto;
            width: 40px;
        }

        .tableShifts {
            background-color: #252525;
            border: 2px solid #ffffff1f;
            border-radius: 1rem;
            height: 78%;
        }

        .tableHeader {
            border-radius: 1rem 1rem 0 0;
            border-bottom: 2px solid #ffffff1f;
            font-weight: 600;
            align-items: center;
            text-align: center;
        }

        .tableHeader ul {
            padding: 0;
            margin: 0;
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            background-color: #1b1b1b;
            border-radius: 1rem 1rem 0 0;
        }

        .tableHeader li {
            list-style: none;
            padding: 1rem 2rem;
        }

        .tableBody {
            display: flex;
            flex-direction: column;
            text-align: center;
            overflow-y: auto;
            max-height: 80%;
        }

        .tableBody {
            scrollbar-width: none;
        }

        .tableBody::-webkit-scrollbar {
            display: none;
        }

        .tableBody ul:nth-child(odd) {
            background-color: #303030;
        }

        .tableBody ul:nth-child(even) {
            background-color: #272727;
        }

        .tableBody ul:hover {
            background-color: #383838;
        }

        .tableBody ul:last-child {
            border-bottom: none;
        }

        .tableBody ul {
            padding: 0;
            margin: 0;
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            align-items: center;
            text-align: center;
        }

        .tableBody li {
            list-style: none;
            border-bottom: 1px solid #ffffff1f;
            padding: 1rem 2rem;
        }


        .noData {
            padding: 2rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            justify-content: center;
            align-items: center;
            font-size: 1.2rem;
        }

        .noData svg {
            height: auto;
            width: 100px;
        }

        .hide {
            display: none;
        }
    </style>
    <section class="content">
            <div class="contentHeader">
                <div class="contentTitle">
                    <h1>Panel de <span>Control</span></h1>
                    <p>Gestiona tu jornada laboral de forma fácil y eficiente.</p>
                </div>
                <img src="images/clock.png">
            </div>
            <div class="buttons">
                <div class="btn start">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g fill="none">
                            <path
                                d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                            <path fill="currentColor"
                                d="M12 3a1 1 0 0 1 .117 1.993L12 5H7a1 1 0 0 0-.993.883L6 6v12a1 1 0 0 0 .883.993L7 19h4.5a1 1 0 0 1 .117 1.993L11.5 21H7a3 3 0 0 1-2.995-2.824L4 18V6a3 3 0 0 1 2.824-2.995L7 3zm2.293 5.464a1 1 0 0 1 1.497 1.32l-.083.095L14.586 11H20a1 1 0 0 1 .117 1.993L20 13h-5.414l1.121 1.121a1 1 0 0 1-1.32 1.498l-.094-.083l-2.829-2.829a1 1 0 0 1-.083-1.32l.083-.094z" />
                        </g>
                    </svg>
                    <span>Fichar Entrada</span>
                </div>
                <div class="btn end hide">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g fill="none">
                            <path
                                d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                            <path fill="currentColor"
                                d="M12 3a1 1 0 0 1 .117 1.993L12 5H7a1 1 0 0 0-.993.883L6 6v12a1 1 0 0 0 .883.993L7 19h4.5a1 1 0 0 1 .117 1.993L11.5 21H7a3 3 0 0 1-2.995-2.824L4 18V6a3 3 0 0 1 2.824-2.995L7 3zm5.707 5.464l2.828 2.829a1 1 0 0 1 0 1.414l-2.828 2.829a1 1 0 1 1-1.414-1.415L17.414 13H12a1 1 0 1 1 0-2h5.414l-1.121-1.121a1 1 0 0 1 1.414-1.415" />
                        </g>
                    </svg>
                    <span>Fichar Salida</span>
                </div>
                <div class="btn timeService">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z" />
                        <rect width="2" height="7" x="11" y="6" fill="currentColor" rx="1">
                            <animateTransform attributeName="transform" dur="9s" repeatCount="indefinite"
                                type="rotate" values="0 12 12;360 12 12" />
                        </rect>
                        <rect width="2" height="9" x="11" y="11" fill="currentColor" rx="1">
                            <animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite"
                                type="rotate" values="0 12 12;360 12 12" />
                        </rect>
                    </svg>
                    <div class="titleService">
                        <p>Trabajado hoy</p>
                        <span>00h 00m</span>
                    </div>
                </div>
            </div>
    <div class="table">
        <div class="titleShifts">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g fill="none">
                    <path
                        d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                    <path fill="currentColor"
                        d="M16 3a3 3 0 0 1 2.995 2.824L19 6v10h.75c.647 0 1.18.492 1.244 1.122l.006.128V19a3 3 0 0 1-2.824 2.995L18 22H8a3 3 0 0 1-2.995-2.824L5 19V9H3.25a1.25 1.25 0 0 1-1.244-1.122L2 7.75V6a3 3 0 0 1 2.824-2.995L5 3zm3 15h-9v1c0 .35-.06.687-.17 1H18a1 1 0 0 0 1-1zm-7-6h-2a1 1 0 0 0-.117 1.993L10 14h2a1 1 0 0 0 .117-1.993zm2-4h-4a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2M5 5a1 1 0 0 0-1 1v1h1z" />
                </g>
            </svg>
            <h2>Registro de Fichajes</h2>
        </div>
        <div class="tableShifts">
            <div class="tableHeader">
                <ul>
                    <li>Nombre</li>
                    <li>Fecha</li>
                    <li>Entrada</li>
                    <li>Salida</li>
                    <li>Horas Totales</li>
                </ul>
            </div>
            <span class="noData  hide">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                    <g fill="none" stroke-width="3">
                        <path fill="#8fbffa"
                            d="M5.442 39.958c.219 2.546 2.206 4.447 4.755 4.619C13.282 44.785 18.129 45 25 45c6.87 0 11.718-.215 14.803-.423c2.55-.172 4.536-2.073 4.755-4.619C44.784 37.324 45 33.396 45 28s-.216-9.323-.442-11.958c-.219-2.546-2.206-4.447-4.755-4.619C36.718 11.215 31.871 11 25 11c-6.87 0-11.718.215-14.803.423c-2.55.172-4.536 2.073-4.755 4.619C5.216 18.676 5 22.604 5 28s.216 9.324.442 11.958" />
                        <path fill="#fff"
                            d="M5.016 30.499Q5.001 29.307 5 28c0-5.396.216-9.323.442-11.958c.219-2.546 2.206-4.447 4.755-4.619C13.282 11.215 18.129 11 25 11c6.87 0 11.718.215 14.803.423a5.3 5.3 0 0 1 2.11.593a119 119 0 0 0-.948-5.098c-.512-2.425-2.661-4.037-5.164-3.911c-3.023.152-7.757.505-14.425 1.315s-11.348 1.6-14.319 2.175c-2.459.477-4.15 2.555-4.053 5.03c.106 2.707.39 6.8 1.09 12.446c.308 2.479.62 4.648.922 6.526" />
                        <path fill="#fff"
                            d="M25.087 28.823c.086 1.707 1.383 3.004 3.09 3.09c.991.05 2.257.087 3.823.087a76 76 0 0 0 3.823-.087c1.706-.086 3.004-1.383 3.09-3.09c.05-.991.087-2.257.087-3.823a76 76 0 0 0-.087-3.822c-.086-1.707-1.383-3.005-3.09-3.09A76 76 0 0 0 32 18a76 76 0 0 0-3.822.087c-1.707.086-3.005 1.383-3.09 3.09A76 76 0 0 0 25 25c0 1.566.038 2.832.087 3.823" />
                        <path stroke="#2859c5" stroke-linecap="round" stroke-linejoin="round"
                            d="M40.923 6.895c-.511-2.411-2.659-4.013-5.158-3.888c-3.02.151-7.749.502-14.41 1.307c-6.66.805-11.335 1.59-14.303 2.162c-2.456.473-4.145 2.539-4.048 5c.106 2.69.389 6.757 1.089 12.369c.317 2.538.639 4.75.948 6.655" />
                        <path stroke="#2859c5" stroke-linejoin="round"
                            d="M5.442 39.958c.219 2.546 2.206 4.447 4.755 4.619C13.282 44.785 18.129 45 25 45c6.87 0 11.718-.215 14.803-.423c2.55-.172 4.536-2.073 4.755-4.619C44.784 37.324 45 33.396 45 28s-.216-9.323-.442-11.958c-.219-2.546-2.206-4.447-4.755-4.619C36.718 11.215 31.871 11 25 11c-6.87 0-11.718.215-14.803.423c-2.55.172-4.536 2.073-4.755 4.619C5.216 18.676 5 22.604 5 28s.216 9.324.442 11.958Z" />
                        <path stroke="#2859c5" stroke-linecap="round" stroke-linejoin="round"
                            d="M19 19h-8m8 12h-8m28 6H11m8-12h-8" />
                        <path stroke="#2859c5" stroke-linejoin="round"
                            d="M25.087 28.823c.086 1.707 1.383 3.004 3.09 3.09c.991.05 2.257.087 3.823.087a76 76 0 0 0 3.823-.087c1.706-.086 3.004-1.383 3.09-3.09c.05-.991.087-2.257.087-3.823a76 76 0 0 0-.087-3.822c-.086-1.707-1.383-3.005-3.09-3.09A76 76 0 0 0 32 18a76 76 0 0 0-3.822.087c-1.707.086-3.005 1.383-3.09 3.09A76 76 0 0 0 25 25c0 1.566.038 2.832.087 3.823Z" />
                    </g>
                </svg> No hay Fichajes todavía</span>
            <div class="tableBody">
            </div>
            <div class="totalRow hide">
            </div>
        </div>
    </div>
    `

        const tableBody = this.shadow.querySelector('.tableBody')
        const noData = this.shadow.querySelector('.noData')

        const totalRow = this.shadow.querySelector('.totalRow')

        const today = new Date().toISOString().split('T')[0]
        const todayShifts = (this.data && this.data.rows)
            ? this.data.rows.filter(s => s.date && s.date.startsWith(today))
            : []

        if (todayShifts.length === 0) {
            tableBody.classList.add('hide')
            totalRow.classList.add('hide')
            noData.classList.remove('hide')
        } else {
            tableBody.classList.remove('hide')
            noData.classList.add('hide')

            let totalMins = 0

            todayShifts.forEach(shift => {
                const ul = document.createElement('ul')

                const userLi = document.createElement('li')
                userLi.textContent = shift.User ? shift.User.name : 'Desconocido'
                ul.appendChild(userLi)

                const dateLi = document.createElement('li')
                dateLi.textContent = shift.date.split('T')[0]
                ul.appendChild(dateLi)

                const startLi = document.createElement('li')
                startLi.textContent = shift.start_time.split(':')[0] + ':' + shift.start_time.split(':')[1]
                ul.appendChild(startLi)

                const endLi = document.createElement('li')
                endLi.textContent = shift.end_time ? shift.end_time.split(':')[0] + ':' + shift.end_time.split(':')[1] : '-'
                ul.appendChild(endLi)

                const totalLi = document.createElement('li')
                totalLi.textContent = shift.total_minutes ? shift.total_minutes.split(':')[0] + 'h ' + shift.total_minutes.split(':')[1] + 'm' : 'En curso'
                ul.appendChild(totalLi)

                if (shift.total_minutes) {
                    const parts = shift.total_minutes.split(':')
                    totalMins += (parseInt(parts[0]) || 0) * 60 + (parseInt(parts[1]) || 0)
                }

                tableBody.appendChild(ul)
            })
        }
    }
}

customElements.define('fichajes-table-component', TableFichajes)
