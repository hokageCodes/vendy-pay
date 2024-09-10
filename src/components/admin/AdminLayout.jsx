import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminDashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <Outlet /> {/* Renders the matched child route */}
      </main>
    </div>
  );
};

export default AdminDashboard;
