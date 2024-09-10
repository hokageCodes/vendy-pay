import { useState, useEffect } from 'react';
import axios from 'axios';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

// Validation schema for Formik
const validationSchema = Yup.object({
  amount: Yup.number().required('Amount is required').min(20, 'Minimum amount is 20'),
  customerName: Yup.string().required('Customer Name is required'),
  customerEmail: Yup.string().email('Invalid email format').required('Customer Email is required'),
  paymentDescription: Yup.string().required('Payment Description is required'),
  bankCode: Yup.string().when('paymentMethod', {
    is: 'ACCOUNT_TRANSFER',
    then: Yup.string().required('Bank selection is required'),
  }),
  destinationAccount: Yup.string().when('paymentMethod', {
    is: 'ACCOUNT_TRANSFER',
    then: Yup.string().required('Destination account is required'),
  }),
  paymentMethod: Yup.string().required('Payment method is required'),
});

// Component
const PayoutForm = () => {
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch list of banks
    const fetchBanks = async () => {
      try {
        const authResponse = await axios.post(
          'https://sandbox.monnify.com/api/v1/auth/login',
          {},
          {
            headers: {
              Authorization: `Basic ${btoa('MK_TEST_JV00272KUY:8SXNGYD9KPWKYT8BKDDLSPW3CNT4BB0B')}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const { accessToken } = authResponse.data.responseBody;

        const bankResponse = await axios.get(
          'https://sandbox.monnify.com/api/v1/banks',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setBanks(bankResponse.data.responseBody);
      } catch (err) {
        console.error('Error fetching banks:', err);
        setError('Failed to load banks.');
      }
    };

    fetchBanks();
  }, []);

  const onSubmit = async (values) => {
    setLoading(true);
    setError('');

    try {
      const authResponse = await axios.post(
        'https://sandbox.monnify.com/api/v1/auth/login',
        {},
        {
          headers: {
            Authorization: `Basic ${btoa('MK_TEST_JV00272KUY:8SXNGYD9KPWKYT8BKDDLSPW3CNT4BB0B')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const { accessToken } = authResponse.data.responseBody;

      let transactionResponse;

      if (values.paymentMethod === 'CARD') {
        const transactionPayload = {
          amount: Number(values.amount),
          customerName: values.customerName,
          customerEmail: values.customerEmail,
          paymentDescription: values.paymentDescription,
          currencyCode: 'NGN',
          contractCode: '4886079034',
          redirectUrl: 'https://your-redirect-url.com',
          paymentMethods: ['CARD'],
          metadata: { key: 'value' }
        };

        transactionResponse = await axios.post(
          'https://sandbox.monnify.com/api/v1/merchant/transactions/init-transaction',
          transactionPayload,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } else if (values.paymentMethod === 'ACCOUNT_TRANSFER') {
        const transactionPayload = {
          amount: Number(values.amount),
          customerName: values.customerName,
          customerEmail: values.customerEmail,
          paymentDescription: values.paymentDescription,
          currencyCode: 'NGN',
          contractCode: '4886079034',
          redirectUrl: 'https://your-redirect-url.com',
          paymentMethods: ['ACCOUNT_TRANSFER'],
          metadata: { key: 'value' }
        };

        transactionResponse = await axios.post(
          'https://sandbox.monnify.com/api/v1/merchant/transactions/init-transaction',
          transactionPayload,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const { transactionReference } = transactionResponse.data.responseBody;

        const bankTransferResponse = await axios.post(
          'https://sandbox.monnify.com/api/v1/merchant/bank-transfer/init-payment',
          {
            transactionReference,
            bankCode: values.bankCode,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Bank Transfer Response:', bankTransferResponse.data);
      }

      if (transactionResponse.data.responseCode === '0') {
        const { checkoutUrl } = transactionResponse.data.responseBody;
        window.location.href = checkoutUrl;
      } else {
        setError(`Transaction failed: ${transactionResponse.data.responseMessage}`);
      }
    } catch (err) {
      console.error('Error initiating transaction:', err);
      setError('An error occurred while initializing the transaction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Initiate Payment</h1>
      {error && <div className="bg-red-200 text-red-700 p-2 mb-4 rounded">{error}</div>}
      <Formik
        initialValues={{
          amount: '',
          customerName: '',
          customerEmail: '',
          paymentDescription: '',
          paymentMethod: 'CARD',
          bankCode: '',
          destinationAccount: '',
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form>
            <div className="mb-4">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
              <Field
                type="number"
                id="amount"
                name="amount"
                placeholder="Enter amount"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
              {errors.amount && touched.amount ? <div className="text-red-500 text-sm">{errors.amount}</div> : null}
            </div>
            <div className="mb-4">
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Customer Name</label>
              <Field
                type="text"
                id="customerName"
                name="customerName"
                placeholder="Enter customer name"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
              {errors.customerName && touched.customerName ? <div className="text-red-500 text-sm">{errors.customerName}</div> : null}
            </div>
            <div className="mb-4">
              <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700">Customer Email</label>
              <Field
                type="email"
                id="customerEmail"
                name="customerEmail"
                placeholder="Enter customer email"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
              {errors.customerEmail && touched.customerEmail ? <div className="text-red-500 text-sm">{errors.customerEmail}</div> : null}
            </div>
            <div className="mb-4">
              <label htmlFor="paymentDescription" className="block text-sm font-medium text-gray-700">Payment Description</label>
              <Field
                type="text"
                id="paymentDescription"
                name="paymentDescription"
                placeholder="Enter payment description"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
              {errors.paymentDescription && touched.paymentDescription ? <div className="text-red-500 text-sm">{errors.paymentDescription}</div> : null}
            </div>
            <div className="mb-4">
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Payment Method</label>
              <Field
                as="select"
                id="paymentMethod"
                name="paymentMethod"
                onChange={(e) => {
                  const { value } = e.target;
                  setFieldValue('paymentMethod', value);
                  setPaymentMethod(value);
                }}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="CARD">Card Payment</option>
                <option value="ACCOUNT_TRANSFER">Account Transfer</option>
              </Field>
              {errors.paymentMethod && touched.paymentMethod ? <div className="text-red-500 text-sm">{errors.paymentMethod}</div> : null}
            </div>
            {paymentMethod === 'ACCOUNT_TRANSFER' && (
              <>
                <div className="mb-4">
                  <label htmlFor="bankCode" className="block text-sm font-medium text-gray-700">Bank</label>
                  <Field
                    as="select"
                    id="bankCode"
                    name="bankCode"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  >
                    <option value="">Select a bank</option>
                    {banks.map((bank) => (
                      <option key={bank.code} value={bank.code}>{bank.name}</option>
                    ))}
                  </Field>
                  {errors.bankCode && touched.bankCode ? <div className="text-red-500 text-sm">{errors.bankCode}</div> : null}
                </div>
                <div className="mb-4">
                  <label htmlFor="destinationAccount" className="block text-sm font-medium text-gray-700">Destination Account</label>
                  <Field
                    type="text"
                    id="destinationAccount"
                    name="destinationAccount"
                    placeholder="Enter destination account number"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                  {errors.destinationAccount && touched.destinationAccount ? <div className="text-red-500 text-sm">{errors.destinationAccount}</div> : null}
                </div>
              </>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`mt-4 px-4 py-2 text-white font-semibold rounded-md ${loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {loading ? 'Processing...' : 'Submit'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PayoutForm;
