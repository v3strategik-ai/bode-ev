import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useAuth } from '../../../contexts/messenger/AuthContext';
import { Card, CardContent } from '../../ui/card';
import { Loader2 } from 'lucide-react';

const AuthContainer = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const { loading } = useAuth();

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  const handleAuthSuccess = (user) => {
    if (onAuthSuccess) {
      onAuthSuccess(user);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginForm 
            onToggleMode={toggleMode} 
            onSuccess={handleAuthSuccess}
          />
        ) : (
          <RegisterForm 
            onToggleMode={toggleMode} 
            onSuccess={handleAuthSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default AuthContainer;