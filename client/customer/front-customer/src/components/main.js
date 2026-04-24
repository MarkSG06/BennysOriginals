class Main extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.currentShiftId = localStorage.getItem('currentShiftId') || null
        this.shiftStartTime = localStorage.getItem('shiftStartTime') ? new Date(localStorage.getItem('shiftStartTime')) : null
        this.timerInterval = null
        this.accumulatedMsToday = 0;
    }

    async connectedCallback() {
        await this.render()
    }

    getUserFromToken() {
        const token = localStorage.getItem('token')
        const payload = JSON.parse(atob(token.split('.')[1]))
        return { id: payload.id, name: payload.name || 'Usuario', role: payload.role || 'Empleado' }
    }

    render() {
        const user = this.getUserFromToken()
        this.shadow.innerHTML =
    /* html */`
    <style>
        .main {
            background-color: #151515;
            width: 100%;
            height: 100dvh;
            color: white;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 2rem;
        }

        .welcome {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .welcome p {
            color: #d6d6d6;
            font-size: 1.1rem;
        }

        .welcome span {
            color: white;
            font-weight: 700;
            font-size: 2.5rem;
        }

        .infoUser {
            display: flex;
            gap: 3rem;
        }

        .infoUser svg {
            width: auto;
            height: 30px;
        }

        .date {
            display: flex;
            align-items: center;
            gap: 1rem;
            background-color: #272727;
            border: 2px solid #ebebeb3a;
            padding: 1rem 1.5rem;
            border-radius: 2rem;
            font-weight: 500;
        }

        .rol {
            display: flex;
            align-items: center;
            gap: 1rem;
            background-color: #442f00;
            border: 2px solid #ffd000;
            color: #FACC15;
            padding: 1rem 1.5rem;
            border-radius: 2rem;
            font-weight: 600;
        }
    </style>
    <section class="main">
        <div class="header">
            <div class="welcome">
                <p>¡Bienvenido/a!</p>
                <span id="userName">${user.name}</span>
            </div>
            <div class="infoUser">
                <div class="date">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                        <path fill="currentColor"
                            d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                    </svg>
                    <div class="datetime">
                        <span id="date">23/04/2026</span>
                        <span id="time">00:00:00</span>
                    </div>
                </div>
                <div class="rol">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
                        <path fill="currentColor"
                            d="M18 17a7 7 0 1 0-7-7a7 7 0 0 0 7 7m0-12a5 5 0 1 1-5 5a5 5 0 0 1 5-5"
                            class="clr-i-outline clr-i-outline-path-1" />
                        <path fill="currentColor"
                            d="M30.47 24.37a17.16 17.16 0 0 0-24.93 0A2 2 0 0 0 5 25.74V31a2 2 0 0 0 2 2h22a2 2 0 0 0 2-2v-5.26a2 2 0 0 0-.53-1.37M29 31H7v-5.27a15.17 15.17 0 0 1 22 0Z"
                            class="clr-i-outline clr-i-outline-path-2" />
                        <path fill="none" d="M0 0h36v36H0z" />
                    </svg>
                    <span>${user.role}</span>
                </div>
            </div>
        </div>
            <slot></slot>
        </section>
    </section>
    `
        const updateTime = () => {
            const now = new Date();
            const dateElement = this.shadow.querySelector('#date');
            const timeElement = this.shadow.querySelector('#time');

            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            dateElement.textContent = `${day}/${month}/${year}`;
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            timeElement.textContent = `${hours}:${minutes}`;
        }

        updateTime();
        setInterval(updateTime, 1000);

        const startBtn = this.shadow.querySelector('.btn.start');
        const endBtn = this.shadow.querySelector('.btn.end');
        const timerSpan = this.shadow.querySelector('.titleService span');

        const updateTimerDisplay = () => {
            let totalMs = this.accumulatedMsToday || 0;
            if (this.currentShiftId && this.shiftStartTime) {
                totalMs += (new Date() - this.shiftStartTime);
            }

            const h = String(Math.floor(totalMs / 3600000)).padStart(2, '0');
            const m = String(Math.floor((totalMs % 3600000) / 60000)).padStart(2, '0');
            timerSpan.textContent = `${h}h ${m}m`;
        };

        const loadTodayAccumulated = async () => {
            try {
                const now = new Date();
                const today = now.toISOString().split('T')[0];
                const response = await fetch(`/api/admin/shifts?user_id=${user.id}&size=100`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();

                let accumulatedMs = 0;
                if (data.rows) {
                    const todayShifts = data.rows.filter(s => s.date.startsWith(today) && s.total_minutes && s.id != this.currentShiftId);
                    todayShifts.forEach(s => {
                        const parts = s.total_minutes.split(':');
                        const h = parseInt(parts[0]) || 0;
                        const m = parseInt(parts[1]) || 0;
                        accumulatedMs += (h * 3600000) + (m * 60000);
                    });
                }
                this.accumulatedMsToday = accumulatedMs;
                updateTimerDisplay();
            } catch (error) {
                console.error("Error loading accumulated time", error);
            }
        };

        const startShiftTimer = () => {
            if (this.timerInterval) clearInterval(this.timerInterval);
            this.timerInterval = setInterval(updateTimerDisplay, 1000);
        };

        if (this.currentShiftId && this.shiftStartTime) {
            startBtn.classList.add('hide');
            endBtn.classList.remove('hide');
            startShiftTimer();
        } else {
            startBtn.classList.remove('hide');
            endBtn.classList.add('hide');
        }

        loadTodayAccumulated();

        startBtn.addEventListener('click', async () => {
            const now = new Date();
            const date = now.toISOString().split('T')[0];
            const start_time = now.toTimeString().split(' ')[0];

            try {
                const response = await fetch('/api/admin/shifts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        user_id: user.id,
                        date: date,
                        start_time: start_time
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    this.currentShiftId = data.id;
                    localStorage.setItem('currentShiftId', data.id);
                    this.shiftStartTime = now;
                    localStorage.setItem('shiftStartTime', now.toISOString());

                    startBtn.classList.add('hide');
                    endBtn.classList.remove('hide');
                    startShiftTimer();

                    document.dispatchEvent(new CustomEvent('refreshShiftsTable'));
                }
            } catch (error) {
                console.error('Error al fichar entrada:', error);
            }
        });

        endBtn.addEventListener('click', async () => {
            if (!this.currentShiftId) return;

            const now = new Date();
            const end_time = now.toTimeString().split(' ')[0];

            const diffMs = now - this.shiftStartTime;
            const diffMins = Math.floor(diffMs / 60000);
            const hours = String(Math.floor(diffMins / 60)).padStart(2, '0');
            const minutes = String(diffMins % 60).padStart(2, '0');
            const total_minutes = `${hours}:${minutes}`;

            try {
                const response = await fetch(`/api/admin/shifts/${this.currentShiftId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        end_time: end_time,
                        total_minutes: total_minutes
                    })
                });

                if (response.ok) {
                    this.currentShiftId = null;
                    this.shiftStartTime = null;
                    localStorage.removeItem('currentShiftId');
                    localStorage.removeItem('shiftStartTime');
                    clearInterval(this.timerInterval);

                    loadTodayAccumulated();

                    endBtn.classList.add('hide');
                    startBtn.classList.remove('hide');

                    document.dispatchEvent(new CustomEvent('refreshShiftsTable'));
                }
            } catch (error) {
                console.error('Error al fichar salida:', error);
            }
        });
    }
}

customElements.define('main-component', Main)
