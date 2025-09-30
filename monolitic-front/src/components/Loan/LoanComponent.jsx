import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createLoan } from '../../services/LoanService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useKeycloak } from '@react-keycloak/web';

const LoanComponent = () => {
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [rutClient, setRutClient] = useState('');
  const navigator = useNavigate();
  const { keycloak } = useKeycloak();
  const userEmail = keycloak?.tokenParsed?.email || '';
  const { idTool } = useParams();

  

  const saveLoan = async (e) => {
    e.preventDefault();

    if (!deliveryDate || !returnDate || !rutClient.trim()) {
      alert('Please fill in all fields correctly.');
      return;
    }

    const loan = {
      deliveryDate: deliveryDate.toISOString().split('T')[0],
      returnDate: returnDate.toISOString().split('T')[0],
      clientRut: rutClient.trim(),
      loanStatus: true,
      toolId: idTool,
      email: userEmail,
    };

    try {
      await createLoan(loan);
      navigator('/ListLoan');
    } catch (error) {
      console.error('Error creating loan:', error);
      alert('Failed to create loan. Please try again.');
    }
  };

  return (
    <div className='container'>
      <br />
      <div className='row'>
        <div className='card col-md-6 offset-md-3'>
          <h2 className='text-center'>Add Loan</h2>
          <div className='card-body'>
            <form onSubmit={saveLoan}>
              <div className='form-group mb-3'>
                <label className='form-label'>Client Rut</label>
                <input
                  type='text'
                  placeholder='Enter Client Rut'
                  value={rutClient}
                  className='form-control'
                  onChange={(e) => setRutClient(e.target.value)}
                  required
                />
              </div>

              <div className='form-group mb-3'>
                <label className='form-label fw-bold'>Tool ID</label>
                <input
                  type='text'
                  value={idTool}
                  className='form-control'
                  disabled
                />
              </div>

              <div className='form-group mb-3'>
                
                <DatePicker
                  selected={deliveryDate}
                  onChange={(date) => setDeliveryDate(date)}
                  dateFormat='yyyy-MM-dd'
                  placeholderText='Select delivery date'
                  className='form-control'
                  required
                />
              </div>

              <div className='form-group mb-3'>
                
                <DatePicker
                  selected={returnDate}
                  onChange={(date) => setReturnDate(date)}
                  dateFormat='yyyy-MM-dd'
                  placeholderText='Select return date'
                  className='form-control'
                  required
                />
              </div>

              <button type='submit' className='btn btn-success'>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanComponent;
