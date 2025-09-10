import * as React from "react";
import { supabase } from "../services";

const AuthProviderContext = React.createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const fetchUser = async (userId) => {
    if (!userId) return null;

    const { data, error } = await supabase
      .from("users")
      .select(
        `
        id,
        email,
        display_name,
        avatar_url,
        roles: user_roles_user_id_fkey (
          role: roles (
            name
          )
        )
      `
      )
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      return null;
    }

    return data;
  };

  React.useEffect(() => {
    // get initial session
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session?.user?.id) {
        const fullUser = await fetchUser(data.session.user.id);
        setUser(fullUser);
      }
    });

    // listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (session?.user?.id) {
          try {
            const fullUser = await fetchUser(session.user.id);
            setUser(fullUser);
          } catch (err) {
            console.error("Error in fetchUser:", err);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      })();

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const register = async (email, password, displayName = "New User") => {
    email = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) throw error;

    if (data?.user?.identities?.length === 0) {
      throw new Error("User already exists.");
    }

    // if (data.session?.user?.id) {
    //   const fullUser = await fetchUser(data.session.user.id);
    //   setUser(fullUser);
    // } else {
    //   setUser(null);
    // }

    // return user;
  };

  const login = async (email, password) => {
    email = email.trim().toLowerCase();

    await logout();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.session?.user?.id) {
      const fullUser = await fetchUser(data.session.user.id);
      setUser(fullUser);
    } else {
      setUser(null);
    }

    return user;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
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
