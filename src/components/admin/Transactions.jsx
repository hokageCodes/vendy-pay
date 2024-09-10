import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch transactions
    const fetchTransactions = async () => {
      try {
        // First, get the access token
        const tokenResponse = await axios.post(
          'https://sandbox.monnify.com/api/v1/auth/login',
          {},
          {
            headers: {
              Authorization: `Basic ${btoa('MK_TEST_JV00272KUY:8SXNGYD9KPWKYT8BKDDLSPW3CNT4BB0B')}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const { accessToken } = tokenResponse.data.responseBody;

        // Now fetch transactions
        const transactionsResponse = await axios.get(
          'https://sandbox.monnify.com/api/v1/transactions/search',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/json',
            },
            params: {
              page: 0,
              size: 10, // You can change the page size if needed
            },
          }
        );

        if (transactionsResponse.data.requestSuccessful) {
          setTransactions(transactionsResponse.data.responseBody.content);
        } else {
          setError('Failed to fetch transactions');
        }
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('An error occurred while fetching transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      {transactions.length === 0 ? (
        <div>No transactions found.</div>
      ) : (
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Customer Name</th>
              <th className="px-4 py-2">Amount (NGN)</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.transactionReference}>
                <td className="border px-4 py-2">{transaction.customerDTO.name}</td>
                <td className="border px-4 py-2">{transaction.amount}</td>
                <td className={`border px-4 py-2 ${transaction.paymentStatus === 'SUCCESS' ? 'text-green-500' : 'text-red-500'}`}>
                  {transaction.paymentStatus}
                </td>
                <td className="border px-4 py-2">{new Date(transaction.createdOn).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
