import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

import './Login.css'

function Login(){
    const { login } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        try{
            await login(email, password)
            navigate('/')
        }catch(err){
            setError(err.response?.data?.detail || err.message)
        }
    }

    return ( 
        <div className="login-page">
            <h1> Login </h1>
            {error && <div className="login-error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="email"/>
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="password"/>
                <button>Login</button>
            </form>
        </div>
    )
}

export default Login;