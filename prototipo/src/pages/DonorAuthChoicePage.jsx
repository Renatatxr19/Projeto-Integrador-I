import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Logo from '../components/Logo';
import { Button } from '../components/ui/button';
import { ArrowLeft, UserPlus, LogIn } from 'lucide-react';

const DonorAuthChoicePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Acesso do Doador - Rede Solidária</title>
      </Helmet>

      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F4FC] p-6">
        <div className="w-full max-w-md space-y-8 text-center bg-white p-8 rounded-3xl border border-purple-100 shadow-sm relative">
          
          {/* Back button */}
          <button
            onClick={() => navigate('/')}
            className="absolute top-6 left-6 text-[#7B4D9A] hover:text-[#5E3A75] transition-all flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          {/* Header */}
          <div className="flex flex-col items-center space-y-3 pt-4">
            <div className="bg-[#F8F4FC] p-3 rounded-full border border-purple-50 text-[#7B4D9A]">
              <Logo className="w-16 h-16" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-[#5E3A75]">Área do Doador</h2>
              <p className="text-muted-foreground text-xs font-semibold px-4">
                Você já possui um cadastro de doador na Rede Solidária?
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-4 pt-2">
            <Button
              onClick={() => navigate('/donor/login')}
              className="w-full h-12 bg-[#7B4D9A] hover:bg-[#683E84] text-white font-bold rounded-2xl transition-all duration-200 active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 text-sm"
            >
              <LogIn className="w-4 h-4" />
              Já tenho cadastro (Fazer Login)
            </Button>

            <Button
              onClick={() => navigate('/donor/register')}
              className="w-full h-12 bg-[#F8F4FC] hover:bg-[#F3ECF8] text-[#7B4D9A] border border-purple-100 font-bold rounded-2xl transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
            >
              <UserPlus className="w-4 h-4" />
              Não tenho cadastro (Criar Conta)
            </Button>
          </div>

        </div>
      </div>
    </>
  );
};

export default DonorAuthChoicePage;
