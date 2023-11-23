import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import WelcomePage from "./pages/WelcomePage";
import ChatListPage from './pages/ChatListPage';
import ChatRoomPage from "./pages/ChatRoomPage";
import SignupPage from "./pages/SignupPage";
import BlockedPage from "./pages/BlockedPage";
import NewChatPage from "./pages/NewChatPage";

// Import Parse minified version
import Parse from 'parse';

// Your Parse initialization configuration goes here
const PARSE_APPLICATION_ID = '2wNHlZeA7c6uqah1S53WQoSA2l5Aiz7NudJZgQcM';
const PARSE_HOST_URL = 'https://parseapi.back4app.com/';
const PARSE_JAVASCRIPT_KEY = 'C8bR1RQVEVxPxrfZuREXlFLmiUYGiyFacW4IkzPo';
Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
Parse.serverURL = PARSE_HOST_URL;

function App() {
  return (
    <BrowserRouter>
      {/* Link links refers to the pages */}
      <Link to='/'>SignIn</Link>
      <Link to='/signup'> SignUp </Link>
      <Link to='/chat_list'>chatList</Link>
      <Link to='/chat_room'>chat</Link>
      <Link to='/new_chat'> newChat </Link>
      <Link to='/blocked'> blocked </Link>
      <Routes>
        {/* Route refers to our pages.jsx */}
        <Route path='/' element={<WelcomePage />} />
        <Route path='/chat_list' element={<ChatListPage />} />
        <Route path='/chat_room/:chatId' element={<ChatRoomPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/blocked' element={<BlockedPage />} />
        <Route path='/new_chat' element={<NewChatPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;



