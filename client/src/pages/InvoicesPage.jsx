import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const InvoicesPage = () => {
    const [invoices, setInvoices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchInvoices = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/invoices');
            setInvoices(response.data);
        } catch (error) {
            console.error("Failed to fetch invoices:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleMarkAsPaid = async (invoiceId) => {
        try {
            // Call the backend API to mark as paid
            await axios.put(`http://localhost:5000/api/invoices/${invoiceId}/pay`);
            
            // Update the status in the UI without a full refresh
            setInvoices(invoices.map(inv => 
                inv.id === invoiceId ? { ...inv, status: 'Paid' } : inv
            ));
            
            // Show success message
            alert(`Invoice #${invoiceId} marked as Paid successfully!`);
        } catch (error) {
            console.error('Failed to mark as paid:', error);
            alert('Failed to mark invoice as paid. Please try again.');
        }
    };

    const getStatusChip = (status) => {
        switch (status) {
            case 'Paid':
                return <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">{status}</span>;
            case 'Pending':
                return <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">{status}</span>;
            case 'Overdue':
                return <span className="bg-red-200 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">{status}</span>;
            default:
                return <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">{status}</span>;
        }
    };

    if (isLoading) return <p className="text-white">Loading invoices...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-blue-500">Invoices</h1>
            <div className="bg-secondary-dark shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead className="bg-primary-dark">
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold uppercase text-gray-200">Invoice ID</th>
                            <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold uppercase text-gray-200">Member</th>
                            <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold uppercase text-gray-200">Amount</th>
                            <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold uppercase text-gray-200">Date</th>
                            <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold uppercase text-gray-200">Status</th>
                            <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold uppercase text-gray-200">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map(invoice => (
                            <tr key={invoice.id} className="hover:bg-gray-800 transition-colors">
                                <td className="px-5 py-5 border-b border-gray-700 bg-secondary-dark text-white text-sm">
                                    #{invoice.id}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-700 bg-secondary-dark text-white text-sm">
                                    {invoice.member.fullName}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-700 bg-secondary-dark text-white text-sm font-semibold">
                                    ₹{invoice.amount.toLocaleString()}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-700 bg-secondary-dark text-white text-sm">
                                    {moment(invoice.dueDate).format('DD MMM YYYY')}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-700 bg-secondary-dark text-white text-sm">
                                    {getStatusChip(invoice.status)}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-700 bg-secondary-dark text-white text-sm">
                                    {invoice.status === 'Pending' ? (
                                        <button 
                                            onClick={() => handleMarkAsPaid(invoice.id)}
                                            className="bg-accent hover:bg-accent-hover text-white text-xs font-bold py-2 px-4 rounded transition-colors">
                                            Pay Now
                                        </button>
                                    ) : (
                                        <span className="text-green-400 text-xs font-semibold flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Paid
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InvoicesPage;