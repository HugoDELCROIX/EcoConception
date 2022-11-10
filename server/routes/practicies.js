const express = require("express")
const router = express.Router()

const Practice = require("../models/Practicies")

router.get("/", (req, res, next) => {
  const page = req.query.page || 0
  const practicePerPage = 20

  res.setHeader("Content-Type", "application/json")

  Practice.find()
    .lean()

    .exec((err, docs) => {
      res.end(JSON.stringify(docs))
    })
})

router.get("/vital", (req, res, next) => {
  res.setHeader("Content-Type", "application/json")

  Practice.find({ isVital: true })
    .lean()
    .exec((err, docs) => {
      res.end(JSON.stringify(docs))
    })
})

module.exports = router
