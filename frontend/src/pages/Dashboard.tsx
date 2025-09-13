import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  DollarSign, 
  Target, 
  TrendingUp,
  Eye,
  ArrowRight
} from 'lucide-react';
import { dashboardService, DashboardData } from '@/services/dashboard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatCurrency, formatDate, formatPercentage, formatTipoAtivo, formatMatchScore } from '@/utils/format';
import { toast } from 'react-hot-toast';

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const dashboardData = await dashboardService.getDashboardData();
        setData(dashboardData);
      } catch (error) {
        toast.error('Erro ao carregar dados do dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Erro ao carregar dados do dashboard</p>
      </div>
    );
  }

  const stats = [
    {
      name: 'Originadores Cadastrados',
      value: data.originadores.length,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/originadores',
    },
    {
      name: 'Investidores Cadastrados',
      value: data.investidores.length,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/investidores',
    },
    {
      name: 'Matches Válidos',
      value: data.matches.length,
      icon: Target,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
      href: '/matches',
    },
    {
      name: 'Taxa de Match',
      value: data.originadores.length > 0 && data.investidores.length > 0 
        ? `${Math.round((data.matches.length / (data.originadores.length * data.investidores.length)) * 100)}%`
        : '0%',
      icon: TrendingUp,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100',
      href: '/matches',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Visão geral do sistema de matching AmFi
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="card p-6 hover:shadow-card-hover transition-all duration-200"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Originadores */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Originadores Recentes
              </h2>
              <Link
                to="/originadores"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Ver todos <ArrowRight className="inline h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {data.originadores.slice(0, 5).map((originador) => (
              <div key={originador.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {originador.nome_originador}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatTipoAtivo(originador.tipo_ativo)} • {formatCurrency(originador.volume_serie_senior)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Cadastrado em {formatDate(originador.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="badge badge-info">
                      CDI+ {formatPercentage(originador.taxa_cdi_plus)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {data.originadores.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Nenhum originador cadastrado ainda
              </div>
            )}
          </div>
        </div>

        {/* Recent Investidores */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Investidores Recentes
              </h2>
              <Link
                to="/investidores"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Ver todos <ArrowRight className="inline h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {data.investidores.slice(0, 5).map((investidor) => (
              <div key={investidor.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {investidor.nome_investidor}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatTipoAtivo(investidor.tipo_ativo)} • Min. {formatCurrency(investidor.volume_minimo)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Cadastrado em {formatDate(investidor.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="badge badge-success">
                      CDI+ {formatPercentage(investidor.taxa_minima_cdi_plus)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {data.investidores.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Nenhum investidor cadastrado ainda
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Matches */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Matches Válidos
            </h2>
            <Link
              to="/matches"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Ver todos <ArrowRight className="inline h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {data.matches.slice(0, 8).map((match, index) => (
            <div key={`${match.originador.id}-${match.investidor.id}`} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-medium text-gray-900">
                      {match.originador.nome_originador}
                    </h3>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <h3 className="text-sm font-medium text-gray-900">
                      {match.investidor.nome_investidor}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatTipoAtivo(match.originador.tipo_ativo)} • {formatCurrency(match.originador.volume_serie_senior)}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="badge badge-success">
                    Score: {formatMatchScore(match.match_score)}
                  </span>
                  <Link
                    to={`/matches?originador_id=${match.originador.id}`}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {data.matches.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p>Nenhum match encontrado</p>
              <p className="text-sm">Cadastre originadores e investidores para ver matches</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};