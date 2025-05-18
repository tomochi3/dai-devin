import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CalendarPage } from './pages/CalendarPage';
import { CounselorsPage } from './pages/CounselorsPage';
import { TalkNowPage } from './pages/TalkNowPage';
import { ScreeningPage } from './pages/ScreeningPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/counselors" element={<CounselorsPage />} />
        <Route path="/talk-now" element={<TalkNowPage />} />
        <Route path="/screening" element={<ScreeningPage />} />
        <Route path="/appointments" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App
