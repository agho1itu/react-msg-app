import Input from '../components/Input' 
import Button from '../components/Button'
import {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import Parse from 'parse'

const Form = ({type}) => {
  const [name, setName] = useState('')
  const [phoneNumber, setphoneNumber] = useState()
  const [pass, setPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault(); //Stops the page from reloading 
    setError(null);
  
    if (type === 'SignIn') {
      try {
        const user = await Parse.User.logIn(phoneNumber, pass); //Logs a user in and saves it to the disk, can be used with current()
        console.log('User logged in:', user); 
        navigate('/chat_list');
      } catch (error) {
      console.error('Login Failed:', error);
      setError('Your number or password is incorrect');
      console.log('Error state:', error); // Add this line to check the error state
      }
    } else if (type === 'SignUp') {
      try {
        const newUser = new Parse.User();
        newUser.set('username', phoneNumber); 
        newUser.set('password', pass); 
        newUser.set('fullName', name); 

        const result = await newUser.signUp(); 
        console.log('User signed up:', result);

        navigate('/chat_list');
      } catch (error) {
        console.error('Sign up failed:', error);
      }
    }
  };

  return (
    <div className='form'>
  
      {type === 'SignIn' && (
          <form onSubmit={handleSubmit} className='fields'>
            <Input value={phoneNumber} onChange={(e) => setphoneNumber(e.target.value)} type='phoneNumber' placeholder='Phone number'  name='phoneNumber'/>
            <Input value={pass} onChange={(e) => setPass(e.target.value)} type='password' placeholder='Password' name='password'/> 
            {error && <p className="error-message">{error}</p>}
            <Button type='submit' text='Sign in' className='primary-button'/>
          </form>
        )}
        {type === 'SignUp' && (
          <form onSubmit={handleSubmit} className='fields'>
            <Input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder='Full name' name='name'/>
            <Input value={phoneNumber} onChange={(e) => setphoneNumber(e.target.value)} type="phoneNumber" placeholder='Phone number' name='phoneNumber'/>
            <Input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder='Password' name='password'/>
            <Input value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} type="password" placeholder='Confirm Password' name='confirmPassword'/>
            <Button type='submit' text='Sign up' className='primary-button' />
          </form>
        )}
    </div>
  )
}

export default Form


