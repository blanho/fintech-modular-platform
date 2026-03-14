import { useLocation } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

export function LoginPage() {
  const location = useLocation();
  const registered = location.state?.registered;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your FinTech account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {registered && (
            <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
              Account created successfully! Please sign in.
            </div>
          )}
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}