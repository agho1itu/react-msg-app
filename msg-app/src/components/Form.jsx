import Input from '../components/Input' 
import Button from '../components/Button'
import {useState} from 'react'

const Form = ({type}) => {
  const [name, setName] = useState('')
  const [number, setNumber] = useState()
  const [pass, setPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  
  const handleSubmit = (e) => {
    e.preventDefault(); //Stops the page from reloading 

    if (type === 'SignIn') {
      console.log(number);
    } else if (type === 'SignUp') {
      console.log(name, number, pass, confirmPass);
    }

  }

  return (
    <div className='form'>
      {type === 'SignIn' && (
          <form onSubmit={handleSubmit} className='fields'>
            <Input value={number} onChange={(e) => setNumber(e.target.value)} type='number' placeholder='Phone number'  name='number'/>
            <Input value={pass} onChange={(e) => setPass(e.target.value)} type='password' placeholder='Password' name='password'/> 
            <Button type='submit' text='Sign in' className='primaryButton'/>   
          </form>
        )}
        {type === 'SignUp' && (
          <form onSubmit={handleSubmit} className='fields'>
            <Input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder='Full name' name='name'/>
            <Input value={number} onChange={(e) => setNumber(e.target.value)} type="number" placeholder='Phone number' name='number'/>
            <Input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder='Password' name='password'/>
            <Input value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} type="password" placeholder='Confirm Password' name='confirmPassword'/>
            <Button type='submit' text='Sign up' className='primaryButton' />
          </form>
        )}
    </div>
  )
}

export default Form


