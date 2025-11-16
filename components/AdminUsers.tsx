import React from 'react';
import type { User } from '../App';

interface AdminUsersProps {
  users: User[];
  onBanUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

const AdminUsers: React.FC<AdminUsersProps> = ({ users, onBanUser, onDeleteUser }) => {
  return (
    <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3">Email</th>
                        <th scope="col" className="px-6 py-3">Credits</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Created At</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.id} className={`border-b border-gray-700 hover:bg-gray-700/50 ${user.isBanned ? 'bg-red-900/30' : 'bg-gray-800'}`}>
                                <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{user.name}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4 font-bold text-cyan-400">{user.credits}</td>
                                <td className="px-6 py-4">
                                    {user.isBanned ? 
                                        <span className="px-2 py-1 text-xs font-semibold text-white bg-red-600 rounded-full">Banned</span> : 
                                        <span className="px-2 py-1 text-xs font-semibold text-white bg-green-600 rounded-full">Active</span>
                                    }
                                </td>
                                <td className="px-6 py-4 text-xs">{user.createdAt}</td>
                                <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                                    <button onClick={() => onBanUser(user.id)} className={`px-2 py-1 text-xs font-bold rounded-md ${user.isBanned ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-600 hover:bg-gray-500'}`}>
                                        {user.isBanned ? 'Unban' : 'Ban'}
                                    </button>
                                    <button onClick={() => onDeleteUser(user.id)} className="px-2 py-1 text-xs font-bold bg-red-600 hover:bg-red-700 rounded-md">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center py-8 text-gray-500">
                                No users have signed up yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default AdminUsers;