/* CONSTANTS */

const PORT = 5000

const express = require('express')
const session = require('express-session')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const bcrypt = require('bcrypt')
const mysql = require('mysql')

// create connection string
const db = mysql.createConnection({
  host: 'localhost',
  user: 'tester',
  password: 'HClQAI5qz2HXS5g1#',
  database: 'drone_db'
})

const app = express()     // init app

app.use(cors({            // allows to handle cross-origin
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}))

// parses all data from frontend
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())

// init session
app.use(session({
  key: 'userID',        // key for session
  secret: 'testing',    // will need to move to .env
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 60 * 60 * 24 // will expire after 24h
  }
}))

// middleware to verify token
const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"]   // take token from header  

  // check a token in header
  if (token) {
    // verify token (token, secret, (error, decoded))
    jwt.verify(token, "jwtSecret", (err, decode) => {
      if (err)  {
        res.send({ auth: false, msg: "Failed to verify", from: "verifyJWT" })
      } else {
        req.userId = decode.id
        next()
      }
    })
  } else {
    res.send({ auth: false, msg: "No token", from: "verifyJWT" })
  }
}

/* ENDPOINTS */

// route to check if user is already logged in
app.get("/login", (req, res) => {
  if (req.session.user) {
    return res.json({ auth: true, user: req.session.user[0], from: "post/api/login" })
  } else {
    return res.json({ auth: false, msg: "not-logged", from: "get/api/login" })
  }
})


// check if user is authenticated
app.get("/isAuth", verifyJWT, (req, res) => {
  // res.send({auth: false, msg:})
  return res.json({ auth: true, msg: "is auth", from: "get/api/isAuth"})
})


app.post("/login", (req, res) => {
  const { lgn, pwd } = req.body   // get payload

  // run query and handle resp
  db.query(
    "SELECT * FROM tb_users WHERE email = ?",
    [lgn],
    (err, result) => {
      if (err) res.send({ err: err })

      // if user -> check the hash -> else error 
      if (result.length > 0) {
        bcrypt.compare(pwd, result[0].hash, (error, resp) => {
          if (resp) {

            const id = result[0]['id']      // use user id
            const token = jwt.sign(
              { id },                       // pass user id
              "jwtSecrete",                 // keep it .env
              { expiresIn: 60 * 50, }       // 5min life
            )

            req.session.user = result

            return res.json({ auth: true, token: token, result: result[0], from: "post/api/login"})
          } else {
            return res.json({ auth: false, msg: "Incorrect username or password", from: "post/api/login" })
          }
        })
      } else {
        return res.send({ auth: false, msg: "User dose not exist", from: "post/api/login" })
      }
    }
  )
})


app.post("/register", (req, res) => {
  let validError = null
  let { name, surname, phone, email, pwd, repwd } = req.body

  // validate and sanitize input //

  // check if inputs are not empty
  if (email.length === 0
    || name.length === 0
    || surname.length === 0
    || phone.length === 0
    || pwd.length === 0
    || repwd.length === 0
  ) validError = 'All mandatory filed can not be blank'

  // check if passwords match
  if (pwd !== repwd) validError = 'Password do not match'

  // return error 
  if (validError) {
    return res.json({ auth: false, msg: validError, from: "post/api/register" })
  }

  // try to insert entry
  bcrypt.hash(pwd, 6, (err, hash) => {
    // query
    db.query(
      "INSERT INTO tb_users (name, surname, phone, email, hash) VALUES(?, ?, ?, ?, ?)",
      [name, surname, phone, email, hash],
      (err, result) => {
        if (err) return res.json({ auth: false, msg: err.sqlMessage, from: "post/api/register" }) // return error from sql

        return res.json({ auth: true, result: result[0], from: "post/api/register" }) // return resp if everything is Ok
      }
    )
  })
})


/* TESTING */
app.get("/api", (req, res) => {
  console.log(req)
  res.json({ "user": [1, 2, 3] })
})


app.post("/insert", (req, res) => {
  // query, [params], (error or result)
  db.query(
    "INSERT INTO tb_test (details, text) VALUES (?, ?)",
    [Date.now(), 'test'],
    (err, result) => {

      if (err) {
        console.log(err)
      } else {
        console.log(result)
      }

      res.send('Send')
    })
})


app.get("/select", (req, res) => {
  db.query(
    "SELECT * FROM tb_test",
    (err, result) => {
      if (err) console.log(err)

      res.send(result)
    }
  )
})


// run server - listen on selected port
app.listen(PORT, () => { console.log(`Server turning on: ${PORT}`) })