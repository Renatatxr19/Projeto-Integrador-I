import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Logo from '../components/Logo';
import { Heart, Landmark } from 'lucide-react';
import { Button } from '../components/ui/button';

const PortalPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Rede Solidária - Bem-vindo</title>
        <meta name="description" content="Seja bem-vindo à Rede Solidária. Conectando doadores a ONGs parceiras." />
      </Helmet>

      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F4FC] p-6">
        <div className="w-full max-w-2xl space-y-8 text-center">
          
          {/* Logo Section */}
          <div className="flex flex-col items-center space-y-3">
            <Logo className="w-24 h-24 sm:w-32 sm:h-32" />
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#5E3A75] tracking-tight">Rede Solidária</h1>
              <p className="text-muted-foreground text-sm font-semibold max-w-md mx-auto">
                Uma ponte de amor e cuidado ligando quem quer ajudar a quem mais precisa.
              </p>
            </div>
          </div>

          {/* Cards Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            
            {/* Card 1: Doador */}
            <div className="bg-white hover:bg-[#F3ECF8]/50 border border-purple-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between items-center text-center transition-all duration-300 hover:shadow-md hover:scale-[1.01] group space-y-4">
              <div className="bg-[#F8F4FC] group-hover:bg-white p-4 rounded-full text-[#7B4D9A] border border-purple-50 transition-colors shadow-inner">
                <Heart className="w-8 h-8 fill-[#7B4D9A]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-[#5E3A75] text-lg">Quero Doar</h3>
                <p className="text-xs text-muted-foreground font-semibold leading-relaxed px-4">
                  Encontre pontos de coleta próximos a você, resgate vouchers e acompanhe campanhas de doação.
                </p>
              </div>
              <Button
                onClick={() => navigate('/donor/auth-choice')}
                className="w-full h-11 bg-[#7B4D9A] hover:bg-[#683E84] text-white font-bold rounded-2xl transition-all duration-200 shadow-sm text-xs"
              >
                Entrar como Doador
              </Button>
            </div>

            {/* Card 2: Instituição */}
            <div className="bg-white hover:bg-[#F3ECF8]/50 border border-purple-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between items-center text-center transition-all duration-300 hover:shadow-md hover:scale-[1.01] group space-y-4">
              <div className="bg-[#F8F4FC] group-hover:bg-white p-4 rounded-full text-[#7B4D9A] border border-purple-50 transition-colors shadow-inner">
                <Landmark className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-[#5E3A75] text-lg">Sou uma Instituição</h3>
                <p className="text-xs text-muted-foreground font-semibold leading-relaxed px-4">
                  Cadastre sua ONG parceira, divulgue suas necessidades críticas e faça a gestão das doações recebidas.
                </p>
              </div>
              <Button
                onClick={() => navigate('/institution/auth-choice')}
                className="w-full h-11 bg-[#C6ACDC] hover:bg-[#B89ACF] text-white font-bold rounded-2xl transition-all duration-200 shadow-sm text-xs"
              >
                Acessar Painel ONG
              </Button>
            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default PortalPage;
