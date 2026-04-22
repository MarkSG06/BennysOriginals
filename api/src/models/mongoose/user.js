module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      name: String,
      email: String,
      deletedAt: Date
    },
    { timestamps: true }
  )

  const User = mongoose.model('User', schema, 'users')
  return User
}
