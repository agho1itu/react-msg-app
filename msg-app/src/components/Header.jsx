import { Link } from 'react-router-dom'
import rate_review from './assets/rate_review.svg';
import arrow_back_ios from './assets/arrow_back_ios.svg'; 
import block from './assets/block.svg';

const Header = ({type, pageTitle}) => {
  return (
    <header className='header'>
      <div className='header-left'>
        {type === 'withIcons' && (
            <Link to='/blocked'>
              <img src={block} alt='Blocked'/>
            </Link>
        )}
        {type === 'withBackButton' && (
          <Link to='/chat_list'>
            <img src={arrow_back_ios} alt='Back'/>
          </Link>
        )}
      </div>
      <h2>{pageTitle}</h2>
      <div className='header-right'>
        {type === 'withIcons' && (
          <Link to='/new_chat'>
            <img src={rate_review} alt='New Message'/>
          </Link>
        )}
      </div>
    </header>
  )
}

export default Header
