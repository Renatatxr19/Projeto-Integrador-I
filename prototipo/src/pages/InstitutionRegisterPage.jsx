import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import Logo from '../components/Logo';
import { ArrowLeft, Landmark, FileText, Phone, Mail, MapPin, Key, Image } from 'lucide-react';

const InstitutionRegisterPage = () => {
  const { loginInstitution } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Pre-populate with mock data for ease of testing
  const [formData, setFormData] = useState({
    name: 'ONG Cachorro Feliz',
    cnpj: '12.345.678/0001-99',
    description: 'Dedicada ao resgate e cuidado de animais abandonados. Trabalhamos para proporcionar uma vida digna e encontrar lares amorosos para cães e gatos em situação de vulnerabilidade.',
    address: 'Asa norte quadra 410, Brasília - DF',
    phone: '(61) 99999-9999',
    email: 'contato@cachorrofeliz.org',
    pixKey: 'pix@cachorrofeliz.org',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&h=500&fit=crop',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!formData.name.trim() || !formData.cnpj.trim() || !formData.email.trim() || !formData.pixKey.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha o Nome, CNPJ, Email e Chave Pix.',
        variant: 'destructive',
      });
      return;
    }

    // Save to localStorage for dynamic usage on ONG details page
    localStorage.setItem('registered_institution', JSON.stringify(formData));

    // Log in as institution
    loginInstitution(formData.name, formData.email);

    toast({
      title: 'Cadastro realizado!',
      description: `A instituição ${formData.name} foi cadastrada com sucesso.`,
    });

    // Navigate to institution dashboard
    navigate('/institution/dashboard');
  };

  return (
    <>
      <Helmet>
        <title>Cadastro de Instituição - Rede Solidária</title>
        <meta name="description" content="Cadastre sua ONG na Rede Solidária para receber doações." />
      </Helmet>

      <div className="flex flex-col min-h-screen bg-[#F8F4FC]">
        {/* Navigation Bar */}
        <div className="bg-white border-b border-purple-100 px-6 py-4 flex items-center justify-between sticky top-0 z-[2000] shadow-sm">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#7B4D9A] font-bold text-sm hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <div className="flex items-center gap-2">
            <Logo className="w-8 h-8" />
            <span className="font-extrabold text-[#5E3A75] text-sm hidden sm:inline-block">Rede Solidária</span>
          </div>
        </div>

        <div className="flex-1 py-8 px-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Header info */}
            <div className="text-center space-y-2">
              <div className="bg-white p-3.5 rounded-full inline-flex border border-purple-100 shadow-sm text-[#7B4D9A] mb-2">
                <Landmark className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#5E3A75] tracking-tight">Cadastro de Instituição</h1>
              <p className="text-muted-foreground text-sm font-semibold max-w-md mx-auto">
                Registre sua ONG parceira para poder divulgar suas necessidades e receber contribuições dos doadores da rede.
              </p>
            </div>

            {/* Registration Card Form */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-purple-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-[#7B4D9A] ml-1 flex items-center gap-1.5">
                      <Landmark className="w-3.5 h-3.5" /> Nome da ONG *
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ex: ONG Cachorro Feliz"
                      className="w-full h-11 px-4 rounded-xl bg-[#F8F4FC] border-none text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[#7B4D9A]"
                    />
                  </div>

                  {/* CNPJ */}
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-[#7B4D9A] ml-1 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> CNPJ *
                    </label>
                    <Input
                      type="text"
                      name="cnpj"
                      value={formData.cnpj}
                      onChange={handleChange}
                      placeholder="Ex: 12.345.678/0001-99"
                      className="w-full h-11 px-4 rounded-xl bg-[#F8F4FC] border-none text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[#7B4D9A]"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-[#7B4D9A] ml-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> Email para Contato *
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Ex: contato@ong.org"
                      className="w-full h-11 px-4 rounded-xl bg-[#F8F4FC] border-none text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[#7B4D9A]"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-[#7B4D9A] ml-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> Telefone / WhatsApp
                    </label>
                    <Input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Ex: (61) 99999-9999"
                      className="w-full h-11 px-4 rounded-xl bg-[#F8F4FC] border-none text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[#7B4D9A]"
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-bold text-[#7B4D9A] ml-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> Endereço Físico
                    </label>
                    <Input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Ex: Asa norte quadra 410, Brasília - DF"
                      className="w-full h-11 px-4 rounded-xl bg-[#F8F4FC] border-none text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[#7B4D9A]"
                    />
                  </div>

                  {/* Pix Key */}
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-[#7B4D9A] ml-1 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5" /> Chave Pix *
                    </label>
                    <Input
                      type="text"
                      name="pixKey"
                      value={formData.pixKey}
                      onChange={handleChange}
                      placeholder="Ex: pix@ong.org ou CNPJ"
                      className="w-full h-11 px-4 rounded-xl bg-[#F8F4FC] border-none text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[#7B4D9A]"
                    />
                  </div>

                  {/* Cover Image URL */}
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-[#7B4D9A] ml-1 flex items-center gap-1.5">
                      <Image className="w-3.5 h-3.5" /> URL da Imagem de Capa
                    </label>
                    <Input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="Ex: https://images.unsplash.com/..."
                      className="w-full h-11 px-4 rounded-xl bg-[#F8F4FC] border-none text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[#7B4D9A]"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-bold text-[#7B4D9A] ml-1 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> Descrição da ONG (Quem Somos)
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Fale um pouco sobre a missão e história da sua instituição..."
                      className="w-full p-4 rounded-xl bg-[#F8F4FC] border-none text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[#7B4D9A] resize-none font-sans font-medium"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-bold bg-[#7B4D9A] hover:bg-[#683E84] text-white rounded-3xl transition-all duration-200 active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
                  >
                    <Landmark className="w-5 h-5" />
                    Cadastrar e Entrar no Painel
                  </Button>
                </div>
              </form>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default InstitutionRegisterPage;
