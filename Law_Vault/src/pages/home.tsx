import React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'firebase/auth';

interface HomeProps {
  user: User | null;
  handleGoogleSignIn: () => void;
  handleSignOut: () => void;
}

const Home: React.FC<HomeProps> = ({ user, handleGoogleSignIn, handleSignOut }) => {
  return (
    <div className="min-h-screen text-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Law Vault</h1>
      
      {/* Authentication Section */}
      {!user ? (
        <button onClick={handleGoogleSignIn} className="btn-primary mb-6">
          Sign In with Google
        </button>
      ) : (
        <div className="mb-6 flex flex-col items-center">
          <p className="mb-2">Welcome to Law Vault, {user.displayName}</p>
          <img
            src={user.photoURL ?? 'default-avatar.png'}
            alt={user.displayName ?? 'User'}
            className="rounded-full h-16 w-16"
          />
        </div>
      )}

      {/* Main Options (only enabled if signed in) */}
      <div className="flex space-x-4">
        <Link to="/vault">
          <button
            className={` ${!user ? "opacity-50 cursor-not-allowed px-6 py-3 bg-gray-600 text-white rounded " : "btn-primary"}`}
            disabled={!user}
          >
            Vault
          </button>
        </Link>
        <Link to="/advisor">
          <button
            className={` ${!user ? "opacity-50 cursor-not-allowed px-6 py-3 bg-gray-600 text-white rounded " : "btn-primary"}`}
            disabled={!user}
          >
            Advisor
          </button>
        </Link>
      </div>

      {/* Additional Content */}
      {user && (
        <div className="mt-8 mb-8 text-center max-w-md">
          <p className="text-lg">
            Welcome to Law Vault! Access tamper-proof legal evidence stored on blockchain and get real-time legal analysis with our Advisor.
          </p>
        </div>
      )}

      {!user && (
        <div className="mt-8 text-center">
          <p className="text-lg">
            Please sign in to access the Vault and Advisor features.
          </p>
        </div>
      )}

      {/* Sign Out Option */}
      {user && (
        <button onClick={handleSignOut} className="btn-secondary">
          Sign Out
        </button>
      )}
    </div>
  );
};

export default Home;