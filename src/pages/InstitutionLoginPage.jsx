import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import Logo from '../components/Logo';
import { ArrowLeft, LogIn, Mail } from 'lucide-react';

const InstitutionLoginPage = () => {
  const { loginInstitution } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState('');

  // Pre-seed a test institution if empty
  useEffect(() => {
    const savedInst = localStorage.getItem('registered_institution');
    if (!savedInst) {
      const defaultInst = {
        name: 'ONG Cachorro Feliz',
        cnpj: '12.345.678/0001-99',
        description: 'Dedicada ao resgate e cuidado de animais abandonados. Trabalhamos para proporcionar uma vida digna e encontrar lares amorosos para cães e gatos em situação de vulnerabilidade.',
        address: 'Asa norte quadra 410, Brasília - DF',
        phone: '(61) 99999-9999',
        email: 'contato@cachorrofeliz.org',
        pixKey: 'pix@cachorrofeliz.org',
        image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&h=500&fit=crop',
      };
      localStorage.setItem('registered_institution', JSON.stringify(defaultInst));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast({
        title: 'Campo em branco',
        description: 'Por favor, informe o email da instituição para realizar o login.',
        variant: 'destructive',
      });
      return;
    }

    const savedInst = localStorage.getItem('registered_institution');
    let registeredInst = null;
    if (savedInst) {
      try {
        registeredInst = JSON.parse(savedInst);
      } catch (err) {
        console.error(err);
      }
    }

    if (registeredInst && registeredInst.email.toLowerCase() === email.trim().toLowerCase()) {
      loginInstitution(registeredInst.name, registeredInst.email);
      toast({
        title: 'Login efetuado',
        description: `Painel de controle da instituição "${registeredInst.name}" acessado.`,
      });
      navigate('/institution/dashboard');
    } else {
      toast({
        title: 'Instituição não encontrada',
        description: 'O email informado não corresponde a nenhuma instituição parceira cadastrada.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Login da Instituição - Rede Solidária</title>
      </Helmet>

      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F4FC] p-6">
        <div className="w-full max-w-sm space-y-8 text-center bg-white p-8 rounded-3xl border border-purple-100 shadow-sm relative">
          
          {/* Back button */}
          <button
            onClick={() => navigate('/institution/auth-choice')}
            className="absolute top-6 left-6 text-[#7B4D9A] hover:text-[#5E3A75] transition-all flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          {/* Header */}
          <div className="flex flex-col items-center space-y-3 pt-4">
            <Logo className="w-16 h-16" />
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-[#5E3A75]">Entrar como Instituição</h2>
              <p className="text-muted-foreground text-xs font-semibold">
                Informe o email cadastrado da ONG para gerenciar.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#7B4D9A] ml-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email da Instituição
              </label>
              <Input
                type="email"
                placeholder="ong@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-[#F8F4FC] border-none text-xs text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-[#7B4D9A]"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-[#7B4D9A] hover:bg-[#683E84] text-white font-bold rounded-2xl transition-all duration-200 active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 text-xs pt-1"
            >
              <LogIn className="w-4 h-4" />
              Entrar no Painel
            </Button>
          </form>

        </div>
      </div>
    </>
  );
};

export default InstitutionLoginPage;
