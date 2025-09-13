import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { RegisterRequest } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { isValidAmfiEmail } from '@/utils/format';

export const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<RegisterRequest & { confirmPassword: string }>();

  const password = watch('password');

  const onSubmit = async (data: RegisterRequest & { confirmPassword: string }) => {
    if (!isValidAmfiEmail(data.email)) {
      setError('email', {
        type: 'manual',
        message: 'Apenas emails @amfi.finance ou carolmullerbianco@gmail.com são permitidos'
      });
      return;
    }

    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Senhas não coincidem'
      });
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      // Error already handled by the auth context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Register Form */}
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
              Crie sua conta
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Ou{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                faça login na sua conta existente
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="form-label">
                  Nome completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    className={`input-field pl-10 ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="Seu nome completo"
                    {...register('name', {
                      required: 'Nome é obrigatório',
                      minLength: {
                        value: 2,
                        message: 'Nome deve ter pelo menos 2 caracteres',
                      },
                    })}
                  />
                </div>
                {errors.name && (
                  <p className="form-error">{errors.name.message}</p>
                )}
              </div>

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
                    autoComplete="new-password"
                    className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Crie uma senha segura"
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
                <label htmlFor="confirmPassword" className="form-label">
                  Confirmar senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`input-field pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder="Confirme sua senha"
                    {...register('confirmPassword', {
                      required: 'Confirmação de senha é obrigatória',
                      validate: value =>
                        value === password || 'Senhas não coincidem',
                    })}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="form-error">{errors.confirmPassword.message}</p>
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
                      Criar conta
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
                Bem-vindo à
              </h3>
              <h3 className="text-4xl font-bold mb-6">
                Revolução do Crédito
              </h3>
              <p className="text-xl opacity-90 max-w-md">
                Junte-se à plataforma que está transformando o matching
                entre originadores e investidores
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};