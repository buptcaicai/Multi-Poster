import { createContext, useState, type ReactNode } from 'react';

type TAuthContext = {
  user: {roles: string[]} | undefined;
  setUser: React.Dispatch<React.SetStateAction<{roles: string[]} | undefined>>;
}

export const AuthContext = createContext<TAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(undefined as {roles: string[]} | undefined);
  return (<AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>)
};
