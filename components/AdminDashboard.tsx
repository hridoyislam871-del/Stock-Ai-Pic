import React, { useState } from 'react';
import type { User, Plan, PurchaseRequest } from '../App';
import AdminUsers from './AdminUsers';
import AdminPlans from './AdminPlans';
import AdminPurchases from './AdminPurchases';

interface AdminDashboardProps {
  users: User[];
  plans: Plan[];
  purchaseRequests: PurchaseRequest[];
  onAddPlan: (plan: Omit<Plan, 'id'>) => void;
  onDeletePlan: (planId: string) => void;
  onApprovePurchase: (purchaseId: string) => void;
  onBanUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onLogout: () => void;
}

type AdminTab = 'users' | 'plans' | 'purchases';

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');

  const pendingPurchasesCount = props.purchaseRequests.filter(p => p.status === 'pending').length;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <AdminUsers users={props.users} onBanUser={props.onBanUser} onDeleteUser={props.onDeleteUser} />;
      case 'plans':
        return <AdminPlans plans={props.plans} onAddPlan={props.onAddPlan} onDeletePlan={props.onDeletePlan} />;
      case 'purchases':
        return <AdminPurchases purchaseRequests={props.purchaseRequests} onApprovePurchase={props.onApprovePurchase} />;
      default:
        return null;
    }
  }

  const TabButton: React.FC<{ tab: AdminTab, label: string, count?: number }> = ({ tab, label, count }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
        activeTab === tab 
          ? 'bg-indigo-600 text-white' 
          : 'text-gray-300 hover:bg-gray-700'
      }`}
    >
      {label}
      {count !== undefined && count > 0 && (
         <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {count}
         </span>
      )}
    </button>
  );

  return (
    <div className="w-full">
        <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700 flex-wrap gap-4">
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <div className="flex items-center gap-2 flex-wrap">
                <TabButton tab="users" label="Users" />
                <TabButton tab="plans" label="Plans" />
                <TabButton tab="purchases" label="Pending Purchases" count={pendingPurchasesCount} />
            </div>
            <button
                onClick={props.onLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium"
            >
                Logout
            </button>
        </header>
        <main>
            {renderTabContent()}
        </main>
    </div>
  );
};

export default AdminDashboard;