import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthRefreshHandler from './components/AuthRefreshHandler';
import TimeSlotsInitializer from './components/TimeSlotsInitializer';
import Home from './pages/Home';
import Search from './pages/search/Search';
import Bookings from './pages/bookings/Bookings';
import Messages from './pages/messages/Messages';
import Booking from './pages/booking/Booking';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  // IDs des professionnels pour lesquels initialiser les créneaux
  const professionalIds = [1, 2, 3, 4, 5];

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <AuthRefreshHandler />
          <TimeSlotsInitializer professionalIds={professionalIds} />
          <div className="container mx-auto py-4 px-4">
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Routes protégées */}
              <Route element={<PrivateRoute />}>
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/booking/:id" element={<Booking />} />
                <Route path="/messages" element={<Messages />} />
              </Route>
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 