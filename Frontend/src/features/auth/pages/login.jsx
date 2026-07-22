import React from 'react'
import '../auth.form.scss'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.js'


const Login = () => {
  const navigate = useNavigate();
  const { loading, error, handleLogin, user } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Navigate to home/dashboard after successful login
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(email, password);
    navigate('/');
  }
  
  const goToRegister = () => {
    navigate('/register');
  }

  if(loading){
    return (<main><h1>Loading....</h1></main>)
  }

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>

        {error && <div className="error-message" style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}

        <form onSubmit={handleSubmit}>

          <div className="input-group">
          <label htmlFor="email">Email</label>
          <input onChange={(e)=> {setEmail(e.target.value)}}
           type="email" id="email" name="email" required placeholder="Enter your email" value={email} />
          </div>

          <div className="input-group">
          <label htmlFor="password">Password</label>
          <input onChange={(e)=>{setPassword(e.target.value)}}
          type="password" id="password" name="password" required placeholder="Enter your password" value={password} />
          </div>

          <button type="submit" className="button primary-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        
        </form>

        <p>Don't have an account? <a type="button" className="link-button" onClick={goToRegister}>Register</a></p>

      </div>
    </main>
  )
}


export default Login
