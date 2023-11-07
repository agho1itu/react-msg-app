import menu from './assets/menu.svg';
import rate_review from './assets/rate_review.svg';

const MsgListHeader = () => {
  return (
    <div className='msglistheader'>
      <img src={menu} alt='Menu'/>
      <h2>Chats</h2>
      <img src={rate_review} alt='New Message'/>
    </div>

  )
}

export default MsgListHeader
