import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import Logo from '../components/Logo';

const LoginPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha seu nome e email para fazer login.',
        variant: 'destructive',
      });
      return;
    }
    if (!email.includes('@')) {
      toast({
        title: 'Email inválido',
        description: 'Por favor, insira um email válido.',
        variant: 'destructive',
      });
      return;
    }
    login(name, email);
    navigate('/home');
  };

  const handleDonate = () => {
    if (!name.trim() || !email.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha seu nome e email para continuar como doador.',
        variant: 'destructive',
      });
      return;
    }
    login(name, email);
    navigate('/filters');
  };

  const handleInstitution = () => {
    navigate('/register-institution');
  };

  return (
    <>
      <Helmet>
        <title>Login - Rede Solidária</title>
        <meta name="description" content="Faça login na plataforma Rede Solidária para doar e ajudar instituições." />
      </Helmet>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-screen">
        <div className="w-full max-w-sm space-y-8">
          {/* Logo Section */}
          <div className="flex flex-col items-center text-center space-y-4">
            <Logo className="w-32 h-32" />
            <div className="space-y-1">
              <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Olá!</h1>
              <p className="text-muted-foreground font-medium">Seja bem-vindo(a) à Rede Solidária.</p>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#7B4D9A] ml-1">Nome</label>
                <Input 
                  type="text" 
                  placeholder="Seu nome" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full h-12 px-4 rounded-2xl bg-white border-none shadow-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-[#7B4D9A]" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#7B4D9A] ml-1">Email</label>
                <Input 
                  type="email" 
                  placeholder="Seu email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full h-12 px-4 rounded-2xl bg-white border-none shadow-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-[#7B4D9A]" 
                />
              </div>
            </div>

            {/* Buttons Section */}
            <div className="pt-2 space-y-4">
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-bold bg-[#C6ACDC] hover:bg-[#B89ACF] text-white rounded-3xl transition-all duration-200 active:scale-[0.98] shadow-sm"
              >
                Login
              </Button>

              <Button 
                type="button" 
                onClick={handleDonate} 
                className="w-full h-12 text-base font-bold bg-[#7B4D9A] hover:bg-[#683E84] text-white rounded-3xl transition-all duration-200 active:scale-[0.98] shadow-sm"
              >
                Quero Doar
              </Button>
            </div>

            {/* Divider and link */}
            <div className="pt-4 text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="h-px bg-muted-foreground/20 w-12"></div>
                <span className="text-xs text-muted-foreground font-semibold uppercase">ou</span>
                <div className="h-px bg-muted-foreground/20 w-12"></div>
              </div>
              
              <button 
                type="button" 
                onClick={handleInstitution} 
                className="text-base font-bold text-foreground hover:text-[#7B4D9A] transition-all duration-200"
              >
                Sou uma instituição
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;