import logoImg from './assets/Logo.svg';
import SignIn from './SignIn';

const Container = () => {
  return (
    <div className='containerWelcome'>
      <img src={logoImg} alt='Logo'/>
      <h4 className='smallHeader'>Sign into your account</h4>
      <SignIn/>
      {/* Add the "Don't have an account? Sign up" text with a link to your sign-up page */}
      <p>Don't have an account? <a href="/signup">Sign up</a></p>
    </div>
  );
};

export default Container;
