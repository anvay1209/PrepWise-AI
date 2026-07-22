import React from 'react'
import '../auth.form.scss'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.js'

const Register = () => {
  const navigate = useNavigate();
  const { loading, error, handleRegister, user } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Navigate to home/dashboard after successful registration
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister(username, email, password);
    navigate('/');
  }

  const goToLogin = () => {
    navigate('/login');
  }
  

  if(loading){
    return (<main><h1>Loading....</h1></main>)
  }

  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>

        {error && <div className="error-message" style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}

        <form onSubmit={handleSubmit}>

          <div className="input-group">
          <label htmlFor="username">Username</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            required 
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
          />
          </div>

          <div className="input-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
          </div>

          <div className="input-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            required 
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
          </div>

          <button type="submit" className="button primary-button" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>

        </form>

        <p>Already have an account? <a type="button" className="link-button" onClick={goToLogin}>Login</a></p>

      </div>
    </main>    
  )
}

export default Register
