import React, { useState, useEffect } from 'react';
import PublicLayout from '../components/PublicLayout';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentPage = () => {

  const userId = localStorage.getItem('userId');
  const [paymentMode, setPaymentMode] = useState('');
  const [address, setAddress] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const navigate = useNavigate();

  const handlePlaceholder = async () => {
    if (paymentMode === 'online') {
      const { cardNumber, expiry, cvv } = cardDetails;
      if (!cardNumber || !expiry || !cvv) {
        toast.error('Please fill in all card details');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/place_order/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userId,
            address: address,
            paymentMode: paymentMode,
            cardNumber: paymentMode === 'online' ? cardDetails.cardNumber : '',
            expiry: paymentMode === 'online' ? cardDetails.expiry : '',
            cvv: paymentMode === 'online' ? cardDetails.cvv : '',
          })
        });

        const result = await response.json();

        if (response.status === 201) {
          toast.success(result.message);
          setTimeout(() => {
            navigate('/my-orders');
          }, 2000);
        } else {
          toast.error(result.message || 'Something went wrong');
        }

      } catch (error) {
        console.error(error);
        toast.error("Error connecting to server");
      }
    }
  }

  return (
    <PublicLayout>
      <ToastContainer position='top-right' autoClose={2000} />
      <div className='container py-5'>
        <h3 className='text-center text-primary mb-4'>
          <i className='fas fa-credit-card me-2'></i> Checkout & Payment
        </h3>
        <div className='card p-4 shadow-sm'>
          <div className='mb-3'>
            <label className='form-lable fw-semibold'>Devlivery Address</label>
            <textarea className='form-control border-primary-subtle' rows="3" placeholder='Enter your full delivery adress' value={address} onChange={(e) => setAddress(e.target.value)}></textarea>
          </div>
          <div className='form-check mb-3'>
            <input className='form-check-input' type='radio' name='paymentMode' value='cod' checked={paymentMode === 'cod'} onChange={() => setPaymentMode('cod')} />
            <label className='form-check-label'>Cash on Delivery</label>
          </div>
          <div className='form-check mb-3'>
            <input className='form-check-input' type='radio' name='paymentMode' value='online' checked={paymentMode === 'online'} onChange={() => setPaymentMode('online')} />
            <label className='form-check-label'>Online Payment</label>
          </div>

          {paymentMode === 'online' && (
            <div className='row'>
              <div className='col-md-6'>
                <label className='form-label'>Card Number</label>
                <input className='form-control' type='text' value={cardDetails.cardNumber} onChange={()=>setCardDetails({...cardDetails,cardNumber:e.target.value})} />
              </div>
              <input className='form-check-input' type='radio' name='paymentMode' value='cod' checked={paymentMode === 'cod'} onChange={() => setPaymentMode('cod')} />
              <label className='form-check-label'>Cash on Delivery</label>
            </div>
          )}
          {/* now to start here to go */}
        </div>
      </div>
      <ToastContainer />
    </PublicLayout>
  )
}

export default PaymentPage;