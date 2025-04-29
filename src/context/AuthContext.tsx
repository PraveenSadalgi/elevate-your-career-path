
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useNavigate } from 'react-router-dom';

type ProfilesRow = Database['public']['Tables']['profiles']['Row'];

type User = {
  id: string;
  email: string;
  name: string;
  education?: string;
  points: number;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, education: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserPoints: (points: number) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Custom hook for redirects
const useAuthRedirect = () => {
  const navigate = useNavigate();
  return { navigate };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { navigate } = useAuthRedirect();
  
  // Check for existing session on mount and setup auth listener
  useEffect(() => {
    setIsLoading(true);
    
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetchUserProfile(session.user.id);
      }
      setIsLoading(false);
    };
    
    getInitialSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          await fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Fetch user profile from profiles table
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }
      
      if (data) {
        const profile = data as ProfilesRow;
        setUser({
          id: profile.id,
          email: profile.email || '',
          name: profile.name || '',
          education: profile.education || undefined,
          points: profile.points
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };
  
  // Login with Supabase
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message
        });
        throw error;
      }
      
      // User profile will be fetched by the auth state change listener
      toast({
        title: "Logged in successfully",
        description: "Welcome back to ElevateCareer!"
      });
      
      // Redirect to dashboard after successful login
      navigate('/dashboard');
      
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Signup with Supabase
  const signup = async (name: string, email: string, password: string, education: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            education
          }
        }
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Signup failed",
          description: error.message
        });
        throw error;
      }
      
      // Wait for profile to be created
      if (data.user) {
        // Check if we need to create a profile manually
        // This is a safety check in case the database trigger didn't work
        setTimeout(async () => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user?.id)
            .single();
            
          if (!profileData) {
            // Create profile manually if it doesn't exist
            await supabase.from('profiles').insert({
              id: data.user.id,
              name,
              email,
              education,
              points: 0
            });
          }
          
          // Fetch the user profile
          await fetchUserProfile(data.user.id);
          
          // Redirect to dashboard after successful signup
          navigate('/dashboard');
        }, 1000); // Give the trigger a second to run
      }
      
      toast({
        title: "Account created",
        description: "Welcome to ElevateCareer!"
      });
      
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout with Supabase
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully"
      });
      // Redirect to home page after logout
      navigate('/');
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "An error occurred during logout"
      });
    }
  };
  
  // Update user points
  const updateUserPoints = async (points: number) => {
    if (!user) return;
    
    try {
      const newPoints = user.points + points;
      
      const { error } = await supabase
        .from('profiles')
        .update({ points: newPoints })
        .eq('id', user.id);
      
      if (error) {
        console.error("Error updating points:", error);
        return;
      }
      
      setUser({
        ...user,
        points: newPoints
      });
      
    } catch (error) {
      console.error("Error updating points:", error);
    }
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        signup, 
        logout,
        updateUserPoints
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
