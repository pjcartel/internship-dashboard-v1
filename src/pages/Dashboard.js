import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { currentUser, logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
      
      {currentUser && (
        <div className="mb-4">
          <p className="text-lg">Logged in as:</p>
          <p className="font-semibold">{currentUser.email}</p>
        </div>
      )}

      <button 
        onClick={logout} 
        className="bg-red-500 text-white px-4 py-2 rounded">
        Logout
      </button>
    </div>
  );
}
