
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { z } from "zod";

// Define the signup form schema
const signupSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  education: z.string().min(1, "Education qualification is required")
});

type SignupFormData = z.infer<typeof signupSchema>;

const SignUpPage = () => {
  const { signup, isLoading } = useAuth();

  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    education: ""
  });

  const [errors, setErrors] = useState<Partial<SignupFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof SignupFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleEducationChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      education: value
    }));

    // Clear error when user makes a selection
    if (errors.education) {
      setErrors((prev) => ({
        ...prev,
        education: undefined
      }));
    }
  };

  const validateForm = () => {
    try {
      signupSchema.parse(formData);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const formattedErrors: Partial<SignupFormData> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            const path = error.path[0].toString();
            formattedErrors[path as keyof SignupFormData] = error.message;
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
      await signup(formData.name, formData.email, formData.password, formData.education);
      // Redirect handled in AuthContext
    } catch (error) {
      console.error("Signup error:", error);
      setIsSubmitting(false);
    }
  };

  // Use combined loading state
  const submitButtonDisabled = isSubmitting || isLoading;
  const submitButtonText = isSubmitting || isLoading ? "Creating account..." : "Sign up";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-brand-600 hover:text-brand-500">
                Sign in
              </Link>
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={errors.name ? "border-red-500" : ""}
                  disabled={submitButtonDisabled}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password (min 8 characters)"
                  className={errors.password ? "border-red-500" : ""}
                  disabled={submitButtonDisabled}
                />
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
              </div>

              <div>
                <Label htmlFor="education">Educational Qualification</Label>
                <Select onValueChange={handleEducationChange} value={formData.education} disabled={submitButtonDisabled}>
                  <SelectTrigger className={errors.education ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select your highest qualification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High School">High School</SelectItem>
                    <SelectItem value="Associate Degree">Associate Degree</SelectItem>
                    <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                    <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                    <SelectItem value="Self-taught">Self-taught</SelectItem>
                  </SelectContent>
                </Select>
                {errors.education && <p className="text-sm text-red-500 mt-1">{errors.education}</p>}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={submitButtonDisabled}>
              {submitButtonText}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            By signing up, you agree to our{" "}
            <a href="#" className="font-medium text-brand-600 hover:text-brand-500">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="font-medium text-brand-600 hover:text-brand-500">
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUpPage;
