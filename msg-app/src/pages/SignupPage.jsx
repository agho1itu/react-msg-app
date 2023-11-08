import Button from '../components/Button'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

const SignupPage = () => {
  return (
    <div className='signupPage'>
      <h1>Sign up</h1>
      <div className= 'signupContainer'>
        <h3>Create your account</h3>
        <form className='loginFields'>
          <input type="text" placeholder='Full name' className='inputField'/>
          <input type="number" placeholder='Phone number' className='inputField'/>
          <input type="password" placeholder='Password' className='inputField'/>
          <input type="password" placeholder='Confirm Password' className='inputField'/>
        <Button type='submit' text='Sign up' className='primaryButton' />
        </form>
        
        <p>Already have an account? <Link to='/'>Sign in</Link></p>
      </div>

    </div>
  )
}

export default SignupPage
