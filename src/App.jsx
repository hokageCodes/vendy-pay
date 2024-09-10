import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/admin/AdminLayout';
import Overview from './components/admin/Overview';
import InitiatePayout from './components/admin/InitiatePayout';
import Users from './components/admin/Users';
import Transactions from './components/admin/Transactions';
import UserDashboard from './components/UserDashboard';

const App = () => {
  const getUserRole = () => localStorage.getItem('userRole');

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<AuthGuard />} 
        />
        <Route 
          path="/login" 
          element={<Login />} 
        />
        <Route 
          path="/admin/*" 
          element={getUserRole() === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} 
        >
          <Route path="overview" element={<Overview />} />
          <Route path="payout" element={<InitiatePayout />} />
          <Route path="users" element={<Users />} />
          <Route path="transactions" element={<Transactions />} />
        </Route>
        <Route 
          path="/user/*" 
          element={getUserRole() === 'user' ? <UserDashboard /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
};

const AuthGuard = () => {
  const userRole = localStorage.getItem('userRole');

  if (!userRole) {
    return <Navigate to="/login" />;
  }

  return <Navigate to={`/admin`} />;
};

export default App;
