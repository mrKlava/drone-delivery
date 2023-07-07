const express = require('express')
const app = express()

const PORT = 5000

app.get("/api", (req, res) => {
  res.json({"user": [1, 2, 3]})
})

app.listen(PORT, () => {console.log(`Server turning on: ${PORT}`)})