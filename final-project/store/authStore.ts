import { create } from 'zustand';

interface AuthState {
  user: { id: number; name: string; email: string; role: string } | null;
  isAuthenticated: boolean;
  login: (user: { id: number; name: string; email: string; role: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

// Contoh penggunaan di komponen React (client component):
// import { useAuthStore } from '@/store/authStore';
//
// function UserProfile() {
//   const { user, isAuthenticated, logout } = useAuthStore();
//
//   if (!isAuthenticated) {
//     return <p>Silakan login.</p>;
//   }
//
//   return (
//     <div>
//       <h2>Selamat datang, {user?.name}!</h2>
//       <p>Email: {user?.email}</p>
//       <p>Peran: {user?.role}</p>
//       <button onClick={logout}>Logout</button>
//     </div>
//   );
// }