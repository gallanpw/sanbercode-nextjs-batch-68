import NextAuth, { DefaultSession, DefaultJWT } from "next-auth";

// Definisikan tipe untuk peran pengguna Anda
type UserRole = "admin" | "student" | "teacher";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
    user: {
        id: string; // Tambahkan properti 'id'
        role: UserRole; // Tambahkan properti 'role' dengan tipe UserRole
    } & DefaultSession["user"]; // Gabungkan dengan properti user default
    }

    /**
     * Returned by the `jwt` callback and `getToken`, and received as a parameter in the `session` callback
     */
    interface JWT extends DefaultJWT {
    id: string; // Tambahkan properti 'id' ke JWT
    role: UserRole; // Tambahkan properti 'role' ke JWT
    }
}

// Jika Anda menggunakan provider kustom atau perlu memperluas tipe `User` yang dikembalikan oleh `authorize`
// declare module "next-auth/providers/credentials" {
//   interface User {
//     id: string;
//     role: UserRole;
//   }
// }