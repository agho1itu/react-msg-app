import Parse from 'parse';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import ChatListPage from './pages/ChatListPage';
import ChatRoomPage from './pages/ChatRoomPage';
import CreateChatPage from './pages/CreateChatPage';
import SignupPage from './pages/SignupPage';
import BlockedPage from './pages/BlockedPage';
import NewChatPage from './pages/NewChatPage';

// Parse initialization
const PARSE_APPLICATION_ID = 'VsY9uceqLwGZOTEY6CtcY7vgWgV8EQ5F5q4Kzp4E';
const PARSE_HOST_URL = 'https://parseapi.back4app.com/';
const PARSE_JAVASCRIPT_KEY = 'ZQkZa08MHFUILDJiRBMoPEpiAiotcALldDBqi2F5';
Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
Parse.serverURL = PARSE_HOST_URL;
Parse.liveQueryServerURL = 'ws://safechat6.b4a.io'; 


// React functional component for the App
function App() {
  return (
    <BrowserRouter>
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
