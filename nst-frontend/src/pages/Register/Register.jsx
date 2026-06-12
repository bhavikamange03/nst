import { useState } from 'react'
import axios from '../../api/axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

import './Register.css'

function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    address: {
      first_name: '',
      last_name: '',
      street: '',
      city: '',
      state: '',
      zip_code: '',
      country: '',
      phone: ''
    }
  })
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('address.')){
      const k = name.split('.')[1]
      setForm(prev => ({...prev, address: {...prev.address, [k]: value}}))
    } else {
      setForm(prev => ({...prev, [name]: value}))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (form.password !== form.confirm){
      setError('Passwords do not match')
      return
    }
    try{
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
      }
      // include address only if at least one field provided
      const addr = Object.values(form.address).some(v => v && v.trim() !== '') ? form.address : undefined
      if (addr) payload.address = addr

      await axios.post('/auth/register', payload)
      // auto-login after register
      await login(form.email, form.password)
      navigate('/')
    }catch(err){
      setError(err.response?.data?.detail || err.message)
    }
  }

  return (
    <div className="register-page">
      <h1>Register</h1>
      {error && <div className="register-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input className="full" name="name" value={form.name} onChange={handleChange} type="text" placeholder="Name" />
        <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email" />
        <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="Password" />
        <input name="confirm" value={form.confirm} onChange={handleChange} type="password" placeholder="Confirm Password" />

        <h3>Address (optional)</h3>
        <input name="address.first_name" value={form.address.first_name} onChange={handleChange} placeholder="First name" />
        <input name="address.last_name" value={form.address.last_name} onChange={handleChange} placeholder="Last name" />
        <input className="full" name="address.street" value={form.address.street} onChange={handleChange} placeholder="Street" />
        <input name="address.city" value={form.address.city} onChange={handleChange} placeholder="City" />
        <input name="address.state" value={form.address.state} onChange={handleChange} placeholder="State" />
        <input name="address.zip_code" value={form.address.zip_code} onChange={handleChange} placeholder="Zip code" />
        <input name="address.country" value={form.address.country} onChange={handleChange} placeholder="Country" />
        <input name="address.phone" value={form.address.phone} onChange={handleChange} placeholder="Phone" />

        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default Register;