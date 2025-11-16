import React, { useState } from 'react';
import type { Plan } from '../App';
import PurchaseModal from './PurchaseModal';

interface SubscriptionPageProps {
  plans: Plan[];
  onPurchase: (plan: Plan, transactionId: string) => void;
  onBack: () => void;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ plans, onPurchase, onBack }) => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  return (
    <div className="w-full">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Subscription Plans</h1>
        <button onClick={onBack} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium">
          &larr; Back to Dashboard
        </button>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col justify-between border border-gray-700 hover:border-indigo-500 transition-all">
            <div>
              <h2 className="text-2xl font-bold text-cyan-400">{plan.name}</h2>
              <p className="text-4xl font-extrabold my-4">{plan.credits} <span className="text-xl font-medium text-gray-300">Credits</span></p>
              <div className="text-lg text-gray-300 space-y-1">
                <p>Price: <span className="font-semibold text-white">{plan.priceBdt} ৳</span> (BDT)</p>
                <p>Price: <span className="font-semibold text-white">{plan.priceUsd} $</span> (USD)</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedPlan(plan)}
              className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-colors"
            >
              Buy Now
            </button>
          </div>
        ))}
      </main>
      {selectedPlan && (
        <PurchaseModal 
            plan={selectedPlan}
            onClose={() => setSelectedPlan(null)}
            onSubmit={onPurchase}
        />
      )}
    </div>
  );
};

export default SubscriptionPage;
