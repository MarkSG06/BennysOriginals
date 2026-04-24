export default {
  base: '/admin',
  server: {
    port: 5171,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true
      }
    }
  }
}