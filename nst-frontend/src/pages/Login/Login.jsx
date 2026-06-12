import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

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
        <div>
            <h1> Login </h1>
            {error && <div style={{color:'red'}}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="email"/>
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="password"/>
                <button>Login</button>
            </form>
        </div>
    )
}

export default Login;