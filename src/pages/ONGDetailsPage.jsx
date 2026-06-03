import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MapPin, Heart, Phone, Mail, Copy, Smile, CheckCircle2, Info } from 'lucide-react';
import Header from '../components/Header.jsx';
import BottomNavigation from '../components/BottomNavigation.jsx';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

const ONGDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [ongData, setOngData] = useState({
    name: 'ONG Cachorro Feliz',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&h=500&fit=crop',
    description: 'Dedicada ao resgate e cuidado de animais abandonados. Trabalhamos para proporcionar uma vida digna e encontrar lares amorosos para cães e gatos em situação de vulnerabilidade.',
    address: 'Asa norte quadra 410, Brasília - DF',
    mapLink: 'https://maps.google.com',
    phone: '(61) 99999-9999',
    email: 'contato@cachorrofeliz.org',
    pixKey: 'pix@cachorrofeliz.org',
  });

  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Load registered institution details if matching
    const savedInst = localStorage.getItem('registered_institution');
    if (savedInst) {
      try {
        const parsed = JSON.parse(savedInst);
        setOngData((prev) => ({
          ...prev,
          ...parsed
        }));
      } catch (e) {
        console.error("Error parsing registered_institution:", e);
      }
    }

    // Load products
    const savedProducts = localStorage.getItem('ong_products');
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (e) {
        console.error("Error parsing ong_products:", e);
      }
    } else {
      const defaultProducts = [
        { id: 1, name: 'Ração', status: 'Crítico', quantity: '0/50 kg' },
        { id: 2, name: 'Sabonete', status: 'Estável', quantity: '20/20 un' },
        { id: 3, name: 'Medicamentos', status: 'Baixo', quantity: '2/10 caixas' },
      ];
      localStorage.setItem('ong_products', JSON.stringify(defaultProducts));
      setProducts(defaultProducts);
    }
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Crítico':
        return <Badge className="bg-[#EF4444] hover:bg-[#DC2626] text-white border-none shadow-sm rounded-full px-2.5 py-0.5 text-xs font-bold">Crítico</Badge>;
      case 'Estável':
        return <Badge className="bg-[#10B981] hover:bg-[#059669] text-white border-none shadow-sm rounded-full px-2.5 py-0.5 text-xs font-bold">Estável</Badge>;
      case 'Baixo':
        return <Badge className="bg-[#F59E0B] hover:bg-[#D97706] text-black border-none shadow-sm rounded-full px-2.5 py-0.5 text-xs font-bold">Baixo</Badge>;
      default:
        return <Badge variant="outline" className="rounded-full text-xs font-semibold">{status}</Badge>;
    }
  };

  const handleDonate = () => {
    navigate('/voucher');
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(ongData.pixKey);
    toast({
      title: 'Chave Pix Copiada!',
      description: 'A chave pix@cachorrofeliz.org foi copiada para sua área de transferência.',
    });
  };

  const handleVolunteer = () => {
    toast({
      title: 'Candidatura Enviada!',
      description: 'Obrigado pelo seu interesse! Entraremos em contato por e-mail em breve.',
    });
  };

  return (
    <>
      <Helmet>
        <title>{`${ongData.name} - Rede Solidária`}</title>
        <meta name="description" content={ongData.description} />
      </Helmet>

      <div className="flex flex-col min-h-screen bg-[#F8F4FC]">
        <Header title={`${ongData.name} - Detalhes`} />

        <div className="flex-1 pb-24 px-6 overflow-y-auto">
          <div className="container py-8 max-w-5xl mx-auto space-y-6">
            
            {/* Hero Image Section */}
            <div className="relative rounded-3xl overflow-hidden shadow-md border border-purple-100/50 bg-white group h-64 md:h-80">
              <img
                src={ongData.image}
                alt={ongData.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent flex flex-col justify-end p-6 md:p-8 space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-[#7B4D9A] text-white border-none rounded-full px-3 py-0.5 text-xs font-bold shadow-sm">
                    Causa Animal
                  </Badge>
                  <Badge className="bg-green-500 text-white border-none rounded-full px-3 py-0.5 text-xs font-bold shadow-sm flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Parceira Verificada
                  </Badge>
                </div>
                <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">{ongData.name}</h1>
                <p className="text-white/80 text-xs md:text-sm max-w-xl font-medium">{ongData.address}</p>
              </div>
            </div>

            {/* Asymmetric 2-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
              
              {/* Left Column (2/3) - Main Info */}
              <div className="md:col-span-2 space-y-6">
                
                {/* Quem Somos */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-purple-100 space-y-4">
                  <h2 className="text-xl font-extrabold text-[#5E3A75] tracking-tight">Quem Somos</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                    {ongData.description}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                    Atualmente abrigamos mais de 80 cães e gatos resgatados das ruas de Brasília. Todos recebem tratamento veterinário, castração, alimentação saudável e muito carinho até que encontrem uma nova família definitiva por meio de feiras de adoção.
                  </p>
                </div>

                {/* Como Ajudar */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-purple-100 space-y-6">
                  <h2 className="text-xl font-extrabold text-[#5E3A75] tracking-tight">Outras formas de ajudar</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Pix Option */}
                    <div className="bg-[#F8F4FC]/80 rounded-2xl p-5 border border-purple-50 flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-[#5E3A75] text-sm flex items-center gap-1.5">
                          Contribuição Financeira (Pix)
                        </h3>
                        <p className="text-[11px] text-muted-foreground font-semibold">
                          Ajude nas despesas veterinárias e exames mais urgentes.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          readOnly
                          value={ongData.pixKey}
                          className="bg-white text-xs h-10 border-purple-100 rounded-xl font-mono shrink min-w-0"
                        />
                        <Button
                          onClick={handleCopyPix}
                          size="icon"
                          className="bg-[#7B4D9A] hover:bg-[#683E84] text-white rounded-xl h-10 w-10 shrink-0 shadow-sm"
                          title="Copiar Pix"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Volunteer Option */}
                    <div className="bg-[#F8F4FC]/80 rounded-2xl p-5 border border-purple-50 flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-[#5E3A75] text-sm flex items-center gap-1.5">
                          Seja um Voluntário
                        </h3>
                        <p className="text-[11px] text-muted-foreground font-semibold">
                          Ajude nos mutirões de banho, carinho e passeios recreativos aos sábados!
                        </p>
                      </div>
                      <Button
                        onClick={handleVolunteer}
                        className="w-full bg-[#7B4D9A] hover:bg-[#683E84] text-white text-xs font-bold rounded-xl h-10 shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-1"
                      >
                        <Smile className="w-4 h-4" /> Quero Participar
                      </Button>
                    </div>

                  </div>
                </div>

                {/* Galeria de Fotos */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-purple-100 space-y-4">
                  <h2 className="text-xl font-extrabold text-[#5E3A75] tracking-tight font-bold">Nossos Resgatados</h2>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="overflow-hidden rounded-2xl h-24 sm:h-32 bg-purple-50">
                      <img
                        src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=300&fit=crop"
                        alt="Rescue pet 1"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="overflow-hidden rounded-2xl h-24 sm:h-32 bg-purple-50">
                      <img
                        src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop"
                        alt="Rescue pet 2"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="overflow-hidden rounded-2xl h-24 sm:h-32 bg-purple-50">
                      <img
                        src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=300&fit=crop"
                        alt="Rescue pet 3"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column (1/3) - Sidebar Info */}
              <div className="space-y-6">
                
                {/* Urgent items Table */}
                <div className="bg-white rounded-3xl shadow-sm border border-purple-100 overflow-hidden">
                  <div className="p-5 border-b border-purple-100/50 bg-gradient-to-r from-purple-50/30 to-transparent">
                    <h2 className="text-base font-bold text-[#5E3A75]">Itens Necessários</h2>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-purple-100/40">
                        <TableHead className="font-bold text-[#7B4D9A] text-xs">Produto</TableHead>
                        <TableHead className="font-bold text-[#7B4D9A] text-xs">Status</TableHead>
                        <TableHead className="text-right font-bold text-[#7B4D9A] text-xs">Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product, index) => (
                        <TableRow 
                          key={product.id}
                          className={`hover:bg-transparent border-purple-100/40 ${index % 2 === 0 ? 'bg-white' : 'bg-[#F8F4FC]/20'}`}
                        >
                          <TableCell className="py-2.5">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-[#5E3A75]">{product.name}</span>
                              <span className="text-[10px] text-muted-foreground font-medium">{product.quantity}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-2.5">{getStatusBadge(product.status)}</TableCell>
                          <TableCell className="text-right py-2.5">
                            <Button
                              onClick={handleDonate}
                              size="sm"
                              className="bg-[#7B4D9A] hover:bg-[#683E84] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl shadow-sm transition-all duration-200 active:scale-95"
                            >
                              Doar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Semaphore status explanation */}
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-purple-100 space-y-3">
                  <h2 className="text-xs font-bold text-[#5E3A75] tracking-tight flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-[#7B4D9A]" /> Entenda o Semáforo
                  </h2>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shrink-0 shadow-sm"></div>
                      <span className="text-[11px] font-semibold text-foreground">Vermelho = crítico</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shrink-0 shadow-sm"></div>
                      <span className="text-[11px] font-semibold text-foreground">Amarelo = médio</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] shrink-0 shadow-sm"></div>
                      <span className="text-[11px] font-semibold text-foreground">Verde = suprido</span>
                    </div>
                  </div>
                </div>

                {/* Contact Sidebar Details */}
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-purple-100 space-y-4">
                  <h2 className="text-base font-extrabold text-[#5E3A75] tracking-tight">Contato</h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs">
                      <div className="bg-[#F8F4FC] p-2 rounded-xl text-[#7B4D9A] shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-[#5E3A75]">{ongData.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <div className="bg-[#F8F4FC] p-2 rounded-xl text-[#7B4D9A] shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-[#5E3A75] truncate max-w-[180px]" title={ongData.email}>
                        {ongData.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <div className="bg-[#F8F4FC] p-2 rounded-xl text-[#7B4D9A] shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <a
                        href={ongData.mapLink}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-[#7B4D9A] hover:underline"
                      >
                        Ver no Google Maps
                      </a>
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate('/home')}
                    variant="outline"
                    className="w-full text-xs font-bold border-purple-150 text-[#7B4D9A] rounded-xl hover:bg-[#F3ECF8] h-10 shadow-sm mt-2"
                  >
                    Voltar ao Início
                  </Button>
                </div>

              </div>

            </div>

          </div>
        </div>

        <BottomNavigation />
      </div>
    </>
  );
};

export default ONGDetailsPage;