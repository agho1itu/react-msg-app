import WelcomePage from "./pages/WelcomePage";
import MessageListPage from './pages/MessageListPage';
import ChatRoomPage from "./pages/ChatRoomPage";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Link to='/'>Sign in</Link>
      <Link to='/msg-list'>msg-list</Link>
      <Link to='/chat-room'>chat</Link>
      <Routes>
        <Route path='/' element={<WelcomePage />}/> 
        <Route path='/msg-list' element={<MessageListPage />}/> 
        <Route path='/chat-room' element={<ChatRoomPage />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;

