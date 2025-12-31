import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { register as registerAction, clearError } from '../../store/slices/authSlice';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated, error } = useAppSelector((state) => state.auth);
  const [showError, setShowError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const onSubmit = async (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    await dispatch(registerAction(registerData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-8">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-800">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          <div className="absolute -bottom-8 right-20 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-6000"></div>
        </div>
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-lg px-4 animate-fadeIn">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 space-y-6 transform transition-all duration-300 hover:shadow-3xl">
          {/* Logo/Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-105">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-gray-500">
              Join Task Manager and boost your productivity
            </p>
          </div>

          {/* Error Alert */}
          {showError && error && (
            <div className="animate-shake bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
              <button 
                onClick={() => setShowError(false)} 
                className="ml-auto flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="transform transition-all duration-200 hover:translate-x-1">
                  <Input
                    label="First Name"
                    type="text"
                    autoComplete="given-name"
                    placeholder="John"
                    {...register('firstName')}
                    error={errors.firstName?.message}
                    className="transition-all duration-200 focus:scale-[1.01]"
                  />
                </div>

                <div className="transform transition-all duration-200 hover:translate-x-1">
                  <Input
                    label="Last Name"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Doe"
                    {...register('lastName')}
                    error={errors.lastName?.message}
                    className="transition-all duration-200 focus:scale-[1.01]"
                  />
                </div>
              </div>

              <div className="transform transition-all duration-200 hover:translate-x-1">
                <Input
                  label="Username"
                  type="text"
                  autoComplete="username"
                  placeholder="johndoe"
                  {...register('username')}
                  error={errors.username?.message}
                  className="transition-all duration-200 focus:scale-[1.01]"
                />
              </div>

              <div className="transform transition-all duration-200 hover:translate-x-1">
                <Input
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  error={errors.email?.message}
                  className="transition-all duration-200 focus:scale-[1.01]"
                />
              </div>

              <div className="transform transition-all duration-200 hover:translate-x-1">
                <Input
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  {...register('password')}
                  error={errors.password?.message}
                  className="transition-all duration-200 focus:scale-[1.01]"
                />
              </div>

              <div className="transform transition-all duration-200 hover:translate-x-1">
                <Input
                  label="Confirm Password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                  className="transition-all duration-200 focus:scale-[1.01]"
                />
              </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-teal-600 hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-teal-600 hover:underline">Privacy Policy</Link>
            </p>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full py-3 text-base font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2" 
              loading={loading || isSubmitting}
            >
              {!loading && !isSubmitting && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 transform hover:scale-[1.02]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Sign in instead
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-white/70 text-sm mt-6">
          © 2025 Task Manager. All rights reserved.
        </p>
      </div>
    </div>
  );
};