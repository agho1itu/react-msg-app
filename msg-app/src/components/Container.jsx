import logoImg from './assets/Logo.svg';
import SignIn from './SignIn'

const Container = () => {
  return (
    <div className='containerWelcome'>
      <img src={logoImg} alt='Logo'/>
      <h4 className='smallHeader'>Sign into your account</h4>
      <SignIn/>
    </div>
  )
}

export default Container
