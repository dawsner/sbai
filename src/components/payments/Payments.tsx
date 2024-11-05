import React, { useState } from 'react';
import { Plus, Search, Filter, CreditCard, Calendar, MoreVertical } from 'lucide-react';
import { useStore } from '../../lib/store';
import PaymentForm from './PaymentForm';
import { formatCurrency, formatDate } from '../../lib/utils';

const statusColors = {
  'pending': 'bg-yellow-100 text-yellow-800',
  'completed': 'bg-green-100 text-green-800',
  'failed': 'bg-red-100 text-red-800'
};

const methodIcons = {
  'credit_card': CreditCard,
  'bank_transfer': CreditCard,
  'paypal': CreditCard
};

export default function Payments() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { payments, documents, clients } = useStore();

  const totalReceived = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Payments</h1>
            <p className="text-sm text-gray-500 mt-1">Track and manage payments</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Record Payment
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Total Received</h3>
              <span className="p-2 rounded-lg bg-green-50">
                <CreditCard className="w-5 h-5 text-green-600" />
              </span>
            </div>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{formatCurrency(totalReceived)}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Pending Payments</h3>
              <span className="p-2 rounded-lg bg-yellow-50">
                <CreditCard className="w-5 h-5 text-yellow-600" />
              </span>
            </div>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{formatCurrency(totalPending)}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
              <span className="p-2 rounded-lg bg-blue-50">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </span>
            </div>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {payments.length > 0
                ? Math.round((payments.filter(p => p.status === 'completed').length / payments.length) * 100)
                : 0}%
            </p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search payments..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map(payment => {
                const document = documents.find(d => d.id === payment.documentId);
                const client = document ? clients.find(c => c.id === document.clientId) : null;
                const PaymentIcon = methodIcons[payment.method];
                
                return (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-gray-50">
                          <PaymentIcon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{payment.reference}</div>
                          <div className="text-sm text-gray-500">{payment.method.replace('_', ' ')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{document?.title}</div>
                      <div className="text-sm text-gray-500">{client?.companyName}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs rounded-full ${statusColors[payment.status]}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(payment.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <button className="text-gray-400 hover:text-gray-500">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && <PaymentForm onClose={() => setIsFormOpen(false)} />}
    </>
  );
}