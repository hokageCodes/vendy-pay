import { useState } from 'react';
import { users } from '../data'; // Import user data
import { useNavigate } from 'react-router-dom'; // For navigation after login

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // For success message
  const [loading, setLoading] = useState(false); // Add a loading state
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Reset error state
    setSuccess(''); // Reset success state

    setTimeout(() => {
      const loggedInUser = users.find(
        (user) => user.username === username && user.password === password
      );

      if (loggedInUser) {
        // Show success message
        setSuccess('Login successful! Redirecting...');
        
        // Delay redirection to show success message
        setTimeout(() => {
          localStorage.setItem('userRole', loggedInUser.role);

          // Redirect to appropriate dashboard based on role
          if (loggedInUser.role === 'admin') {
            navigate('/admin');
          } else if (loggedInUser.role === 'user') {
            navigate('/user');
          }
        }, 1500); // Delay for success message visibility
      } else {
        setLoading(false);
        setError('Invalid credentials. Please try again.');
      }
    }, 1500); // Simulated delay
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-600">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          {success && <p className="text-green-600 text-center mb-4">{success}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 font-semibold rounded-lg transition ${
              loading ? 'bg-blue-400 cursor-not-allowed opacity-75' : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
