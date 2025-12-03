import React, { useState, useEffect } from 'react';
import { createClient, getClientById, updateClient } from '../../services/ClientService';
import { useNavigate, useParams } from 'react-router-dom';
import { useKeycloak } from "@react-keycloak/web";

const ClientComponent = () => {
  const { keycloak } = useKeycloak();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [rut, setRut] = useState('');
  const [emailC, setEmailC] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState(true);
  const navigator = useNavigate();
  const { id } = useParams();
  const email = keycloak?.tokenParsed?.email;

  useEffect(() => {
    if (id) {
      getClientById(id).then((response) => {
        const client = response.data;
        setFirstName(client.firstName);
        setLastName(client.lastName);
        setRut(client.rut);
        // Extract username from email if it's a gmail address
        if (client.email) {
          const emailParts = client.email.split('@');
          setEmailC(emailParts[0]);
        }
        setPhone(client.phone);
        setStatus(client.status);
      }).catch(error => {
        console.error("Error fetching client:", error);
      });
    }
  }, [id]);

  function saveClient(e) {
    e.preventDefault();

    const client = {
      firstName,
      lastName,
      rut,
      emailC: `${emailC}@gmail.com`,
      phone,
      status,
      email
    };

    if (id) {
      // Update existing client
      const clientToUpdate = {
        firstName,
        lastName,
        rut,
        email: `${emailC}@gmail.com`,
        phone,
        status
      };

      updateClient(clientToUpdate, id).then(() => {
        navigator('/ListClients');
      }).catch(error => {
        console.error("Error updating client:", error);
      });
    } else {
      // Create new client
      createClient(client).then(() => {
        navigator('/ListClients');
      }).catch(error => {
        console.error("Error creating client:", error);
      });
    }
  }

  const formatRut = (value) => {
    const clean = value.replace(/[^\dkK]/g, '').toUpperCase();
    const limited = clean.slice(0, 9);
    const body = limited.slice(0, -1);
    const dv = limited.slice(-1);
    const reversed = body.split('').reverse();
    const withDots = reversed.reduce((acc, digit, i) => {
      acc.unshift(digit);
      if ((i + 1) % 3 === 0 && i + 1 !== reversed.length) acc.unshift('.');
      return acc;
    }, []);
    return `${withDots.join('')}-${dv}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const digits = value.replace(/\D/g, "");
      const clean = digits.startsWith("569") ? digits.slice(3) : digits;
      const limited = clean.slice(0, 8);
      const formatted = "+569" + limited;
      setPhone(formatted);
    }
  };

  const pageTitle = () => {
    return id ? <h2 className='text-center'>Update Client</h2> : <h2 className='text-center'>Add Client</h2>;
  };

  return (
    <div className='container'>
      <br />
      <div className='row'>
        <div className='card col-md-6 offset-md-3'>
          {pageTitle()}
          <div className='card-body'>
            <form>
              <div className='form-group mb-2'>
                <label className='form-label'>Client Name</label>
                <input
                  type='text'
                  placeholder='Enter Client Name'
                  name='firstName'
                  value={firstName}
                  className='form-control'
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className='form-group mb-2'>
                <label className='form-label'>Client LastName</label>
                <input
                  type='text'
                  placeholder='Enter Client LastName'
                  name='lastName'
                  value={lastName}
                  className='form-control'
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className='form-group mb-2'>
                <label className='form-label'>Client Rut</label>
                <input
                  type='text'
                  placeholder='12.345.678-K'
                  name='rut'
                  value={rut}
                  className={`form-control ${rut && !/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/.test(rut) ? 'is-invalid' : ''}`}
                  onChange={(e) => setRut(formatRut(e.target.value))}
                />
              </div>
              <div className='form-group mb-2'>
                <label className='form-label'>Client Gmail</label>
                <div className='input-group'>
                  <input type='text' placeholder='Enter Gmail username'
                    name='emailC' value={emailC} className='form-control'
                    onChange={(e) => setEmailC(e.target.value.replace(/[^a-zA-Z0-9._-]/g, ''))}
                  />
                  <span className='input-group-text'>@gmail.com</span>
                </div>
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input type="text"
                  name="phone"
                  placeholder='+569'
                  value={phone || ""} onChange={handleChange} className="form-control" />
              </div>
              <button className='btn btn-success' onClick={saveClient}>Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientComponent