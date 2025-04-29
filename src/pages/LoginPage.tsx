
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { z } from "zod";

// Define the login form schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { login, isLoading: authLoading } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    try {
      loginSchema.parse(formData);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const formattedErrors: Partial<LoginFormData> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            const path = error.path[0].toString();
            formattedErrors[path as keyof LoginFormData] = error.message;
          }
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await login(formData.email, formData.password);
      // Redirect handled in AuthContext
    } catch (error) {
      console.error("Login error:", error);
      setIsSubmitting(false);
    }
  };

  // Use combined loading state
  const submitButtonDisabled = isSubmitting || authLoading;
  const submitButtonText = isSubmitting || authLoading ? "Signing in..." : "Sign in";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-brand-600 hover:text-brand-500">
                Sign up
              </Link>
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={errors.email ? "border-red-500" : ""}
                  disabled={submitButtonDisabled}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-500">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={errors.password ? "border-red-500" : ""}
                  disabled={submitButtonDisabled}
                />
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={submitButtonDisabled}>
              {submitButtonText}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
