import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import Logo from '../components/Logo';
import { ArrowLeft, LogIn, Mail } from 'lucide-react';

const DonorLoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState('');

  // Pre-seed a test donor if empty
  useEffect(() => {
    const savedDonors = localStorage.getItem('registered_donors');
    if (!savedDonors) {
      const defaultDonors = [
        { name: 'Bruna', email: 'bruna@email.com' }
      ];
      localStorage.setItem('registered_donors', JSON.stringify(defaultDonors));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast({
        title: 'Campo em branco',
        description: 'Por favor, informe seu email para realizar o login.',
        variant: 'destructive',
      });
      return;
    }

    const savedDonors = localStorage.getItem('registered_donors');
    let donorsList = [];
    if (savedDonors) {
      try {
        donorsList = JSON.parse(savedDonors);
      } catch (err) {
        console.error(err);
      }
    }

    const foundDonor = donorsList.find(d => d.email.toLowerCase() === email.trim().toLowerCase());

    if (foundDonor) {
      login(foundDonor.name, foundDonor.email);
      toast({
        title: 'Login efetuado',
        description: `Bem-vindo(a) de volta, ${foundDonor.name}!`,
      });
      navigate('/home');
    } else {
      toast({
        title: 'Doador não encontrado',
        description: 'O email informado não está cadastrado. Por favor, crie uma conta.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Login do Doador - Rede Solidária</title>
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
              <h2 className="text-xl font-extrabold text-[#5E3A75]">Entrar como Doador</h2>
              <p className="text-muted-foreground text-xs font-semibold">
                Informe o seu email cadastrado para acessar a Rede.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#7B4D9A] ml-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email
              </label>
              <Input
                type="email"
                placeholder="seuemail@exemplo.com"
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
              Entrar
            </Button>
          </form>

        </div>
      </div>
    </>
  );
};

export default DonorLoginPage;
