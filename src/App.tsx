import { Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/Home/HomePage.tsx';
import ToursPage from '@/pages/TourDetails/ToursPage.tsx';
import TourDetailsPage from '@/pages/Tours/TourDetailsPage.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/tours" element={<ToursPage />} />
      <Route path="/tours/:id" element={<TourDetailsPage />} />
    </Routes>
  );
}

export default App;
