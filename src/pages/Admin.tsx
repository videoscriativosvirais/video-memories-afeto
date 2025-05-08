import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Users, Settings, CreditCard, Book, ChevronDown,
  Search, Filter, MoreVertical, Edit, Trash, Eye, PlusCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { formatDateWithTime, formatDate } from '@/lib/date-utils';
import { toast } from 'sonner';

// Mock user data
const users = [
  { id: 'user-1', name: 'Ana Silva', email: 'ana@example.com', memories: 5, createdAt: '2023-01-15', status: 'active' },
  { id: 'user-2', name: 'Carlos Mendes', email: 'carlos@example.com', memories: 3, createdAt: '2023-02-20', status: 'active' },
  { id: 'user-3', name: 'Maria Santos', email: 'maria@example.com', memories: 7, createdAt: '2023-01-05', status: 'active' },
  { id: 'user-4', name: 'João Ferreira', email: 'joao@example.com', memories: 2, createdAt: '2023-03-12', status: 'inactive' },
  { id: 'user-5', name: 'Luisa Costa', email: 'luisa@example.com', memories: 0, createdAt: '2023-03-18', status: 'active' },
];

// Mock payment data
const payments = [
  { id: 'pay-1', userId: 'user-1', userName: 'Ana Silva', amount: 19.90, date: '2023-03-25', status: 'completed' },
  { id: 'pay-2', userId: 'user-3', userName: 'Maria Santos', amount: 19.90, date: '2023-03-24', status: 'completed' },
  { id: 'pay-3', userId: 'user-2', userName: 'Carlos Mendes', amount: 19.90, date: '2023-03-22', status: 'completed' },
  { id: 'pay-4', userId: 'user-3', userName: 'Maria Santos', amount: 19.90, date: '2023-03-20', status: 'completed' },
  { id: 'pay-5', userId: 'user-3', userName: 'Maria Santos', amount: 19.90, date: '2023-03-18', status: 'completed' },
  { id: 'pay-6', userId: 'user-4', userName: 'João Ferreira', amount: 19.90, date: '2023-03-15', status: 'completed' },
  { id: 'pay-7', userId: 'user-2', userName: 'Carlos Mendes', amount: 19.90, date: '2023-03-10', status: 'completed' },
  { id: 'pay-8', userId: 'user-1', userName: 'Ana Silva', amount: 19.90, date: '2023-03-05', status: 'completed' },
];

// Mock memories data
const memories = [
  { id: 'mem-1', userId: 'user-1', userName: 'Ana Silva', title: 'Nosso primeiro encontro', createdAt: '2023-03-23', photos: 8, emoji: '❤️' },
  { id: 'mem-2', userId: 'user-3', userName: 'Maria Santos', title: 'Viagem a Paris', createdAt: '2023-03-22', photos: 10, emoji: '🗼' },
  { id: 'mem-3', userId: 'user-2', userName: 'Carlos Mendes', title: 'Formatura', createdAt: '2023-03-20', photos: 6, emoji: '🎓' },
  { id: 'mem-4', userId: 'user-3', userName: 'Maria Santos', title: 'Aniversário do Pedro', createdAt: '2023-03-18', photos: 7, emoji: '🎂' },
  { id: 'mem-5', userId: 'user-3', userName: 'Maria Santos', title: 'Natal em família', createdAt: '2023-03-15', photos: 5, emoji: '🎄' },
  { id: 'mem-6', userId: 'user-4', userName: 'João Ferreira', title: 'Casamento', createdAt: '2023-03-12', photos: 9, emoji: '💍' },
  { id: 'mem-7', userId: 'user-2', userName: 'Carlos Mendes', title: 'Nascimento da Laura', createdAt: '2023-03-10', photos: 4, emoji: '👶' },
  { id: 'mem-8', userId: 'user-1', userName: 'Ana Silva', title: 'Nossa lua de mel', createdAt: '2023-03-05', photos: 10, emoji: '🏝️' },
];

const AdminHeader: React.FC = () => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b">
    <div>
      <h1 className="text-3xl font-bold">Painel Administrativo</h1>
      <p className="text-gray-500">Gerencie usuários, pagamentos e configurações</p>
    </div>

    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar..."
          className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-memory-500"
        />
      </div>

      <Button variant="outline" className="gap-2">
        <Filter className="h-4 w-4" />
        Filtros
      </Button>
    </div>
  </div>
);

