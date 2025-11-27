import React, { useState, useEffect } from 'react';
import { createTool } from '../../services/ToolService';
import { useNavigate } from 'react-router-dom';
import { useKeycloak } from "@react-keycloak/web";

const apiBase = import.meta.env.VITE_API_BASE_URL;

const ToolComponent = () => {
  const { keycloak } = useKeycloak();
  const navigator = useNavigate();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [replacementValue, setReplacementValue] = useState('');
  const [damageValue, setDamageValue] = useState('');
  const [loanFee, setLoanFee] = useState('');
  const [penaltyForDelay, setPenaltyForDelay] = useState('');
  const [initialCondition, setInitialCondition] = useState('');
  const [condiciones, setCondiciones] = useState([]);
  const [quantity, setQuantity] = useState('');
  const email = keycloak?.tokenParsed?.email;

  useEffect(() => {
    fetch(`${apiBase}/tool/conditions`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener condiciones");
        return res.json();
      })
      .then((data) => setCondiciones(data))
      .catch((error) => {
        console.error("Error al cargar condiciones:", error);
        alert("No se pudieron cargar las condiciones desde el servidor.");
      });
  }, []);

  function saveTool(e) {
    e.preventDefault();

    const tool = {
      name,
      category,
      replacementValue: parseInt(replacementValue),
      damageValue: parseInt(damageValue),
      loanFee: parseInt(loanFee),
      penaltyForDelay: parseInt(penaltyForDelay),
      initialCondition,
      quantity: parseInt(quantity),
      email
    };

    if (!Number.isInteger(parseInt(replacementValue, damageValue, loanFee, penaltyForDelay, quantity)) || parseInt(replacementValue, damageValue, loanFee, penaltyForDelay, quantity) <= 0) 
      {alert('Positive Numbers only.');
        return;}

    //console.log(tool);
    createTool(tool)
      .then((response) => {
        //console.log(response.data);
        navigator('/ListTools');
      })
      .catch((error) => {
        console.error('Error al crear herramienta:', error);
        alert('Hubo un error al guardar la herramienta.');
      });
  }

  return (
    <div className='container'>
      <br />
      <div className='row'>
        <div className='card col-md-6 offset-md-3'>
          <h2 className='text-center'>Add Tool</h2>
          <div className='card-body'>
            <form>
              <div className='form-group mb-2'>
                <label className='form-label'>Tool Name</label>
                <input
                  type='text'
                  placeholder='Enter Tool Name'
                  value={name}
                  className='form-control'
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className='form-group mb-2'>
                <label className='form-label'>Tool Category</label>
                <input
                  type='text'
                  placeholder='Enter Tool Category'
                  value={category}
                  className='form-control'
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>

              <div className='form-group mb-2'>
                <label className='form-label'>Replacement Value</label>
                <input
                  type='number'
                  min='0'
                  placeholder='Enter Replacement Value'
                  value={replacementValue}
                  className='form-control'
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {setReplacementValue(value);}}}
                />
              </div>

              <div className='form-group mb-2'>
                <label className='form-label'>Damage Value</label>
                <input
                  type='number'
                  min='0'
                  placeholder='Enter Damage Value'
                  value={damageValue}
                  className='form-control'
                  onChange={(e) => {    
                    const value = parseInt(e.target.value);
                    if (value > 0 || e.target.value === '') setDamageValue(e.target.value);}}
                />
              </div>

              <div className='form-group mb-2'>
                <label className='form-label'>Loan Fee</label>
                <input
                  type='number'
                  min='0'
                  placeholder='Enter Loan Fee'
                  value={loanFee}
                  className='form-control'
                  onChange={(e) => {    
                    const value = parseInt(e.target.value);
                    if (value > 0 || e.target.value === '') setLoanFee(e.target.value);}}
                />
              </div>

              <div className='form-group mb-2'>
                <label className='form-label'>Penalty for Delay</label>
                <input
                  type='number'
                  min='0'
                  placeholder='Enter Penalty for Delay'
                  value={penaltyForDelay}
                  className='form-control'
                  onChange={(e) => {    
                    const value = parseInt(e.target.value);
                    if (value > 0 || e.target.value === '') setPenaltyForDelay(e.target.value);}}
                />
              </div>

              <div className='form-group mb-2'>
                <label className='form-label'>Initial Condition</label>
                <select
                  value={initialCondition}
                  className='form-control'
                  onChange={(e) => setInitialCondition(e.target.value)}
                >
                  <option value="">-- Selecciona una condición --</option>
                  {condiciones.map((cond, index) => (
                    <option key={index} value={cond}>
                      {cond}
                    </option>
                  ))}
                </select>
              </div>

              <div className='form-group mb-2'>
                <label className='form-label'>Quantity</label>
                <input
                  type='number'
                  min='0' 
                  placeholder='Enter Quantity'
                  value={quantity}
                  className='form-control'
                  onChange={(e) => {    
                    const value = parseInt(e.target.value);
                    if (value > 0 || e.target.value === '') setQuantity(e.target.value);}}
                />
              </div>

              <button type='submit' className='btn btn-success' onClick={saveTool}>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolComponent;
