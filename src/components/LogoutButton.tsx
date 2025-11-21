import React from 'react';
import { Home, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function LogoutButton() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <button
      onClick={handleLogout} className="fixed top-4 left-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        title="Log Out"
    >
      <LogOut className="w-6 h-6 text-gray-600" />
    </button>
  );
}
