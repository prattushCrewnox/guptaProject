import React, { useState } from 'react';
import { LogOut, AlertTriangle, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-orange-400" />
            <h2 className="text-xl font-bold text-white">Confirm Logout</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-slate-300 mb-6">Are you sure you want to end your current session?</p>
          <div className="flex gap-4">
            <button
              onClick={onConfirm}
              className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-red-500/25"
            >
              Logout
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LogoutButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-slate-700 to-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/50 p-4 rounded-full shadow-2xl border border-slate-600/50 transition-all duration-300 z-50 group"
        aria-label="Logout"
      >
        <LogOut className="h-6 w-6 group-hover:text-cyan-400 transition-colors" />
      </button>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};
