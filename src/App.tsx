import { Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/Home/HomePage.tsx';
import ToursPage from '@/pages/Tours/ToursPage.tsx';
import TourDetailsPage from '@/pages/TourDetails/TourDetailsPage.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/tours/:countryId" element={<ToursPage />} />
      <Route path="/tour/:hotelId" element={<TourDetailsPage />} />
    </Routes>
  );
}

export default App;
