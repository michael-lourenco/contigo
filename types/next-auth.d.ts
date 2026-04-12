import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    /** ID token do Google OAuth; usado uma vez no cliente para `signInWithCredential` no Firebase. */
    idToken?: string;
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    idToken?: string;
  }
}
