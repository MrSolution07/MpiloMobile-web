import * as React from "react";
import { supabase } from "../services";

const AuthProviderContext = React.createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = React.useState(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const register = async (email, password, displayName = "New User") => {
    email = email.trim().toLowerCase();
    const { data: newSession, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) throw error;

    if (newSession?.user?.identities?.length === 0) {
      throw new Error("User already exists.");
    }

    return newSession;
  };

  const login = async (email, password) => {
    email = email.trim().toLowerCase();
    const { data: newSession, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return newSession;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const value = {
    session,
    user: session?.user ?? null,
    isLoggedIn: !!session,
    register,
    login,
    logout,
  };

  return (
    <AuthProviderContext.Provider value={value}>
      {children}
    </AuthProviderContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = React.useContext(AuthProviderContext);

  if (context === undefined)
    throw new Error("useAuth must be used within a AuthProvider");

  return context;
};
