import logoImg from '../components/assets/Logo.svg';
import { Link } from 'react-router-dom'
import Form from '../components/Form'

const WelcomePage = () => {

  return (
    <div className='page-body'>
      <h1>Welcome!</h1>
      <div className='floating-container'>
        <img src={logoImg} alt='Logo' />
        <h3>Sign into your account</h3>
        <Form type='SignIn' />
        <p>Don't have an account? <Link to='/signup'>Sign up</Link></p>
      </div>
    </div>
  )
}

export default WelcomePage
