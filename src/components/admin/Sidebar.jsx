import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaMoneyBillWave, FaUsers, FaExchangeAlt, FaSignOutAlt } from 'react-icons/fa'; // Importing icons

const Sidebar = () => {

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good Morning';
    } else if (hour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };
  
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userRole'); // Clear user role from local storage
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col justify-between">
      {/* Admin Dashboard Text at the Top */}
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-6">{getGreeting}, Admin</h2>
      </div>

      {/* Navigation Links in the Middle */}
      <nav className="mt-24 flex-1 ml-4">
        <ul>
          <li className="mb-4">
            <Link to="/admin/overview" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaHome className="mr-2" /> Overview
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/admin/payout" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaMoneyBillWave className="mr-2" /> Initiate Payout
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/admin/users" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaUsers className="mr-2" /> Users
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/admin/transactions" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaExchangeAlt className="mr-2" /> Transactions
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout Button at the Bottom */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white p-2 rounded"
        >
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
