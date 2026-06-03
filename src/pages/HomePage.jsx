import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Search, Filter, Plus, X, Heart, User, Mail, LogOut, CheckCircle, HelpCircle, TrendingUp, Award } from 'lucide-react';
import Header from '../components/Header.jsx';
import BottomNavigation from '../components/BottomNavigation.jsx';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Html5QrcodeScanner } from 'html5-qrcode';
import Logo from '../components/Logo.jsx';
import L from 'leaflet';

// Custom purple teardrop pin icon containing the logo
const purplePinIcon = L.divIcon({
  html: `
    <div style="width: 40px; height: 50px; filter: drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.15));">
      <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Purple Teardrop -->
        <path d="M20 0C8.95 0 0 8.95 0 20C0 32.5 20 50 20 50C20 50 40 32.5 40 20C40 8.95 31.05 0 20 0Z" fill="#7B4D9A" stroke="white" stroke-width="1.5"/>
        <!-- White circle base -->
        <circle cx="20" cy="20" r="11" fill="white"/>
        <!-- Miniature hands holding heart logo -->
        <defs>
          <clipPath id="pinCircle">
            <circle cx="20" cy="20" r="10" />
          </clipPath>
        </defs>
        <image href="/logo.png" x="9" y="5" width="22" height="22" clip-path="url(#pinCircle)" preserveAspectRatio="xMidYMid slice" />
      </svg>
    </div>
  `,
  className: '',
  iconSize: [40, 50],
  iconAnchor: [20, 50],
  popupAnchor: [0, -45],
});

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { userName, email, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isValidated, setIsValidated] = useState(false);

  const filterOptions = [
    { id: 'alimentos', label: 'Alimentos' },
    { id: 'roupas', label: 'Roupas' },
    { id: 'fraldas', label: 'Fraldas' },
    { id: 'brinquedos', label: 'Brinquedos' },
    { id: 'semaforo', label: 'Semáforo' },
    { id: 'impacto', label: 'Impacto Coletivo' },
  ];

  const donationPoints = [
    { id: 1, name: 'ONG Cachorro Feliz', categories: ['alimentos', 'semaforo'], position: [-23.5505, -46.6333] },
    { id: 2, name: 'Instituto Esperança', categories: ['fraldas', 'brinquedos', 'impacto'], position: [-23.5605, -46.6433] },
    { id: 3, name: 'Casa do Bem', categories: ['roupas', 'alimentos', 'semaforo'], position: [-23.5405, -46.6233] },
  ];

  // Intercept state parameters from router navigation (e.g. Header or Bottom bar links)
  useEffect(() => {
    if (location.state && location.state.openModal) {
      setActiveModal(location.state.openModal);
      // Clean up location state to prevent repeating on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  // QR Scanner initialization
  useEffect(() => {
    let scanner = null;

    if (activeModal === 'scanner' && !isValidated) {
      const timer = setTimeout(() => {
        try {
          scanner = new Html5QrcodeScanner(
            'home-qr-reader',
            { fps: 10, qrbox: { width: 220, height: 220 } },
            false
          );

          scanner.render(
            (decodedText) => {
              if (scanner) {
                scanner.clear().catch(console.error);
              }
              setIsValidated(true);
            },
            (error) => {
              // Ignore constant scanner stream failures
            }
          );
        } catch (e) {
          console.error("Scanner init error:", e);
        }
      }, 300);

      return () => {
        clearTimeout(timer);
        if (scanner) {
          scanner.clear().catch(console.error);
        }
      };
    }
  }, [activeModal, isValidated]);

  const handleAddPoint = () => {
    toast({
      title: 'Em breve',
      description: 'Funcionalidade de adicionar pontos estará disponível em breve.',
    });
  };

  const handleFilterToggle = (filterId) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setIsValidated(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredPoints = donationPoints.filter(point => {
    const matchesSearch = point.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilters = selectedFilters.length === 0 || point.categories.some(cat => selectedFilters.includes(cat));
    return matchesSearch && matchesFilters;
  });

  return (
    <>
      <Helmet>
        <title>Painel Solidário - Rede Solidária</title>
        <meta name="description" content="Encontre pontos de doação próximos a você no mapa interativo." />
      </Helmet>

      <div className="flex flex-col min-h-screen bg-[#F8F4FC]">
        <Header title="Rede Solidária - Dashboard" />

        <div className="flex-1 pb-24 px-6 overflow-y-auto">
          <div className="container py-8 max-w-4xl mx-auto space-y-6">
            
            {/* 1. Welcome & Stats Banner */}
            <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-purple-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-[#F8F4FC] rounded-full p-3 border border-purple-100/50 shrink-0">
                  <User className="w-10 h-10 text-[#7B4D9A]" strokeWidth={1.5} />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-extrabold text-[#5E3A75] tracking-tight">
                    Olá, {userName || "Doador"}!
                  </h1>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Heart className="w-3.5 h-3.5 fill-[#7B4D9A] text-[#7B4D9A]" />
                    <span className="text-[10px] font-bold text-[#7B4D9A] bg-[#F3ECF8] px-2.5 py-0.5 rounded-full">Doador Ouro</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 border-t md:border-t-0 md:border-l border-purple-100/80 pt-4 md:pt-0 md:pl-6 shrink-0">
                <div className="text-center px-2">
                  <p className="text-lg md:text-xl font-extrabold text-[#7B4D9A]">3</p>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase">Doações</p>
                </div>
                <div className="text-center px-2 border-x border-purple-100/80">
                  <p className="text-lg md:text-xl font-extrabold text-[#7B4D9A]">15 kg</p>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase">Doados</p>
                </div>
                <div className="text-center px-2">
                  <p className="text-lg md:text-xl font-extrabold text-[#7B4D9A]">2</p>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase">ONGs</p>
                </div>
              </div>
            </div>

            {/* 2. Quick Actions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => setActiveModal('voucher')}
                className="bg-white hover:bg-[#F3ECF8] border border-purple-100 p-4 rounded-3xl text-left transition-all duration-200 active:scale-[0.98] shadow-sm flex flex-col justify-between h-28 group"
              >
                <div className="bg-[#F8F4FC] group-hover:bg-white p-2 rounded-2xl w-10 h-10 flex items-center justify-center border border-purple-50 transition-colors">
                  <Heart className="w-5 h-5 fill-[#7B4D9A] text-[#7B4D9A]" />
                </div>
                <div>
                  <p className="font-extrabold text-[#5E3A75] text-sm">Meu Voucher</p>
                  <p className="text-[10px] text-muted-foreground font-semibold">QR Code ativo</p>
                </div>
              </button>

              <button
                onClick={() => setActiveModal('scanner')}
                className="bg-white hover:bg-[#F3ECF8] border border-purple-100 p-4 rounded-3xl text-left transition-all duration-200 active:scale-[0.98] shadow-sm flex flex-col justify-between h-28 group"
              >
                <div className="bg-[#F8F4FC] group-hover:bg-white p-2 rounded-2xl w-10 h-10 flex items-center justify-center border border-purple-50 transition-colors">
                  <Search className="w-5 h-5 text-[#7B4D9A]" />
                </div>
                <div>
                  <p className="font-extrabold text-[#5E3A75] text-sm">Validar</p>
                  <p className="text-[10px] text-muted-foreground font-semibold">Escanear QR Code</p>
                </div>
              </button>

              <button
                onClick={() => setActiveModal('guide')}
                className="bg-white hover:bg-[#F3ECF8] border border-purple-100 p-4 rounded-3xl text-left transition-all duration-200 active:scale-[0.98] shadow-sm flex flex-col justify-between h-28 group"
              >
                <div className="bg-[#F8F4FC] group-hover:bg-white p-2 rounded-2xl w-10 h-10 flex items-center justify-center border border-purple-50 transition-colors">
                  <HelpCircle className="w-5 h-5 text-[#7B4D9A]" />
                </div>
                <div>
                  <p className="font-extrabold text-[#5E3A75] text-sm">Como Ajudar</p>
                  <p className="text-[10px] text-muted-foreground font-semibold">Passo a passo didático</p>
                </div>
              </button>

              <button
                onClick={() => setActiveModal('impact')}
                className="bg-white hover:bg-[#F3ECF8] border border-purple-100 p-4 rounded-3xl text-left transition-all duration-200 active:scale-[0.98] shadow-sm flex flex-col justify-between h-28 group"
              >
                <div className="bg-[#F8F4FC] group-hover:bg-white p-2 rounded-2xl w-10 h-10 flex items-center justify-center border border-purple-50 transition-colors">
                  <TrendingUp className="w-5 h-5 text-[#7B4D9A]" />
                </div>
                <div>
                  <p className="font-extrabold text-[#5E3A75] text-sm">Impacto</p>
                  <p className="text-[10px] text-muted-foreground font-semibold">Ações da comunidade</p>
                </div>
              </button>
            </div>

            {/* 3. Horizontal Map Frame */}
            <div className="bg-white rounded-3xl border border-purple-100 p-5 shadow-sm space-y-4">
              
              {/* Map Header Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-[#5E3A75] text-base tracking-tight">Mapa de Coleta</h3>
                  <p className="text-muted-foreground text-xs font-medium">Visualize os pontos de doação próximos</p>
                </div>
                
                <div className="flex gap-2 items-center sm:w-80">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Pesquise pontos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-10 text-xs text-foreground placeholder:text-muted-foreground bg-[#F8F4FC] border-none rounded-xl"
                    />
                  </div>
                  <Button
                    onClick={() => setActiveModal('filter')}
                    variant="outline"
                    className="bg-white hover:bg-[#F3ECF8] border border-purple-100 text-[#7B4D9A] rounded-xl w-10 h-10 flex items-center justify-center shadow-sm shrink-0 transition-transform duration-200 active:scale-95"
                    title="Filtrar categorias"
                  >
                    <Filter className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleAddPoint}
                    className="bg-[#7B4D9A] hover:bg-[#683E84] text-white rounded-xl w-10 h-10 flex items-center justify-center shadow-sm shrink-0 transition-transform duration-200 active:scale-95"
                    title="Adicionar ponto"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Active Filters list */}
              {selectedFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase mr-1">Filtros ativos:</span>
                  {selectedFilters.map(fId => {
                    const label = filterOptions.find(o => o.id === fId)?.label || fId;
                    return (
                      <span 
                        key={fId} 
                        onClick={() => handleFilterToggle(fId)}
                        className="bg-[#7B4D9A] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-lg cursor-pointer hover:bg-[#EF4444] transition-colors flex items-center gap-1"
                      >
                        {label} <X className="w-2.5 h-2.5" />
                      </span>
                    );
                  })}
                  <button 
                    onClick={() => setSelectedFilters([])}
                    className="text-[10px] text-[#7B4D9A] font-bold hover:underline ml-1"
                  >
                    Limpar todos
                  </button>
                </div>
              )}

              {/* Leaflet horizontal container */}
              <div className="relative rounded-2xl overflow-hidden border border-purple-50/50 bg-[#F8F4FC] h-[280px] sm:h-[380px] w-full">
                
                <button
                  onClick={() => setIsMapExpanded(true)}
                  className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2 text-xs font-bold text-[#7B4D9A] shadow-md border border-purple-100 transition-all duration-150 hover:bg-[#F3ECF8] active:scale-95 z-[1000] flex items-center gap-1.5"
                >
                  Ampliar Mapa
                </button>

                <MapContainer
                  center={[-23.5505, -46.6333]}
                  zoom={13}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  />
                  {filteredPoints.map((point) => (
                    <Marker
                      key={point.id}
                      position={point.position}
                      icon={purplePinIcon}
                      eventHandlers={{
                        click: () => navigate(`/ong/${point.id}`),
                      }}
                    >
                      <Popup>
                        <div className="text-center p-2 min-w-[150px]">
                          <p className="font-bold text-sm text-[#5E3A75] mb-1.5">{point.name}</p>
                          <button
                            onClick={() => navigate(`/ong/${point.id}`)}
                            className="bg-[#7B4D9A] text-white font-semibold text-xs px-3 py-1.5 rounded-xl hover:bg-[#683E84] transition-colors shadow-sm"
                          >
                            Ver detalhes da ONG
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

            </div>

            {/* 4. Active Voucher Widget */}
            <div className="bg-gradient-to-r from-purple-50/50 to-white rounded-3xl p-5 shadow-sm border border-purple-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2.5 rounded-2xl border border-purple-100 shadow-sm shrink-0">
                  <Heart className="w-6 h-6 fill-[#7B4D9A] text-[#7B4D9A]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#5E3A75] text-sm">Voucher de Doação Ativo</h4>
                  <p className="text-xs text-muted-foreground font-medium">Você tem 1 voucher pendente para a ONG Cachorro Feliz</p>
                </div>
              </div>
              <Button
                onClick={() => setActiveModal('voucher')}
                size="sm"
                className="bg-[#7B4D9A] hover:bg-[#683E84] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition-all duration-200 active:scale-95 shrink-0"
              >
                Ver QR Code
              </Button>
            </div>

            {/* 5. Featured ONGs Carousel/Grid */}
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-[#5E3A75] tracking-tight">Instituições Parceiras</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4">
                
                {/* ONG 1 */}
                <div 
                  onClick={() => navigate('/ong/1')}
                  className="bg-white rounded-3xl border border-purple-100 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-3"
                >
                  <div className="overflow-hidden rounded-2xl h-32 w-full bg-purple-50">
                    <img 
                      src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=250&fit=crop" 
                      alt="ONG Cachorro Feliz" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="bg-[#EF4444]/10 text-[#EF4444] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">Crítico</span>
                    <h4 className="font-extrabold text-[#5E3A75] text-sm pt-0.5">ONG Cachorro Feliz</h4>
                    <p className="text-[11px] text-muted-foreground truncate font-medium">Asa norte quadra 410</p>
                  </div>
                </div>

                {/* ONG 2 */}
                <div 
                  onClick={() => navigate('/ong/2')}
                  className="bg-white rounded-3xl border border-purple-100 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-3"
                >
                  <div className="overflow-hidden rounded-2xl h-32 w-full bg-purple-50">
                    <img 
                      src="https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&h=250&fit=crop" 
                      alt="Instituto Esperança" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="bg-[#F59E0B]/10 text-[#D97706] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">Baixo</span>
                    <h4 className="font-extrabold text-[#5E3A75] text-sm pt-0.5">Instituto Esperança</h4>
                    <p className="text-[11px] text-muted-foreground truncate font-medium">Asa sul quadra 208</p>
                  </div>
                </div>

                {/* ONG 3 */}
                <div 
                  onClick={() => navigate('/ong/3')}
                  className="bg-white rounded-3xl border border-purple-100 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-3"
                >
                  <div className="overflow-hidden rounded-2xl h-32 w-full bg-purple-50">
                    <img 
                      src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=250&fit=crop" 
                      alt="Casa do Bem" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="bg-[#10B981]/10 text-[#10B981] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">Estável</span>
                    <h4 className="font-extrabold text-[#5E3A75] text-sm pt-0.5">Casa do Bem</h4>
                    <p className="text-[11px] text-muted-foreground truncate font-medium">Setor Comercial Sul</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        <BottomNavigation />

        {/* ========================================================================= */}
        {/* MODAL 1: FILTROS CATEGORIAS */}
        {/* ========================================================================= */}
        {activeModal === 'filter' && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-xl border border-purple-100 relative overflow-hidden animate-in zoom-in-95 duration-200 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-[#5E3A75] tracking-tight">Filtros</h2>
                  <p className="text-muted-foreground text-xs font-semibold">Selecione categorias para exibir no mapa</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleCloseModal}
                  className="rounded-full bg-[#F8F4FC] hover:bg-[#F3ECF8] text-[#7B4D9A] w-8 h-8 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2.5 py-2">
                {filterOptions.map((option) => {
                  const isSelected = selectedFilters.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleFilterToggle(option.id)}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold shadow-sm transition-all duration-150 active:scale-95 border ${
                        isSelected
                          ? 'bg-[#7B4D9A] text-white border-transparent'
                          : 'bg-white text-[#7B4D9A] border-purple-100 hover:bg-[#F3ECF8]'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <Button
                onClick={handleCloseModal}
                className="w-full h-12 text-base font-bold bg-[#7B4D9A] hover:bg-[#683E84] text-white rounded-3xl transition-all"
              >
                Aplicar Filtros
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: MEU VOUCHER */}
        {/* ========================================================================= */}
        {activeModal === 'voucher' && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-xl border border-purple-100 relative overflow-hidden animate-in zoom-in-95 duration-200 space-y-6 text-center">
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <h2 className="text-xl font-extrabold text-[#5E3A75] tracking-tight">Voucher Digital</h2>
                  <p className="text-muted-foreground text-xs font-semibold">Sua Doação Está Chegando!</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleCloseModal}
                  className="rounded-full bg-[#F8F4FC] hover:bg-[#F3ECF8] text-[#7B4D9A] w-8 h-8 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-muted-foreground text-xs font-medium">
                Olá, <span className="font-bold text-[#7B4D9A]">{userName || "Doador"}</span>! Apresente o código na instituição parceira.
              </p>

              <div className="flex justify-center py-1">
                <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-sm">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=REDE-SOLIDARIA-2026" 
                    alt="QR Code de doação" 
                    className="w-36 h-36 rounded-lg mx-auto" 
                  />
                </div>
              </div>

              <div className="bg-[#F8F4FC] rounded-2xl p-3 border border-purple-50 text-xs font-semibold text-[#7B4D9A]">
                Mensagem personalizada para a sua doação!
              </div>

              <div className="flex justify-center">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F8F4FC] rounded-full text-[#5E3A75] font-bold border border-purple-50 text-xs">
                  <Heart className="w-3.5 h-3.5 fill-[#7B4D9A] text-[#7B4D9A]" />
                  <span>ONG Cachorro Feliz</span>
                </div>
              </div>

              <Button
                onClick={() => setActiveModal('scanner')}
                className="w-full h-12 text-base font-bold bg-[#7B4D9A] hover:bg-[#683E84] text-white rounded-3xl transition-all"
              >
                Validar Recebimento
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 3: SCANNER VALIDAR QR CODE */}
        {/* ========================================================================= */}
        {activeModal === 'scanner' && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-xl border border-purple-100 relative overflow-hidden animate-in zoom-in-95 duration-200">
              
              {isValidated ? (
                <div className="space-y-6 text-center animate-in zoom-in-95 duration-300">
                  <div className="flex justify-center">
                    <div className="bg-green-50 rounded-full p-4 border border-green-100 shadow-inner">
                      <CheckCircle className="w-16 h-16 text-green-500" strokeWidth={2} />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-[#5E3A75] tracking-tight">Doação Validada!</h2>
                    <p className="text-muted-foreground text-xs font-semibold mt-1">Obrigado por ajudar quem precisa</p>
                  </div>
                  <div className="bg-[#F8F4FC] rounded-2xl p-4 border border-purple-50 text-xs font-semibold text-[#7B4D9A]">
                    Sua contribuição foi registrada com sucesso e será entregue em breve.
                  </div>
                  <Button
                    onClick={handleCloseModal}
                    className="w-full h-12 text-base font-bold bg-[#7B4D9A] hover:bg-[#683E84] text-white rounded-3xl transition-all"
                  >
                    Fechar
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-[#5E3A75] tracking-tight">Validar Doação</h2>
                      <p className="text-muted-foreground text-xs font-semibold">Escaneie o código de recebimento</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleCloseModal}
                      className="rounded-full bg-[#F8F4FC] hover:bg-[#F3ECF8] text-[#7B4D9A] w-8 h-8 flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="w-full overflow-hidden rounded-2xl border-4 border-purple-200 bg-black aspect-square max-w-[240px] mx-auto">
                    <div id="home-qr-reader" className="w-full"></div>
                  </div>
                  
                  <p className="text-xs font-semibold text-muted-foreground text-center px-4">
                    Aponte a câmera para o QR code da instituição parceira.
                  </p>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 4: PERFIL DA MINHA CONTA */}
        {/* ========================================================================= */}
        {activeModal === 'profile' && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-xl border border-purple-100 relative overflow-hidden animate-in zoom-in-95 duration-200 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-[#5E3A75] tracking-tight">Minha Conta</h2>
                  <p className="text-muted-foreground text-xs font-semibold">Gerenciar seu perfil</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleCloseModal}
                  className="rounded-full bg-[#F8F4FC] hover:bg-[#F3ECF8] text-[#7B4D9A] w-8 h-8 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-col items-center py-1">
                <div className="bg-[#F8F4FC] rounded-full p-3 mb-2 border border-purple-100/50">
                  <User className="w-12 h-12 text-[#7B4D9A]" strokeWidth={1.5} />
                </div>
                <h3 className="font-extrabold text-[#5E3A75] text-lg">{userName || 'Usuário'}</h3>
                <p className="text-muted-foreground text-xs font-semibold">{email || 'usuario@email.com'}</p>
              </div>

              <div className="space-y-3">
                <div className="bg-[#F8F4FC]/70 rounded-xl p-3 flex items-center gap-3 border border-purple-50 text-xs">
                  <div className="bg-white p-2 rounded-lg shadow-sm text-[#7B4D9A]">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-muted-foreground">Nome</p>
                    <p className="font-bold text-[#5E3A75]">{userName || 'Usuário'}</p>
                  </div>
                </div>

                <div className="bg-[#F8F4FC]/70 rounded-xl p-3 flex items-center gap-3 border border-purple-50 text-xs">
                  <div className="bg-white p-2 rounded-lg shadow-sm text-[#7B4D9A]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-muted-foreground">Email</p>
                    <p className="font-bold text-[#5E3A75] truncate max-w-[200px]">{email || 'usuario@email.com'}</p>
                  </div>
                </div>

                <div className="bg-[#F8F4FC]/70 rounded-xl p-3 flex items-center gap-3 border border-purple-50 text-xs">
                  <div className="bg-white p-2 rounded-lg shadow-sm text-[#7B4D9A]">
                    <Heart className="w-4 h-4 fill-[#7B4D9A] text-[#7B4D9A]" />
                  </div>
                  <div>
                    <p className="font-semibold text-muted-foreground">Doações Realizadas</p>
                    <p className="font-bold text-[#5E3A75]">3 doações</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleLogout}
                className="w-full h-12 text-base font-bold bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-3xl transition-all flex items-center justify-center shadow-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair da conta
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 6: COMO AJUDAR GUIDE */}
        {/* ========================================================================= */}
        {activeModal === 'guide' && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-xl border border-purple-100 relative overflow-hidden animate-in zoom-in-95 duration-200 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-[#5E3A75] tracking-tight">Como Ajudar?</h2>
                  <p className="text-muted-foreground text-xs font-semibold">Aprenda a fazer sua doação na plataforma</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleCloseModal}
                  className="rounded-full bg-[#F8F4FC] hover:bg-[#F3ECF8] text-[#7B4D9A] w-8 h-8 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                <div className="flex gap-3 items-start">
                  <div className="bg-[#F8F4FC] text-[#7B4D9A] rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm shrink-0 border border-purple-50">1</div>
                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-sm text-[#5E3A75]">Escolha uma Instituição</h4>
                    <p className="text-xs text-muted-foreground font-medium">Navegue no mapa ou use a lista para selecionar uma ONG parceira.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="bg-[#F8F4FC] text-[#7B4D9A] rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm shrink-0 border border-purple-50">2</div>
                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-sm text-[#5E3A75]">Consulte Necessidades</h4>
                    <p className="text-xs text-muted-foreground font-medium">Veja a tabela de itens necessários na página da ONG. Itens em Vermelho (Crítico) precisam mais de ajuda.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="bg-[#F8F4FC] text-[#7B4D9A] rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm shrink-0 border border-purple-50">3</div>
                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-sm text-[#5E3A75]">Gere o Voucher</h4>
                    <p className="text-xs text-muted-foreground font-medium">Clique em "Doar" para gerar o Voucher Digital contendo o QR Code exclusivo da sua doação.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="bg-[#F8F4FC] text-[#7B4D9A] rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm shrink-0 border border-purple-50">4</div>
                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-sm text-[#5E3A75]">Confirme a Entrega</h4>
                    <p className="text-xs text-muted-foreground font-medium">Leve os mantimentos até a instituição física e valide o QR Code no local para registrar a doação.</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCloseModal}
                className="w-full h-12 text-base font-bold bg-[#7B4D9A] hover:bg-[#683E84] text-white rounded-3xl transition-all"
              >
                Entendi
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 7: IMPACTO SOCIAL */}
        {/* ========================================================================= */}
        {activeModal === 'impact' && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-xl border border-purple-100 relative overflow-hidden animate-in zoom-in-95 duration-200 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-[#5E3A75] tracking-tight">Impacto da Rede</h2>
                  <p className="text-muted-foreground text-xs font-semibold">Nossas conquistas coletivas</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleCloseModal}
                  className="rounded-full bg-[#F8F4FC] hover:bg-[#F3ECF8] text-[#7B4D9A] w-8 h-8 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#F8F4FC] rounded-2xl p-3 border border-purple-50 text-center space-y-1">
                  <p className="text-xl font-extrabold text-[#7B4D9A]">120+</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase">Doadores</p>
                </div>
                <div className="bg-[#F8F4FC] rounded-2xl p-3 border border-purple-50 text-center space-y-1">
                  <p className="text-xl font-extrabold text-[#7B4D9A]">850kg</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase">Mantimentos</p>
                </div>
                <div className="bg-[#F8F4FC] rounded-2xl p-3 border border-purple-50 text-center space-y-1">
                  <p className="text-xl font-extrabold text-[#7B4D9A]">450+</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase">Vidas Salvas</p>
                </div>
              </div>

              {/* Community news card */}
              <div className="bg-[#F8F4FC]/80 rounded-2xl p-4 border border-purple-50 space-y-2">
                <h4 className="font-extrabold text-[#5E3A75] text-xs flex items-center gap-1.5 uppercase tracking-wider">
                  <Award className="w-4 h-4 text-[#7B4D9A] shrink-0" /> Destaque Recente
                </h4>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  A <strong>ONG Cachorro Feliz</strong> conseguiu arrecadar 50kg de ração em tempo recorde esta semana graças às doações dos usuários! Seu apoio transforma vidas todos os dias.
                </p>
              </div>

              <Button
                onClick={handleCloseModal}
                className="w-full h-12 text-base font-bold bg-[#7B4D9A] hover:bg-[#683E84] text-white rounded-3xl transition-all"
              >
                Incrível!
              </Button>
            </div>
          </div>
        )}
        {/* ========================================================================= */}
        {/* MODAL 5: MAPA AMPLIADO FLUTUANTE */}
        {/* ========================================================================= */}
        {isMapExpanded && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl h-[80vh] rounded-3xl p-6 shadow-xl border border-purple-100 relative overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-[#5E3A75] tracking-tight">Visualização Ampliada do Mapa</h2>
                  <p className="text-muted-foreground text-xs font-semibold">Navegue pelos pontos de coleta e doação</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsMapExpanded(false)}
                  className="rounded-full bg-[#F8F4FC] hover:bg-[#F3ECF8] text-[#7B4D9A] w-8 h-8 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Extended Map Container */}
              <div className="w-full flex-1 rounded-2xl overflow-hidden border border-purple-50/50 bg-[#F8F4FC]">
                <MapContainer
                  center={[-23.5505, -46.6333]}
                  zoom={13}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  />
                  {filteredPoints.map((point) => (
                    <Marker
                      key={point.id}
                      position={point.position}
                      icon={purplePinIcon}
                      eventHandlers={{
                        click: () => navigate(`/ong/${point.id}`),
                      }}
                    >
                      <Popup>
                        <div className="text-center p-2 min-w-[150px]">
                          <p className="font-bold text-sm text-[#5E3A75] mb-1.5">{point.name}</p>
                          <button
                            onClick={() => {
                              setIsMapExpanded(false);
                              navigate(`/ong/${point.id}`);
                            }}
                            className="bg-[#7B4D9A] text-white font-semibold text-xs px-3 py-1.5 rounded-xl hover:bg-[#683E84] transition-colors shadow-sm"
                          >
                            Ver detalhes da ONG
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default HomePage;