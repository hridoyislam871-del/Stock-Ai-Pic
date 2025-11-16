import React from 'react';
import type { PurchaseRequest } from '../App';

interface AdminPurchasesProps {
  purchaseRequests: PurchaseRequest[];
  onApprovePurchase: (purchaseId: string) => void;
}

const AdminPurchases: React.FC<AdminPurchasesProps> = ({ purchaseRequests, onApprovePurchase }) => {
  const pendingRequests = purchaseRequests.filter(pr => pr.status === 'pending');

  return (
    <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold">Pending Purchase Requests</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
            <tr>
              <th className="px-6 py-3">User Name</th>
              <th className="px-6 py-3">Plan Name</th>
              <th className="px-6 py-3">Transaction ID</th>
              <th className="px-6 py-3">Submitted At</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.length > 0 ? (
              pendingRequests.map(req => (
                <tr key={req.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="px-6 py-4 font-medium">{req.userName}</td>
                  <td className="px-6 py-4">{req.planName}</td>
                  <td className="px-6 py-4 font-mono text-xs">{req.transactionId}</td>
                  <td className="px-6 py-4">{req.createdAt}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onApprovePurchase(req.id)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-md text-xs font-bold"
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  No pending purchase requests.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPurchases;
