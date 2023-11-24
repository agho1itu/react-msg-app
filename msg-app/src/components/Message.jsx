// should be deleted

import PropTypes from 'prop-types';

// this is a functional component called "Message" that receives a "message" prop
const Message = ({message}) => {
  const firstCharacter = message.sender[0];
  // tenary operator, makes sure the app does not crash if there is no message.
  const messagePreview = message.message ? message.message.slice(0, 30) : '';

  return (
  // a parent container for message 
    <div className='message'>
      <h4 className='profilepic'>{firstCharacter}</h4>
      <div className="previewInfo">
        <h4>{message.sender}</h4>
        <div className='previewInfoFlex'>
          <p>{messagePreview + '...'}</p>
          <p>{message.time}</p>
        </div>
      </div>
    </div>
  )
}
// exporting the "Message" component to make it available for use in other parts of the application.
export default Message

Message.propTypes = {
  message: PropTypes.shape({
    text: PropTypes.string,
    message: PropTypes.string,
    time: PropTypes.string,
  }).isRequired,
};