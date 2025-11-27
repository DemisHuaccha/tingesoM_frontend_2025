import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { listCustomer, updateStatusCustomer, getDelayedClients } from "../../services/CustomerService";


export const ListCustomerComponent = () => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDelayed, setShowDelayed] = useState(false);
  const itemsPerPage = 10;
  

  const navigator = useNavigate();

  useEffect(() => {
    loadCustomers()}, [showDelayed]);

  
    function addNewCustomer(){
      navigator('/add-Customer')
    }

function loadCustomers() {
  const service = showDelayed ? getDelayedClients : listCustomer;
  service()
    .then((response) => {
      setCustomers(response.data);
      setCurrentPage(1);
    })
    .catch((error) => {
      console.error("Error al cargar clientes:", error);
    });
}

    function UpdateStatusCustomer(idCustomer) {
      updateStatusCustomer(idCustomer)
      .then((response) => {
        //console.log('Customer status update:', response.data);
        setCustomers(prev => prev.filter(customer => customer.idCustomer !== idCustomer));
        loadCustomers();
      })
      .catch((error) => {
        console.error('Error al actualizar status:', error);
      });
      
    }

    const totalPages = Math.ceil(customers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentCustomers = customers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container">
      <h2 className="text-center">
        {showDelayed ? "Delayed Clients" : "List of Clients"}
      </h2>

      <div style={{ textAlign: 'left', marginBottom: '10px' }}>
        <button className='btn btn-primary me-2' onClick={addNewCustomer}>
          Add Client
        </button>
        <button
          className='btn btn-info'
          onClick={() => setShowDelayed(prev => !prev)} // 👈 alterna entre listas
        >
          {showDelayed ? "Show All Clients" : "Show Delayed Clients"}
        </button>
      </div>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Client id</th>
            <th>Client firstName</th>
            <th>Client lastName</th>
            <th>Client rut</th>
            <th>Client email</th>
            <th>Client phone</th>
            <th>Client Status</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map((customer) => (
            <tr key={customer.idCustomer}>
                <td>{customer.idCustomer}</td>
                <td>{customer.firstName}</td>
                <td>{customer.lastName} </td>
                <td>{customer.rut} </td>
                <td>{customer.email} </td>
                <td>{customer.phone} </td>
                <td>{customer.status ? "Permitid" : "Restricted"} </td>
                <td>
                <button className="btn btn-danger" onClick={() => UpdateStatusCustomer(customer.idCustomer)}> Change Status </button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          className="btn btn-secondary"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ← Previus Page
        </button>

        <span>Page {currentPage} of {totalPages}</span>

        <button
          className="btn btn-secondary"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next Page →
        </button>
      </div>



    </div>
  );
};

export default ListCustomerComponent