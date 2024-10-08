import qs from 'qs';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { toast } from 'sonner';

interface IAuthContextValue {
  signedIn: boolean;
  signInWithGoogle: () => void;
  signOut: () => void;
  signIn: (accessToken: string) => void;
}

const AuthContext = createContext({} as IAuthContextValue);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [signedIn, setSignedIn] = useState(() => {
    const storedAccessToken = localStorage.getItem('oauthestudos:token');

    return !!storedAccessToken;
  });

  const signInWithGoogle = useCallback(() => {
    const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

    const options = qs.stringify({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      redirect_uri: 'http://localhost:5173/callbacks/google',
      response_type: 'code',
      scope: 'email profile',
    });

    window.location.href = `${baseUrl}?${options}`;
  }, []);


  const signIn = useCallback((accessToken: string) => {
    localStorage.setItem('oauthestudos:token', accessToken);

    setSignedIn(true);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('oauthestudos:token');

    setSignedIn(false);
    toast.info('Desconectou!');
  }, []);

  const value = useMemo<IAuthContextValue>(
    () => ({
      signedIn,
      signInWithGoogle,
      signOut,
      signIn,
    }),
    [signedIn, signInWithGoogle, signOut, signIn],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
