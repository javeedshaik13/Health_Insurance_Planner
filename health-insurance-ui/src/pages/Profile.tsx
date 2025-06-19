
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Edit, Save, Camera, Brain, Target, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1-234-567-8900',
    age: '32',
    height: '175',
    weight: '70',
    bloodType: 'O+',
    emergencyContact: 'Jane Doe - +1-234-567-8901'
  });

  const { toast } = useToast();

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated!",
      description: "Your profile information has been saved successfully.",
    });
  };

  const healthStats = [
    { label: 'BMI', value: '22.9', status: 'Normal', color: 'bg-green-100 text-green-800' },
    { label: 'Blood Pressure', value: '120/80', status: 'Normal', color: 'bg-green-100 text-green-800' },
    { label: 'Heart Rate', value: '72 bpm', status: 'Good', color: 'bg-green-100 text-green-800' },
    { label: 'Cholesterol', value: '180 mg/dL', status: 'Normal', color: 'bg-green-100 text-green-800' },
  ];

  const recentActivities = [
    { date: '2024-06-15', activity: 'Annual Health Checkup', result: 'Normal', doctor: 'Dr. Smith' },
    { date: '2024-06-10', activity: 'Blood Test', result: 'Normal', doctor: 'Dr. Johnson' },
    { date: '2024-06-05', activity: 'Dental Checkup', result: 'Clean', doctor: 'Dr. Brown' },
    { date: '2024-05-30', activity: 'Eye Examination', result: 'Normal', doctor: 'Dr. Wilson' },
  ];

  const aiSuggestions = [
    {
      icon: Target,
      title: 'Weight Management',
      suggestion: 'Your BMI is in the normal range. Continue your current diet and exercise routine to maintain optimal health.',
      priority: 'Low'
    },
    {
      icon: TrendingUp,
      title: 'Cardio Health',
      suggestion: 'Consider adding 150 minutes of moderate aerobic activity per week to improve cardiovascular health.',
      priority: 'Medium'
    },
    {
      icon: Brain,
      title: 'Mental Wellness',
      suggestion: 'Practice stress management techniques like meditation or yoga to maintain mental health balance.',
      priority: 'Medium'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Profile</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  >
                    {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold">{profileData.firstName} {profileData.lastName}</h3>
                    <p className="text-gray-600">{profileData.email}</p>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        value={profileData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        value={profileData.height}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        value={profileData.weight}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <Input
                      id="bloodType"
                      value={profileData.bloodType}
                      onChange={(e) => handleInputChange('bloodType', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      value={profileData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Health Statistics and AI Suggestions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Health Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Health Statistics</CardTitle>
                <CardDescription>Your current health metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {healthStats.map((stat, index) => (
                    <div key={index} className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
                      <Badge className={stat.color}>{stat.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Health Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <span>AI Health Suggestions</span>
                </CardTitle>
                <CardDescription>Personalized recommendations based on your health data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiSuggestions.map((suggestion, index) => {
                    const Icon = suggestion.icon;
                    return (
                      <div key={index} className="flex space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-purple-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
                            <Badge variant={suggestion.priority === 'High' ? 'destructive' : suggestion.priority === 'Medium' ? 'default' : 'secondary'}>
                              {suggestion.priority}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm">{suggestion.suggestion}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Medical Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Medical Activities</CardTitle>
                <CardDescription>Your medical history and checkups</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold text-gray-900">{activity.activity}</h4>
                        <p className="text-sm text-gray-600">
                          {activity.date} • {activity.doctor}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {activity.result}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Health Images */}
            <Card>
              <CardHeader>
                <CardTitle>Wellness Gallery</CardTitle>
                <CardDescription>Healthy lifestyle inspiration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                    alt="Healthy lifestyle"
                    className="rounded-lg object-cover h-32 w-full"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                    alt="Healthy food"
                    className="rounded-lg object-cover h-32 w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
