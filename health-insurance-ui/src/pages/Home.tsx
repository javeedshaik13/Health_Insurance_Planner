
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { api, type PredictionRequest, type PredictionResponse } from '@/config/api';

const Home = () => {
  const [formData, setFormData] = useState({
    age: '',
    dependants: '',
    income: '',
    geneticalRisk: '',
    insurancePlan: '',
    employmentStatus: '',
    gender: '',
    maritalStatus: '',
    bmiCategory: '',
    smokingStatus: '',
    region: '',
    medicalHistory: ''
  });
  const [prediction, setPrediction] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePredict = async () => {
    try {
      setIsLoading(true);

      // Validate required fields
      if (!formData.age || !formData.dependants === undefined || !formData.income === undefined) {
        toast({
          title: "Missing Information",
          description: "Please fill in Age, Number of Dependants, and Income fields.",
          variant: "destructive"
        });
        return;
      }

      // Show loading state
      toast({
        title: "Calculating...",
        description: "Getting your health insurance cost prediction.",
      });

      const requestData: PredictionRequest = {
        age: formData.age,
        dependants: formData.dependants,
        income: formData.income,
        geneticalRisk: formData.geneticalRisk,
        insurancePlan: formData.insurancePlan,
        employmentStatus: formData.employmentStatus,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        bmiCategory: formData.bmiCategory,
        smokingStatus: formData.smokingStatus,
        region: formData.region,
        medicalHistory: formData.medicalHistory
      };

      const data: PredictionResponse = await api.predict(requestData);

      if (data.success) {
        setPrediction(data.prediction);
        toast({
          title: "Prediction Generated!",
          description: `Your estimated annual premium is ₹${data.prediction.toLocaleString()}${data.source ? ` (via ${data.source})` : ''}`,
        });
      } else {
        throw new Error(data.error || 'Prediction failed');
      }

    } catch (error) {
      console.error('Prediction error:', error);
      toast({
        title: "Prediction Failed",
        description: "Unable to get prediction. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section with Family Image */}
      <div className="relative bg-gradient-to-br from-blue-50 via-background to-green-50 dark:from-blue-950 dark:via-background dark:to-green-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-bold text-foreground mb-6">
                Protect Your Family's 
                <span className="text-gradient bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"> Future</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Get an accurate estimate of your health insurance costs and secure your family's well-being with our AI-powered prediction tool.
              </p>
              <div className="bg-card/60 backdrop-blur-sm border rounded-lg p-6 mb-6">
                <p className="text-lg font-semibold text-foreground mb-2">
                  "The best time to plant a tree was 20 years ago. The second best time is now."
                </p>
                <p className="text-muted-foreground">
                  Don't wait for tomorrow to protect what matters most today.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Happy family at home"
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-foreground mb-4">Health Insurance Cost Predictor</h2>
          <p className="text-xl text-muted-foreground">Get an accurate estimate of your health insurance costs</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Fill in your details to get an accurate prediction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Age, Dependants, Income */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="18"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dependants">Number of Dependants</Label>
                    <Input
                      id="dependants"
                      type="number"
                      placeholder="0"
                      value={formData.dependants}
                      onChange={(e) => handleInputChange('dependants', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="income">Income in Lakhs</Label>
                    <Input
                      id="income"
                      type="number"
                      placeholder="0"
                      value={formData.income}
                      onChange={(e) => handleInputChange('income', e.target.value)}
                    />
                  </div>
                </div>

                {/* Genetical Risk, Insurance Plan, Employment */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="geneticalRisk">Genetical Risk</Label>
                    <Input
                      id="geneticalRisk"
                      type="number"
                      placeholder="0"
                      value={formData.geneticalRisk}
                      onChange={(e) => handleInputChange('geneticalRisk', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Insurance Plan</Label>
                    <Select onValueChange={(value) => handleInputChange('insurancePlan', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Bronze" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bronze">Bronze</SelectItem>
                        <SelectItem value="silver">Silver</SelectItem>
                        <SelectItem value="gold">Gold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Employment Status</Label>
                    <Select onValueChange={(value) => handleInputChange('employmentStatus', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Salaried" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="salaried">Salaried</SelectItem>
                        <SelectItem value="self-employed">Self Employed</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Gender, Marital Status, BMI */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Male" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Marital Status</Label>
                    <Select onValueChange={(value) => handleInputChange('maritalStatus', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Unmarried" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unmarried">Unmarried</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>BMI Category</Label>
                    <Select onValueChange={(value) => handleInputChange('bmiCategory', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Normal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="underweight">Underweight</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="overweight">Overweight</SelectItem>
                        <SelectItem value="obese">Obese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Smoking, Region, Medical History */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Smoking Status</Label>
                    <Select onValueChange={(value) => handleInputChange('smokingStatus', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="No Smoking" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-smoking">No Smoking</SelectItem>
                        <SelectItem value="smoking">Smoking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Region</Label>
                    <Select onValueChange={(value) => handleInputChange('region', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Northwest" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="northwest">Northwest</SelectItem>
                        <SelectItem value="northeast">Northeast</SelectItem>
                        <SelectItem value="southeast">Southeast</SelectItem>
                        <SelectItem value="southwest">Southwest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Medical History</Label>
                    <Select onValueChange={(value) => handleInputChange('medicalHistory', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="No Disease" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-disease">No Disease</SelectItem>
                        <SelectItem value="diabetes">Diabetes</SelectItem>
                        <SelectItem value="heart-disease">Heart Disease</SelectItem>
                        <SelectItem value="high-blood-pressure">High Blood Pressure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handlePredict}
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Calculating...' : 'Predict'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Prediction Result */}
            <Card>
              <CardHeader>
                <CardTitle>Prediction Result</CardTitle>
              </CardHeader>
              <CardContent>
                {prediction ? (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      ₹{prediction.toLocaleString()}
                    </div>
                    <p className="text-muted-foreground">Estimated Annual Premium</p>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <p>Fill in the form and click "Predict" to get your estimate</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Motivational Message */}
            <Card>
              <CardHeader>
                <CardTitle>Why Choose HealthPredict?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>💝 Peace of mind for your family</p>
                  <p>🏥 Access to quality healthcare</p>
                  <p>💰 Financial protection against medical emergencies</p>
                  <p>📊 AI-powered accurate cost predictions</p>
                </div>
              </CardContent>
            </Card>

            {/* Health Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Health Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Regular exercise can reduce insurance costs</li>
                  <li>• Maintain a healthy BMI</li>
                  <li>• Quit smoking for better rates</li>
                  <li>• Annual health checkups are important</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
