import './App.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar from './components/Navbar';
import MainContent from './components/mainContent/MainContent';
import MusicPlayer from './components/musicPlayer/MusicPlayer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Expr from './components/Expr';
import EnlargedPlaylistCard from './components/mainContent/EnlargedPlaylistCard';
import { MusicPlayerProvider } from './components/musicPlayer/MusicPlayerContext';
function App() {
  return (

    <MusicPlayerProvider>
    <Router>
      <Routes>
        
        {/* <Route path='/togo' element={<MainContent />} /> */}
        {/* <Route path='/togooo' element={<Expr />} /> */}
        {/* <Route path='/playlist/:name' element={<EnlargedPlaylistCard />} /> */}
      </Routes>
      <div className="web_elms_container dff">
        <Navbar />
        <MainContent />
        <MusicPlayer />
      </div>
    </Router>
    </MusicPlayerProvider>
  );
}

export default App;
