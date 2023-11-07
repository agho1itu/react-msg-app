import {useState} from 'react'
import Button from './Button'

const SignIn = () => {
  const [number, setNumber] = useState()
  const [pass, setPass] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault(); //Stops the page from reloading 
    console.log(number);
  }

  return (
      <form onSubmit={handleSubmit} className='loginFields'>
       <input value={number} onChange={(e) => setNumber(e.target.value)} type='number' placeholder='Phone number' id='number' name='number' className='inputField'/>
       <input value={pass} onChange={(e) => setPass(e.target.value)} type='password' placeholder='Password' id='password' name='password' className='inputField'/> 
       <Button type='submit' text='Sign in' className='primaryButton'/>   
      </form>
  )
}
export default SignIn
