import { Link } from 'react-router-dom'
import Form from '../components/Form'

const SignupPage = () => {
  return (
    <div className='page-body'>
      <h1>Sign up</h1>
      <div className='floating-container'>
        <h3>Create your account</h3>
        <Form type='SignUp' />
        <p>Already have an account? <Link to='/'>Sign in</Link></p>
      </div>

    </div>
  )
}

export default SignupPage
