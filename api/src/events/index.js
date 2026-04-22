module.exports = (redisClient, subscriberClient) => {
  require('./new-user.js').handleEvent(redisClient, subscriberClient)
  require('./new-customer.js').handleEvent(redisClient, subscriberClient)
}
