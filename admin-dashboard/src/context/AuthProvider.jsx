import * as React from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { supabase } from "../services/supabaseClient";
import { getFirebaseAuth } from "../services/firebaseClient";
import { isFirebaseBackend } from "../services/backendConfig";

const AuthProviderContext = React.createContext(undefined);

function mapFirebaseUser(u) {
  if (!u) return null;
  return {
    id: u.uid,
    email: u.email,
    user_metadata: {},
  };
}

export const AuthProvider = ({ children }) => {
  const [session, setSession] = React.useState(null);
  const useFirebase = isFirebaseBackend();

  React.useEffect(() => {
    if (useFirebase) {
      const auth = getFirebaseAuth();
      const unsub = onAuthStateChanged(auth, (user) => {
        setSession(user ? { user: mapFirebaseUser(user) } : null);
      });
      return () => unsub();
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => subscription.unsubscribe();
  }, [useFirebase]);

  const register = async (email, password) => {
    email = email.trim().toLowerCase();
    if (useFirebase) {
      const cred = await createUserWithEmailAndPassword(
        getFirebaseAuth(),
        email,
        password
      );
      return { user: mapFirebaseUser(cred.user) };
    }

    const { data: newSession, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (newSession?.user?.identities?.length === 0) {
      throw new Error("User already exists.");
    }

    return newSession;
  };

  const login = async (email, password) => {
    email = email.trim().toLowerCase();
    if (useFirebase) {
      const cred = await signInWithEmailAndPassword(
        getFirebaseAuth(),
        email,
        password
      );
      return { user: mapFirebaseUser(cred.user) };
    }

    const { data: newSession, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return newSession;
  };

  const logout = async () => {
    if (useFirebase) {
      await signOut(getFirebaseAuth());
      setSession(null);
      return;
    }
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
