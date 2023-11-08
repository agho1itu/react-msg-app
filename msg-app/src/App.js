import WelcomePage from "./pages/WelcomePage";
import MessageListPage from './pages/MessageListPage';
import ChatRoomPage from "./pages/ChatRoomPage";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import SignupPage from "./pages/SignupPage";
import Examplepage from "./pages/Examplepage";

function App() {
  return (
    <BrowserRouter>
    {/* Link links refers to the pages */}
      <Link to='/'>Sign in</Link>
      <Link to='/msg-list'>msg-list</Link>
      <Link to='/chat-room'>chat</Link>
      <Link to='/signup'> signup </Link>
      <Link to='/example'> example</Link>
      <Routes>
        {/* Route refers to our pages.jsx */}
        <Route path='/' element={<WelcomePage />}/> 
        <Route path='/msg-list' element={<MessageListPage />}/> 
        <Route path='/chat-room' element={<ChatRoomPage />}/>
        <Route path='/signup' element={<SignupPage/>}/>
        <Route path='/example' element={<Examplepage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;



