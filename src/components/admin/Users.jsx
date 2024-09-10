import { useState } from 'react';
import { users as mockUsers } from '../../data';

const Users = () => {
  // State to manage users list
  const [users, setUsers] = useState(mockUsers);

  // Delete user by ID
  const handleDelete = (id) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">S/N</th>
            <th className="py-2 px-4 border-b">Username</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b text-center">{index + 1}</td> {/* Serial Number */}
              <td className="py-2 px-4 border-b text-center">{user.username}</td> {/* Username */}
              <td className="py-2 px-4 border-b text-center">{user.role}</td> {/* Role */}
              <td className="py-2 px-4 border-b text-center">
                <button 
                  onClick={() => handleDelete(user.id)} 
                  className="bg-red-500 text-white py-1 px-3 rounded"
                >
                  Delete
                </button>
              </td> {/* Action */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
