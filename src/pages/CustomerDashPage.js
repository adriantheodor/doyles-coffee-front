import { useNavigate } from 'react-router-dom';

const CustomerDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }
  return (
    <div>
      <h1>Customer Dashboard</h1>
      <ul>
        <li>Place a new order</li>
        <li>View past orders</li>
        <li>Report an issue</li>
        <li>View invoices</li>
      </ul>
      {/* Add buttons/forms to actually do these actions */}
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default CustomerDashboard;