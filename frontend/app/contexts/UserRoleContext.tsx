import { createContext, useState, type ReactNode } from 'react';

export const AuthContext = createContext<{roles: string[]}>({ roles: ['admin'] });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);

  const login = (user: string) => setUser(user);

  return (<AuthContext.Provider value={{ roles: ['admin'] }}>
      {children}
    </AuthContext.Provider>)
};
