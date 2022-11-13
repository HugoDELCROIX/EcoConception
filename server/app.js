const express = require("express")
const path = require("path")
const cors = require("cors")
const db = require("./core/database")

const app = express()

app.use(cors())

app.use("/practicies", require("./routes/practicies"))

app.listen(3000, () => {
  console.log("Listening on port 3000")
})
