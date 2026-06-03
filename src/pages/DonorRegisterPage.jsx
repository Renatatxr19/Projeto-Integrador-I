import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import Logo from '../components/Logo';
import { ArrowLeft, UserPlus, Mail, User } from 'lucide-react';

const DonorRegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, informe seu nome e email para realizar o cadastro.',
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

    // Save to registered donors in localStorage
    const savedDonors = localStorage.getItem('registered_donors');
    let donorsList = [];
    if (savedDonors) {
      try {
        donorsList = JSON.parse(savedDonors);
      } catch (err) {
        console.error(err);
      }
    }

    // Check if email already registered
    const emailExists = donorsList.some(d => d.email.toLowerCase() === email.trim().toLowerCase());
    if (emailExists) {
      toast({
        title: 'Email já cadastrado',
        description: 'Este email já está registrado. Por favor, faça login.',
        variant: 'destructive',
      });
      navigate('/donor/login');
      return;
    }

    // Add new donor
    const newDonor = { name: name.trim(), email: email.trim().toLowerCase() };
    donorsList.push(newDonor);
    localStorage.setItem('registered_donors', JSON.stringify(donorsList));

    // Auto-login
    login(newDonor.name, newDonor.email);

    toast({
      title: 'Cadastro concluído!',
      description: `Seja bem-vindo(a), ${newDonor.name}! Sua conta de doador foi criada.`,
    });

    navigate('/home');
  };

  return (
    <>
      <Helmet>
        <title>Criar Conta de Doador - Rede Solidária</title>
      </Helmet>

      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F4FC] p-6">
        <div className="w-full max-w-sm space-y-8 text-center bg-white p-8 rounded-3xl border border-purple-100 shadow-sm relative">
          
          {/* Back button */}
          <button
            onClick={() => navigate('/donor/auth-choice')}
            className="absolute top-6 left-6 text-[#7B4D9A] hover:text-[#5E3A75] transition-all flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          {/* Header */}
          <div className="flex flex-col items-center space-y-3 pt-4">
            <Logo className="w-16 h-16" />
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-[#5E3A75]">Criar Conta</h2>
              <p className="text-muted-foreground text-xs font-semibold">
                Cadastre-se como doador para ajudar ONGs parceiras.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-3">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#7B4D9A] ml-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Nome *
                </label>
                <Input
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-[#F8F4FC] border-none text-xs text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-[#7B4D9A]"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#7B4D9A] ml-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email *
                </label>
                <Input
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-[#F8F4FC] border-none text-xs text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-[#7B4D9A]"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-[#7B4D9A] hover:bg-[#683E84] text-white font-bold rounded-2xl transition-all duration-200 active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 text-xs pt-1"
            >
              <UserPlus className="w-4 h-4" />
              Finalizar Cadastro
            </Button>
          </form>

        </div>
      </div>
    </>
  );
};

export default DonorRegisterPage;
