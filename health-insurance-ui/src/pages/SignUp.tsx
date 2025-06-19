
import { SignUp } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-blue-950 dark:via-background dark:to-green-950 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Family Image and Quote */}
        <div className="hidden lg:flex flex-col items-center space-y-6 text-center">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              alt="Happy family at home"
              className="rounded-2xl shadow-2xl w-full max-w-md"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
          <div className="space-y-4 max-w-md">
            <h2 className="text-3xl font-bold text-foreground">Start Your Health Journey</h2>
            <p className="text-lg text-muted-foreground italic">
              "Every family deserves protection and peace of mind. Join thousands who trust HealthPredict."
            </p>
            <p className="text-sm text-muted-foreground">
              Get accurate health insurance predictions with AI-powered analytics.
            </p>
          </div>
        </div>

        {/* Right side - Sign Up Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">H</span>
              </div>
              <span className="text-2xl font-bold text-foreground">HealthPredict</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Create your account</h1>
            <p className="text-muted-foreground mt-2">Start your health journey today</p>
          </div>

          <div className="flex justify-center">
            <SignUp 
              forceRedirectUrl="/home"
              signInUrl="/signin"
            />
          </div>
          
          <div className="text-center text-sm mt-6">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/signin" className="text-blue-600 hover:underline dark:text-blue-400">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
