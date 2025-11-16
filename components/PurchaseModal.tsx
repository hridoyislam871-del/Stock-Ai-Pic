import React, { useState } from 'react';
import type { Plan } from '../App';

interface PurchaseModalProps {
  plan: Plan;
  onClose: () => void;
  onSubmit: (plan: Plan, transactionId: string) => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ plan, onClose, onSubmit }) => {
  const [transactionId, setTransactionId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      alert('Please enter a valid Transaction ID.');
      return;
    }
    onSubmit(plan, transactionId);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 text-white p-8 rounded-lg shadow-xl w-full max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          aria-label="Close purchase modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-4">Purchase: {plan.name}</h2>
        <div className="mb-6 p-4 bg-gray-700/50 rounded-md border border-gray-600">
            <h3 className="font-semibold text-lg mb-2">Payment Instructions</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{plan.paymentInstructions}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="transaction-id" className="block text-sm font-medium text-gray-300">Transaction ID</label>
            <input
              id="transaction-id"
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              required
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter the transaction ID from your payment"
            />
          </div>
          <p className="text-xs text-gray-400">After sending payment, enter the Transaction ID you received and submit. An admin will verify your payment and add credits to your account.</p>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            Submit Payment Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default PurchaseModal;
