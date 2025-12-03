import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { createLoan } from '../../services/LoanService';
import { searchClientRuts } from '../../services/ClientService';
import { getToolById, searchTools } from '../../services/ToolService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useKeycloak } from '@react-keycloak/web';

const LoanComponent = () => {
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [rutClient, setRutClient] = useState('');
  const navigator = useNavigate();
  const location = useLocation();
  const { keycloak } = useKeycloak();
  const userEmail = keycloak?.tokenParsed?.email || '';
  const { idTool: paramIdTool } = useParams();

  // Si viene del estado (desde ListTools), usamos esos datos
  const initialTool = location.state?.tool || null;

  const [toolId, setToolId] = useState(paramIdTool || '');
  const [toolName, setToolName] = useState(initialTool?.name || '');
  const [toolCategory, setToolCategory] = useState(initialTool?.category || '');
  const [toolFee, setToolFee] = useState(initialTool?.loanFee || '');

  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Si tenemos ID por parámetro pero no tenemos los detalles (ej: recarga de página o acceso directo), buscamos
    if (paramIdTool && !initialTool) {
      fetchToolDetails(paramIdTool);
    }
  }, [paramIdTool, initialTool]);

  const fetchToolDetails = async (id) => {
    try {
      const response = await getToolById(id);
      const tool = response.data;
      setToolName(tool.name);
      setToolCategory(tool.category);
      setToolFee(tool.loanFee);
    } catch (error) {
      console.error("Error fetching tool details:", error);
      setToolName('');
      setToolCategory('');
      setToolFee('');
    }
  };

  const [toolSuggestions, setToolSuggestions] = useState([]);

  const handleToolIdChange = async (e) => {
    const id = e.target.value;
    setToolId(id);

    if (id.length > 0) {
      try {
        const response = await searchTools(id);
        const data = Array.isArray(response.data) ? response.data : [];
        setToolSuggestions(data);
      } catch (error) {
        console.error("Error searching tools:", error);
        setToolSuggestions([]);
      }
    } else {
      setToolSuggestions([]);
    }

    if (id) {
      fetchToolDetails(id);
    } else {
      setToolName('');
      setToolCategory('');
      setToolFee('');
    }
  };

  const handleRutChange = async (e) => {
    const value = e.target.value;
    setRutClient(value);

    if (value.length > 1) {
      try {
        const response = await searchClientRuts(value);
        const data = Array.isArray(response.data) ? response.data : [];
        setSuggestions(data);
      } catch (error) {
        console.error("Error with RUTs:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const saveLoan = async (e) => {
    e.preventDefault();

    if (!deliveryDate || !returnDate || !rutClient.trim() || !toolId) {
      alert('Please fill in all fields correctly.');
      return;
    }

    const loan = {
      deliveryDate: deliveryDate.toISOString().split('T')[0],
      returnDate: returnDate.toISOString().split('T')[0],
      clientRut: rutClient.trim(),
      loanStatus: true,
      toolId: toolId,
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
                  onChange={handleRutChange}
                  required
                />
                {suggestions.length > 0 && (
                  <ul className="list-group mt-1">
                    {suggestions.map((rut, index) => (
                      <li
                        key={index}
                        className="list-group-item list-group-item-action"
                        onClick={() => {
                          setRutClient(rut);
                          setSuggestions([]);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {rut}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className='form-group mb-3'>
                <label className='form-label fw-bold'>Tool ID</label>
                <input
                  type='text'
                  value={toolId}
                  className='form-control'
                  onChange={handleToolIdChange}
                  disabled={!!paramIdTool}
                  placeholder="Enter Tool ID"
                  required
                />
                {toolSuggestions.length > 0 && (
                  <ul className="list-group mt-1">
                    {toolSuggestions.map((tool) => (
                      <li
                        key={tool.idTool}
                        className="list-group-item list-group-item-action"
                        onClick={() => {
                          setToolId(tool.idTool.toString());
                          setToolSuggestions([]);
                          fetchToolDetails(tool.idTool.toString());
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {tool.idTool} - {tool.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className='form-group mb-3'>
                <label className='form-label'>Tool Name</label>
                <input
                  type='text'
                  value={toolName}
                  className='form-control'
                  disabled
                />
              </div>

              <div className='form-group mb-3'>
                <label className='form-label'>Category</label>
                <input
                  type='text'
                  value={toolCategory}
                  className='form-control'
                  disabled
                />
              </div>

              <div className='form-group mb-3'>
                <label className='form-label'>Loan Fee</label>
                <input
                  type='text'
                  value={toolFee}
                  className='form-control'
                  disabled
                />
              </div>

              <div className='form-group mb-3'>
                <label className='form-label'>Delivery Date</label>
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
                <label className='form-label'>Return Date</label>
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
