// Email service disabled
exports.handleEvent = async (redisClient, subscriberClient) => {
  await subscriberClient.subscribe('new-customer', async (message) => {
    try {
      const data = JSON.parse(message)
      console.log('New customer created:', data.id)
    } catch (error) {
      console.error('Error procesando mensaje:', error)
    }
  })
}