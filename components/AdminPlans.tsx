import React, { useState } from 'react';
import type { Plan } from '../App';

interface AdminPlansProps {
  plans: Plan[];
  onAddPlan: (plan: Omit<Plan, 'id'>) => void;
  onDeletePlan: (planId: string) => void;
}

const AdminPlans: React.FC<AdminPlansProps> = ({ plans, onAddPlan, onDeletePlan }) => {
  const [name, setName] = useState('');
  const [credits, setCredits] = useState(100);
  const [priceBdt, setPriceBdt] = useState(0);
  const [priceUsd, setPriceUsd] = useState(0);
  const [paymentInstructions, setPaymentInstructions] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || credits <= 0 || !paymentInstructions.trim()) {
        alert("Please fill out all fields.");
        return;
    }
    onAddPlan({ name, credits, priceBdt, priceUsd, paymentInstructions });
    // Reset form
    setName('');
    setCredits(100);
    setPriceBdt(0);
    setPriceUsd(0);
    setPaymentInstructions('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1 bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Create New Plan</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Plan Name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Pro Pack" required />
          <Input label="Credits" type="number" value={credits} onChange={e => setCredits(parseInt(e.target.value, 10) || 0)} required />
          <Input label="Price (BDT ৳)" type="number" value={priceBdt} onChange={e => setPriceBdt(parseFloat(e.target.value) || 0)} />
          <Input label="Price (USD $)" type="number" value={priceUsd} onChange={e => setPriceUsd(parseFloat(e.target.value) || 0)} />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Payment Instructions</label>
            <textarea
              value={paymentInstructions}
              onChange={e => setPaymentInstructions(e.target.value)}
              required
              placeholder="e.g., Send payment to bKash..."
              className="w-full h-24 p-2 bg-gray-700 border border-gray-600 rounded-md placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium">Add Plan</button>
        </form>
      </div>
      <div className="md:col-span-2 bg-gray-800 shadow-lg rounded-lg overflow-hidden">
         <h2 className="text-xl font-bold mb-4 p-6">Existing Plans</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Credits</th>
                <th className="px-6 py-3">Price (BDT/USD)</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map(plan => (
                <tr key={plan.id} className="border-b border-gray-700">
                  <td className="px-6 py-4 font-medium">{plan.name}</td>
                  <td className="px-6 py-4">{plan.credits}</td>
                  <td className="px-6 py-4">{plan.priceBdt}৳ / {plan.priceUsd}$</td>
                   <td className="px-6 py-4">
                    <button onClick={() => onDeletePlan(plan.id)} className="text-red-400 hover:text-red-300 text-xs font-bold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Input: React.FC<{ label: string; type: string; value: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; required?: boolean }> = 
({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <input
      {...props}
      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

export default AdminPlans;