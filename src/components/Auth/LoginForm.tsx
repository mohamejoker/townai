// src/components/Auth/LoginForm.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface LoginFormProps {
  onLoginSuccess?: () => void;
  onLoginFailure?: (error: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onLoginFailure }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    // Basic validation
    if (!email || !password) {
      setError('Email and password are required.');
      setIsLoading(false);
      if (onLoginFailure) {
        onLoginFailure(new Error('Email and password are required.'));
      }
      return;
    }

    try {
      // Simulate API call for login
      console.log('Attempting login with:', { email, password });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      // Replace with actual login logic (e.g., calling an auth service)
      // For now, let's assume login is successful if email contains "test"
      if (email.includes('test')) {
        console.log('Login successful');
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        throw new Error('Invalid credentials. Try "test@example.com".');
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.message || 'An unexpected error occurred.');
      if (onLoginFailure) {
        onLoginFailure(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Please enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-center text-sm text-red-600 bg-red-100 border border-red-300 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
          {/* Add links for password recovery or registration if needed */}
          {/* <p className="mt-4 text-xs text-center text-gray-700">
            Forgot your password?{' '}
            <a href="#" className="underline">
              Reset it
            </a>
          </p> */}
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
