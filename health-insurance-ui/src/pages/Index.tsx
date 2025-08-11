
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, TrendingUp, Heart } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const features = [
    {
      icon: Shield,
      title: 'Health Insurance Prediction',
      description: 'Get accurate predictions for your health insurance costs based on your personal data.'
    },
    {
      icon: Users,
      title: 'Family Coverage',
      description: 'Calculate costs for multiple dependants and family members.'
    },
    {
      icon: TrendingUp,
      title: 'Health Analytics',
      description: 'Track your health trends and get personalized insights.'
    },
    {
      icon: Heart,
      title: 'AI Health Suggestions',
      description: 'Receive AI-powered recommendations for better health.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-blue-950 dark:via-background dark:to-green-950">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between border-b backdrop-blur-sm bg-background/80">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          <span className="text-xl font-bold text-foreground">HealthPredict</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!isAuthenticated ? (
            <>
              <Button asChild variant="outline">
                <Link to="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          ) : (
            <Button asChild variant="outline">
              <Link to="/home">Dashboard</Link>
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section with Happy Family */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Protect Your Family's Future
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl leading-relaxed">
                  Get accurate health insurance cost predictions with AI-powered analytics. 
                  Secure your family's well-being and enjoy peace of mind knowing they're protected.
                </p>
                <div className="bg-card/60 backdrop-blur-sm border rounded-lg p-4 my-6">
                  <p className="text-lg font-semibold text-foreground mb-2">
                    "Health is not valued until sickness comes."
                  </p>
                  <p className="text-muted-foreground">
                    Don't wait for tomorrow to protect what matters most today.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                {!isAuthenticated ? (
                  <>
                    <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                      <Link to="/signup">Get Started Free</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link to="/signin">Sign In</Link>
                    </Button>
                  </>
                ) : (
                  <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                    <Link to="/home">Go to Dashboard</Link>
                  </Button>
                )}
              </div>
            </div>
            
            {/* Happy Family Picture */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  alt="Happy smiling family enjoying time together at home"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                  src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 dark:bg-background/90 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-sm font-medium text-foreground">
                      💝 "Every family deserves protection and peace of mind"
                    </p>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-blue-400 to-green-400 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 bg-background/80 backdrop-blur-sm">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-foreground">Features That Care</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything your family needs for comprehensive health insurance planning and wellness journey.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 rounded-lg">
                        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <CardTitle className="text-foreground">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-600 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        <div className="container px-4 md:px-6 mx-auto relative">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                Ready to Protect Your Family?
              </h2>
              <p className="max-w-[600px] text-blue-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of families who trust HealthPredict for their health insurance planning and peace of mind.
              </p>
            </div>
            {!isAuthenticated ? (
              <Button asChild size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                <Link to="/signup">Start Your Free Journey</Link>
              </Button>
            ) : (
              <Button asChild size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                <Link to="/home">Access Your Dashboard</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
