const mongoose = require("mongoose")

const practiciesSchema = mongoose.Schema(
  {
    family: String,
    name: String,
    isVital: Boolean,
    keystep: String,
    categories: Array,
    indicator: String,
    lifecycle: String,
  },
  { collection: "practicies" }
)

module.exports = mongoose.model("Practicies", practiciesSchema)
