import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment'; // We'll use moment to format dates

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
            await axios.put(`http://localhost:5000/api/invoices/${invoiceId}/pay`);
            // Update the status in the UI without a full refresh
            setInvoices(invoices.map(inv => 
                inv.id === invoiceId ? { ...inv, status: 'Paid' } : inv
            ));
        } catch (error) {
            alert('Failed to mark as paid.');
        }
    };

    const getStatusChip = (status) => {
        switch (status) {
            case 'Paid':
                return <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">{status}</span>;
            case 'Pending':
                return <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">{status}</span>;
            default:
                return <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">{status}</span>;
        }
    };

    if (isLoading) return <p>Loading invoices...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-blue-500">Invoices</h1>
            <div className="bg-secondary-dark shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead className="bg-primary-dark">
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold uppercase text-gray-200">Member</th>
                            <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold uppercase text-gray-200">Amount</th>
                            <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold uppercase text-gray-200">Date</th>
                            <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold uppercase text-gray-200">Status</th>
                            <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold uppercase text-gray-200">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map(invoice => (
                            <tr key={invoice.id}>
                                <td className="px-5 py-5 border-b border-gray-700 bg-secondary-dark text-white text-sm">{invoice.member.fullName}</td>
                                <td className="px-5 py-5 border-b border-gray-700 bg-secondary-dark text-white text-sm">₹{invoice.amount}</td>
                                <td className="px-5 py-5 border-b border-gray-700 bg-secondary-dark text-white text-sm">{moment(invoice.dueDate).format('DD MMM YYYY')}</td>
                                <td className="px-5 py-5 border-b border-gray-700 bg-secondary-dark text-white text-sm">{getStatusChip(invoice.status)}</td>
                                <td className="px-5 py-5 border-b border-gray-700 bg-secondary-dark text-white text-sm">
                                    {invoice.status === 'Pending' && (
                                        <button 
                                            onClick={() => alert(`Payment for Invoice #${invoice.id} initiated!`)}
                                            className="bg-accent hover:bg-accent-hover text-white text-xs font-bold py-1 px-3 rounded">
                                            Pay Now
                                        </button>
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