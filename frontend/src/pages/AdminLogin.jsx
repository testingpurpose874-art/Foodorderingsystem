import react, { useState } from "react";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PublicLayout from "../components/PublicLayout";
// import "bootstrap/dist/css/bootstrap.min.css";

const AdminLogin = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('http://127.0.0.1:8000/api/admin-login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.status === 200) {
      toast.success(data.message);
      localStorage.setItem("adminUser", username);
      setTimeout(() => {
        window.location.href = '/admin-dashboard';
      }, 2000);
    } else {
      toast.error(data.message);
    }

  }

  return (
    <PublicLayout>
      <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundImage: "url('/images/banner-3.webp')", backgroundSize: 'cover' }}>
        <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
          <h4 className="text-center mb-4"><FaUser className="me-2 icon-fix" />Admin Login</h4>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label"><FaUser className="me-1" />UserName</label>
              <input type="text" value={username} className="form-control" onChange={(e) => setUsername(e.target.value)} placeholder="Enter Admin Username" required />
            </div>
            <div className="mb-3">
              <label className="form-label"><FaLock className="me-1" />Password</label>
              <input type="password" value={password} className="form-control" onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" required />
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-3"><FaSignInAlt className="me-1" />Login</button>
          </form>
        </div>
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </PublicLayout>
  )
}

export default AdminLogin;