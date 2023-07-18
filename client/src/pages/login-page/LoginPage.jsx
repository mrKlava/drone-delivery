import React, { useEffect, useState } from 'react'
import Axios from 'axios'

import './login-page.scss'



function LoginPage() {
  Axios.defaults.withCredentials = true

  useEffect(() => {
    // Axios.get("http://localhost:5000/login").then(resp => {
    //   if (resp.data.logged) {
    //     console.log(resp)
    //   }
    // })

    Axios.get("http://localhost:5000/isAuth", {
      headers: {
        "x-access-token": localStorage.getItem('token')
      }
    }).then(resp => {
      console.log(resp)
    })
  }, [])
 
  return (
    <div>
      <LoginComp />
      <RegisterComp />
    </div>
  )
}

export default LoginPage


const LoginComp = () => {
  const [lgn, setLgn] = useState('')
  const [pwd, setPwd] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Axios.defaults.withCredentials = true

  const login = (e) => {
    e.preventDefault()

    Axios.post("http://localhost:5000/login", {
      lgn: lgn,
      pwd: pwd,
    }).then(res => {
      if (res.data.msg) {
        setErrorMsg(res.data.err)
      } else {
        setErrorMsg('')
        localStorage.setItem("token", res.data.token)
        console.log(res.data)
      }
    })

    setLgn('')
    setPwd('')
  }

  const handleLgn = (e) => setLgn(e.target.value) 
  const handlePwd = (e) => setPwd(e.target.value) 

  return (
    <div>
      <form action="" method="POST">
        <div className="input-group">
          <label htmlFor="lgn">Login</label>
          <input type="text" name="lgn" onChange={handleLgn} value={lgn}/>
        </div>
        <div className="input-group">
          <label htmlFor="pwd">Password</label>
          <input type="text" name="pwd" onChange={handlePwd} value={pwd}/>
        </div>
        <button onClick={login}>Login</button>
      </form>
      <h4 style={{color:'red'}}>{errorMsg}</h4>
    </div>
  )
}


const RegisterComp = () => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [phone, setPhone] = useState('')
  const [pwd, setPwd] = useState('')
  const [repwd, setRepwd] = useState('')

  const [errorMsg, setErrorMsg] = useState('')

  // Axios.defaults.withCredentials = true

  const register = (e) => {
    e.preventDefault()

    Axios.post("http://localhost:5000/register", {
      email,
      name,
      surname,
      phone,
      pwd,
      repwd
    }).then(res => {
      if (res.data.err) {
        setErrorMsg(res.data.err)
      } else {
        console.log(res.data)
        
        setErrorMsg('')
        setEmail('')
        setName('')
        setSurname('')
        setPhone('')
        setPwd('')
        setRepwd('')
      }
    })
  }

  const handleEmail = (e) => setEmail(e.target.value)
  const handleName = (e) => setName(e.target.value)
  const handleSurname = (e) => setSurname(e.target.value)
  const handlePhone = (e) => setPhone(e.target.value)
  const handlePwd = (e) => setPwd(e.target.value)
  const handleRepwd = (e) => setRepwd(e.target.value)

  return (
    <div>
      <form action="" method="POST">
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input type="text" name="email" onChange={handleEmail} value={email} />
        </div>
        <div className="input-group">
          <label htmlFor="name">Name</label>
          <input type="text" name="name" onChange={handleName} value={name} />
        </div>
        <div className="input-group">
          <label htmlFor="surname">Surname</label>
          <input type="text" name="surname" onChange={handleSurname} value={surname} />
        </div>
        <div className="input-group">
          <label htmlFor="phone">Phone Number</label>
          <input type="text" name="phone" onChange={handlePhone} value={phone} />
        </div>
        <div className="input-group">
          <label htmlFor="pwd">Password</label>
          <input type="text" name="pwd" onChange={handlePwd} value={pwd} />
        </div>
        <div className="input-group">
          <label htmlFor="repwd">Password</label>
          <input type="text" name="repwd" onChange={handleRepwd} value={repwd} />
        </div>
        <button onClick={register}>Register</button>
      </form>
      <h4 style={{ color: 'red' }}>{errorMsg}</h4>
    </div>
  )
}