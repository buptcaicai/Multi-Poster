import { createContext, useState, type ReactNode } from 'react';

export type TAuthContext = {
  user: {username: string, roles: string[]} | undefined;
  setUser: React.Dispatch<React.SetStateAction<{username: string, roles: string[]} | undefined>>;
}

export const AuthContext = createContext<TAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(undefined as { username: string, roles: string[] } | undefined);
  return (<AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>)
};
