import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import ChatListPage from './pages/ChatListPage';
import ChatRoomPage from './pages/ChatRoomPage';
import CreateChatPage from './pages/CreateChatPage';
import SignupPage from './pages/SignupPage';
import BlockedPage from './pages/BlockedPage';
import NewChatPage from './pages/NewChatPage';
import Parse from 'parse';

// Parse initialization
const PARSE_APPLICATION_ID = '2wNHlZeA7c6uqah1S53WQoSA2l5Aiz7NudJZgQcM';
const PARSE_HOST_URL = 'https://parseapi.back4app.com/';
const PARSE_JAVASCRIPT_KEY = 'C8bR1RQVEVxPxrfZuREXlFLmiUYGiyFacW4IkzPo';
Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
Parse.serverURL = PARSE_HOST_URL;
Parse.liveQueryServerURL = 'ws://safechat.b4a.io'; 


// React functional component for the App
function App() {
  return (
    <BrowserRouter>
      {/* Navigation Links 
      <nav>
        <Link to='/'>SignIn</Link>
        <Link to='/signup'>SignUp</Link>
        <Link to='/chat_list'>ChatList</Link>
        <Link to='/chat_room'>Chat</Link>
        <Link to='/new_chat'>NewChat</Link>
        <Link to='/blocked'>Blocked</Link>
      </nav>*/}

      {/* Routes Configuration */}
      <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path='/chat_list' element={<ChatListPage />} />
        <Route path='/chat_room/:chatId' element={<ChatRoomPage />} />
        <Route path='/new_chat_room/:userId' element={<CreateChatPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/blocked' element={<BlockedPage />} />
        <Route path='/new_chat' element={<NewChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

// Export the App component as the default export
export default App;
