const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config({ path: "./.env" })

mongoose.connect(process.env.MONGODB_URL, {
  useNewParser: true,
  useUnifiedTopology: true,
})

module.exports = mongoose