const AdminSidebar: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({
  activeTab,
  setActiveTab
}) => (
  <div className="w-full md:w-64 bg-white rounded-lg border p-4 mb-6 md:mb-0 md:mr-6">
    <div className="space-y-1">
      <Button
        variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
        className={`w-full justify-start ${activeTab === 'dashboard' ? 'bg-memory-500' : ''}`}
        onClick={() => setActiveTab('dashboard')}
      >
        <Book className="h-5 w-5 mr-2" />
        Dashboard
      </Button>

      <Button
        variant={activeTab === 'users' ? 'default' : 'ghost'}
        className={`w-full justify-start ${activeTab === 'users' ? 'bg-memory-500' : ''}`}
        onClick={() => setActiveTab('users')}
      >
        <Users className="h-5 w-5 mr-2" />
        Usuários
      </Button>

      <Button
        variant={activeTab === 'memories' ? 'default' : 'ghost'}
        className={`w-full justify-start ${activeTab === 'memories' ? 'bg-memory-500' : ''}`}
        onClick={() => setActiveTab('memories')}
      >
        <Book className="h-5 w-5 mr-2" />
        Memórias
      </Button>

      <Button
        variant={activeTab === 'payments' ? 'default' : 'ghost'}
        className={`w-full justify-start ${activeTab === 'payments' ? 'bg-memory-500' : ''}`}
        onClick={() => setActiveTab('payments')}
      >
        <CreditCard className="h-5 w-5 mr-2" />
        Pagamentos
      </Button>

      <Button
        variant={activeTab === 'settings' ? 'default' : 'ghost'}
        className={`w-full justify-start ${activeTab === 'settings' ? 'bg-memory-500' : ''}`}
        onClick={() => setActiveTab('settings')}
      >
        <Settings className="h-5 w-5 mr-2" />
        Configurações
      </Button>
    </div>

    <div className="pt-6 mt-6 border-t">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-memory-200 rounded-full mr-2"></div>
        <div>
          <p className="text-sm font-medium">Admin</p>
          <p className="text-xs text-gray-500">admin@example.com</p>
        </div>
        <ChevronDown className="h-4 w-4 ml-auto" />
      </div>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  // Dashboard summary stats
  const stats = [
    { title: 'Total de Usuários', value: users.length, change: '+12%', changeType: 'positive' },
    { title: 'Memórias Criadas', value: memories.length, change: '+18%', changeType: 'positive' },
    { title: 'Pagamentos', value: `R$ ${payments.length * 19.9}`, change: '+8%', changeType: 'positive' },
    { title: 'Taxa de Conversão', value: '24%', change: '-2%', changeType: 'negative' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border p-6">
            <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold">{stat.value}</p>
              <span className={`ml-2 text-xs ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-medium mb-4">Memórias recentes</h3>
          <div className="space-y-3">
            {memories.slice(0, 5).map((memory) => (
              <div key={memory.id} className="flex items-center justify-between py-1 border-b">
                <div>
                  <p className="font-medium">{memory.title}</p>
                  <p className="text-sm text-gray-500">{memory.userName}</p>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-xl">{memory.emoji}</span>
                  <span className="text-sm text-gray-500">{formatDate(memory.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-4">
            Ver todas as memórias
          </Button>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-medium mb-4">Pagamentos recentes</h3>
          <div className="space-y-3">
            {payments.slice(0, 5).map((payment) => (
              <div key={payment.id} className="flex items-center justify-between py-1 border-b">
                <div>
                  <p className="font-medium">{payment.userName}</p>
                  <p className="text-sm text-gray-500">
                    {formatDateWithTime(payment.date)}
                  </p>
                </div>
                <div>
                  <p className="font-medium">R$ {payment.amount.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-4">
            Ver todos os pagamentos
          </Button>
        </div>
      </div>
    </div>
  );
};

const AdminUsers: React.FC = () => {
  const { addAdmin } = useAdmin();
  const [showAddAdminDialog, setShowAddAdminDialog] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail) {
      toast.error('Por favor, informe um email');
      return;
    }

    setIsSubmitting(true);
    const success = await addAdmin(adminEmail);

    if (success) {
      setAdminEmail('');
      setShowAddAdminDialog(false);
    }
    setIsSubmitting(false);
  };

  return (
  <div className="bg-white rounded-lg border">
    <div className="p-4 border-b flex justify-between items-center">
      <h3 className="font-medium">Usuários ({users.length})</h3>
      <div className="flex gap-2">
        <Button onClick={() => setShowAddAdminDialog(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Adicionar Admin
        </Button>
        <Button>Novo Usuário</Button>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Nome</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Email</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Memórias</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Data de Cadastro</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Status</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-memory-200 rounded-full mr-2"></div>
                  <span>{user.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{user.memories}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{formatDate(user.createdAt)}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center space-x-2">
                  <button className="p-1 text-gray-500 hover:text-memory-500">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-500 hover:text-memory-500">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-500 hover:text-red-500">
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <Dialog open={showAddAdminDialog} onOpenChange={setShowAddAdminDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Administrador</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddAdmin}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="adminEmail" className="text-sm font-medium">
                Email do Usuário
              </label>
              <Input
                id="adminEmail"
                placeholder="email@exemplo.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                type="email"
                required
              />
              <p className="text-xs text-gray-500">
                O usuário deve já estar cadastrado no sistema.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowAddAdminDialog(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adicionando...' : 'Adicionar Admin'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
)};

const AdminMemories: React.FC = () => (
  <div className="bg-white rounded-lg border">
    <div className="p-4 border-b flex justify-between items-center">
      <h3 className="font-medium">Memórias ({memories.length})</h3>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Título</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Criador</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Data</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Fotos</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Emoji</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {memories.map((memory) => (
            <tr key={memory.id}>
              <td className="px-4 py-3 font-medium">{memory.title}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{memory.userName}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{formatDateWithTime(memory.createdAt)}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{memory.photos}</td>
              <td className="px-4 py-3 text-2xl">{memory.emoji}</td>
              <td className="px-4 py-3">
                <div className="flex items-center space-x-2">
                  <button className="p-1 text-gray-500 hover:text-memory-500">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-500 hover:text-memory-500">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-500 hover:text-red-500">
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AdminPayments: React.FC = () => (
  <div className="bg-white rounded-lg border">
    <div className="p-4 border-b flex justify-between items-center">
      <h3 className="font-medium">Pagamentos ({payments.length})</h3>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">ID</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Usuário</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Valor</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Data</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Status</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td className="px-4 py-3 text-sm font-medium">{payment.id}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{payment.userName}</td>
              <td className="px-4 py-3 font-medium">R$ {payment.amount.toFixed(2)}</td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {formatDateWithTime(payment.date)}
              </td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                  {payment.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center space-x-2">
                  <button className="p-1 text-gray-500 hover:text-memory-500">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-500 hover:text-memory-500">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AdminSettings: React.FC = () => (
  <div className="bg-white rounded-lg border p-6">
    <h3 className="font-medium mb-6">Configurações do Site</h3>

    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome do Site
        </label>
        <input
          type="text"
          defaultValue="Memórias Afetivas"
          className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-memory-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email de Contato
        </label>
        <input
          type="email"
          defaultValue="contato@memoriasafetivas.com"
          className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-memory-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Preço por Memória (R$)
        </label>
        <input
          type="number"
          defaultValue="19.90"
          step="0.01"
          className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-memory-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Número Máximo de Fotos
        </label>
        <input
          type="number"
          defaultValue="10"
          className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-memory-500"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="maintenance"
          className="rounded text-memory-500 focus:ring-memory-500 mr-2"
        />
        <label htmlFor="maintenance" className="text-sm font-medium text-gray-700">
          Modo de Manutenção
        </label>
      </div>

      <div className="pt-4">
        <Button className="memory-button-primary">
          Salvar Configurações
        </Button>
      </div>
    </div>
  </div>
);

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isAdmin, isLoading } = useAdmin();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-memory-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Se não for administrador, o hook useAdmin já fará o redirecionamento
  if (isAdmin === false) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="text-memory-600 hover:text-memory-700">
            ← Voltar ao site
          </Link>
          <div className="space-x-2">
            <Link to="/dashboard">
              <Button variant="ghost">Dashboard do Usuário</Button>
            </Link>
            <Button variant="outline">Sair</Button>
          </div>
        </div>

        <AdminHeader />

        <div className="flex flex-col md:flex-row">
          <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="flex-1">
            {activeTab === 'dashboard' && <AdminDashboard />}
            {activeTab === 'users' && <AdminUsers />}
            {activeTab === 'memories' && <AdminMemories />}
            {activeTab === 'payments' && <AdminPayments />}
            {activeTab === 'settings' && <AdminSettings />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
