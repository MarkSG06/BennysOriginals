const publicRoutes = ['/']
const currentPath = window.location.pathname
const token = localStorage.getItem('token')

if (!token && !publicRoutes.includes(currentPath)) {
    window.location.href = '/'
}

if (token && currentPath === '/') {
    window.location.href = '/fichajes'
}