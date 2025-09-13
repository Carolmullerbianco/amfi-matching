import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginRequest } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { isValidAmfiEmail } from '@/utils/format';

export const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    if (!isValidAmfiEmail(data.email)) {
      setError('email', {
        type: 'manual',
        message: 'Apenas emails @amfi.finance ou carolmullerbianco@gmail.com são permitidos'
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (error) {
      // Error already handled by the auth context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              AmFi Matching
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Sistema de Matching para Originadores e Investidores
            </p>
            <h2 className="mt-8 text-2xl font-bold text-gray-900">
              Faça login na sua conta
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Ou{' '}
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                crie uma nova conta
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="seuemail@amfi.finance"
                    {...register('email', {
                      required: 'Email é obrigatório',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email inválido',
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="form-error">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="form-label">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Digite sua senha"
                    {...register('password', {
                      required: 'Senha é obrigatória',
                      minLength: {
                        value: 6,
                        message: 'Senha deve ter pelo menos 6 caracteres',
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="form-error">{errors.password.message}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary justify-center py-3"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      Entrar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Acesso restrito
                  </span>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Apenas emails @amfi.finance ou carolmullerbianco@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Brand/Visual */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500">
          <div className="absolute inset-0 bg-black bg-opacity-20" />
          <div className="relative h-full flex items-center justify-center p-12">
            <div className="text-center text-white">
              <h3 className="text-4xl font-bold mb-4">
                Conectando
              </h3>
              <h3 className="text-4xl font-bold mb-6">
                Originadores e Investidores
              </h3>
              <p className="text-xl opacity-90 max-w-md">
                Plataforma inteligente de matching para otimizar investimentos
                no mercado de crédito
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};