import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import Logo from '../components/Logo';
import { 
  Plus, Edit, Trash2, LogOut, Eye, Heart, Landmark, 
  CheckCircle, AlertTriangle, X, ShoppingBag, ListChecks 
} from 'lucide-react';

const InstitutionDashboardPage = () => {
  const { userName, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [editingId, setEditingId] = useState(null);

  // Form state
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemStatus, setItemStatus] = useState('Crítico');

  // Load products from localStorage or set defaults
  useEffect(() => {
    const saved = localStorage.getItem('ong_products');
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch (e) {
        console.error(e);
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

  // Save helper
  const saveProducts = (newProducts) => {
    setProducts(newProducts);
    localStorage.setItem('ong_products', JSON.stringify(newProducts));
  };

  const handleOpenAddModal = () => {
    setModalType('add');
    setItemName('');
    setItemQuantity('');
    setItemStatus('Crítico');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setModalType('edit');
    setEditingId(product.id);
    setItemName(product.name);
    setItemQuantity(product.quantity);
    setItemStatus(product.status);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSaveNeed = (e) => {
    e.preventDefault();
    if (!itemName.trim() || !itemQuantity.trim()) {
      toast({
        title: 'Campos em branco',
        description: 'Por favor, informe o nome do produto e a quantidade.',
        variant: 'destructive',
      });
      return;
    }

    if (modalType === 'add') {
      const newProduct = {
        id: Date.now(),
        name: itemName,
        quantity: itemQuantity,
        status: itemStatus,
      };
      saveProducts([...products, newProduct]);
      toast({
        title: 'Necessidade adicionada',
        description: `O item "${itemName}" foi adicionado com sucesso.`,
      });
    } else {
      const updatedProducts = products.map((p) =>
        p.id === editingId
          ? { ...p, name: itemName, quantity: itemQuantity, status: itemStatus }
          : p
      );
      saveProducts(updatedProducts);
      toast({
        title: 'Necessidade atualizada',
        description: `O item "${itemName}" foi atualizado com sucesso.`,
      });
    }

    handleCloseModal();
  };

  const handleDeleteNeed = (id, name) => {
    const updatedProducts = products.filter((p) => p.id !== id);
    saveProducts(updatedProducts);
    toast({
      title: 'Item excluído',
      description: `O item "${name}" foi removido da lista de necessidades.`,
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Helper to count semaphore items
  const countByStatus = (status) => {
    return products.filter((p) => p.status === status).length;
  };

  return (
    <>
      <Helmet>
        <title>Painel Administrativo - Rede Solidária</title>
        <meta name="description" content="Gerencie as necessidades e doações de sua ONG." />
      </Helmet>

      <div className="flex flex-col min-h-screen bg-[#F8F4FC]">
        {/* Navigation Bar */}
        <div className="bg-white border-b border-purple-100 px-6 py-4 flex items-center justify-between sticky top-0 z-[2000] shadow-sm">
          <div className="flex items-center gap-2">
            <Logo className="w-8 h-8" />
            <span className="font-extrabold text-[#5E3A75] text-sm">Painel da Instituição</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/ong/1')}
              variant="outline"
              size="sm"
              className="bg-[#F8F4FC] hover:bg-[#F3ECF8] text-[#7B4D9A] border-purple-100 font-bold rounded-xl flex items-center gap-1.5 transition-all text-xs"
            >
              <Eye className="w-4 h-4" />
              Visualizar Como Doador
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-[#EF4444] hover:bg-red-50 hover:text-red-600 font-bold rounded-xl flex items-center gap-1.5 transition-all text-xs"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 py-8 px-6 overflow-y-auto">
          <div className="container max-w-4xl mx-auto space-y-6">
            
            {/* Institution Banner */}
            <div className="bg-gradient-to-r from-[#7B4D9A] to-[#5E3A75] rounded-3xl p-6 text-white shadow-md border border-purple-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 rounded-2xl p-3 shrink-0 backdrop-blur-sm border border-white/10">
                  <Landmark className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
                    {userName || "ONG Cachorro Feliz"}
                  </h1>
                  <p className="text-white/80 text-xs font-semibold mt-0.5">Foco nas doações em andamento e necessidades críticas</p>
                </div>
              </div>
              <Button
                onClick={handleOpenAddModal}
                className="bg-white hover:bg-purple-50 text-[#7B4D9A] font-bold rounded-2xl h-11 px-5 shadow-sm shrink-0 transition-all duration-200 active:scale-[0.98] flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar Necessidade
              </Button>
            </div>

            {/* Semaphore Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Crítico */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase">Críticos (Urgentes)</p>
                  <p className="text-2xl font-extrabold text-[#EF4444]">{countByStatus('Crítico')}</p>
                </div>
                <div className="bg-red-50 p-3 rounded-full text-[#EF4444]">
                  <AlertTriangle className="w-6 h-6 fill-red-50" />
                </div>
              </div>

              {/* Baixo */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase">Atenção (Baixo Estoque)</p>
                  <p className="text-2xl font-extrabold text-[#F59E0B]">{countByStatus('Baixo')}</p>
                </div>
                <div className="bg-amber-50 p-3 rounded-full text-[#F59E0B]">
                  <AlertTriangle className="w-6 h-6 fill-amber-50" />
                </div>
              </div>

              {/* Estável */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase">Estável (Abastecido)</p>
                  <p className="text-2xl font-extrabold text-[#10B981]">{countByStatus('Estável')}</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-full text-[#10B981]">
                  <CheckCircle className="w-6 h-6 fill-emerald-50" />
                </div>
              </div>
            </div>

            {/* Needs List Table */}
            <div className="bg-white rounded-3xl border border-purple-100 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-purple-50 pb-3">
                <div>
                  <h3 className="font-extrabold text-[#5E3A75] text-base tracking-tight">Lista de Necessidades</h3>
                  <p className="text-muted-foreground text-xs font-medium">Itens de arrecadação cadastrados para a ONG</p>
                </div>
                <div className="bg-[#F8F4FC] px-3.5 py-1.5 rounded-full border border-purple-50 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-[#7B4D9A]" />
                  <span className="text-[11px] text-[#7B4D9A] font-extrabold">{products.length} Itens</span>
                </div>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="text-muted-foreground/40 flex justify-center">
                    <ListChecks className="w-16 h-16" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-bold text-[#5E3A75] text-sm">Nenhum item cadastrado</p>
                    <p className="text-xs text-muted-foreground font-semibold mt-0.5">Use o botão acima para adicionar novas doações à lista.</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-purple-100/50">
                        <th className="py-3 px-2 text-xs font-extrabold text-[#7B4D9A] uppercase tracking-wider">Produto</th>
                        <th className="py-3 px-2 text-xs font-extrabold text-[#7B4D9A] uppercase tracking-wider">Meta / Quantidade</th>
                        <th className="py-3 px-2 text-xs font-extrabold text-[#7B4D9A] uppercase tracking-wider">Semáforo</th>
                        <th className="py-3 px-2 text-right text-xs font-extrabold text-[#7B4D9A] uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-100/30">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-[#F8F4FC]/20 transition-colors">
                          <td className="py-3 px-2">
                            <span className="font-extrabold text-[#5E3A75] text-sm">{product.name}</span>
                          </td>
                          <td className="py-3 px-2">
                            <span className="text-xs text-muted-foreground font-bold">{product.quantity}</span>
                          </td>
                          <td className="py-3 px-2">
                            {product.status === 'Crítico' && (
                              <span className="inline-flex items-center gap-1 bg-[#EF4444]/10 text-[#EF4444] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse"></span> Crítico
                              </span>
                            )}
                            {product.status === 'Baixo' && (
                              <span className="inline-flex items-center gap-1 bg-[#F59E0B]/10 text-[#D97706] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span> Baixo
                              </span>
                            )}
                            {product.status === 'Estável' && (
                              <span className="inline-flex items-center gap-1 bg-[#10B981]/10 text-[#10B981] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span> Estável
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-2 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                onClick={() => handleOpenEditModal(product)}
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 rounded-lg text-[#7B4D9A] hover:bg-[#F3ECF8] hover:text-[#5E3A75]"
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => handleDeleteNeed(product.id, product.name)}
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 rounded-lg text-[#EF4444] hover:bg-red-50 hover:text-red-600"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* MODAL: ADICIONAR / EDITAR NECESSIDADE */}
        {/* ========================================================================= */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-xl border border-purple-100 relative overflow-hidden animate-in zoom-in-95 duration-200 space-y-6">
              
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-[#5E3A75] tracking-tight">
                    {modalType === 'add' ? 'Adicionar Necessidade' : 'Editar Necessidade'}
                  </h2>
                  <p className="text-muted-foreground text-xs font-semibold">
                    {modalType === 'add' ? 'Informe os detalhes do novo produto necessário' : 'Atualize as metas e o status de urgência'}
                  </p>
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

              <form onSubmit={handleSaveNeed} className="space-y-4">
                
                {/* Product Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#7B4D9A] ml-1">
                    Nome do Produto / Item
                  </label>
                  <Input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="Ex: Ração para Cães, Cobertores"
                    className="w-full h-11 px-4 rounded-xl bg-[#F8F4FC] border-none text-xs text-foreground focus-visible:ring-2 focus-visible:ring-[#7B4D9A]"
                  />
                </div>

                {/* Quantity */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#7B4D9A] ml-1">
                    Quantidade Atual / Meta
                  </label>
                  <Input
                    type="text"
                    value={itemQuantity}
                    onChange={(e) => setItemQuantity(e.target.value)}
                    placeholder="Ex: 5/50 kg, 12 unidades, 1/10 caixas"
                    className="w-full h-11 px-4 rounded-xl bg-[#F8F4FC] border-none text-xs text-foreground focus-visible:ring-2 focus-visible:ring-[#7B4D9A]"
                  />
                </div>

                {/* Status selector (Semaphore) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#7B4D9A] ml-1">
                    Urgência (Semáforo de Necessidade)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setItemStatus('Crítico')}
                      className={`h-11 rounded-xl text-xs font-bold transition-all border ${
                        itemStatus === 'Crítico'
                          ? 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]'
                          : 'bg-[#F8F4FC] text-muted-foreground border-transparent hover:bg-[#F3ECF8]'
                      }`}
                    >
                      🔴 Crítico
                    </button>
                    <button
                      type="button"
                      onClick={() => setItemStatus('Baixo')}
                      className={`h-11 rounded-xl text-xs font-bold transition-all border ${
                        itemStatus === 'Baixo'
                          ? 'bg-[#F59E0B]/15 text-[#D97706] border-[#F59E0B]'
                          : 'bg-[#F8F4FC] text-muted-foreground border-transparent hover:bg-[#F3ECF8]'
                      }`}
                    >
                      🟡 Baixo
                    </button>
                    <button
                      type="button"
                      onClick={() => setItemStatus('Estável')}
                      className={`h-11 rounded-xl text-xs font-bold transition-all border ${
                        itemStatus === 'Estável'
                          ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]'
                          : 'bg-[#F8F4FC] text-muted-foreground border-transparent hover:bg-[#F3ECF8]'
                      }`}
                    >
                      🟢 Estável
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full h-11 text-sm font-bold bg-[#7B4D9A] hover:bg-[#683E84] text-white rounded-xl shadow-sm transition-all"
                  >
                    {modalType === 'add' ? 'Adicionar Item' : 'Salvar Alterações'}
                  </Button>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default InstitutionDashboardPage;
