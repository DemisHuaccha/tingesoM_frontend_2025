import React from 'react'
import {useNavigate} from 'react-router-dom'

const HomeComponent= () => {

    const navigator = useNavigate();

    const ListTools = () => {
    navigator('/ListTools')
  }

    const ListCustomer = () => {
    navigator('/ListCustomers')
  }

    const ListToolsAdmin = () => {
      navigator('/ListToolsAdmin')
    }

    const ListLoan = () => {
      navigator('/ListLoan')
    }

  return (
    <div style={{ textAlign: 'center' , marginTop: '40px'}}>
      <h1>Bienvenido a ToolRent 🛠️</h1>
      <div style={{ marginTop: '40px' }}>
        <button onClick={ListTools} style={{ marginRight: '10px' }}>
          Tools
        </button>
        <button onClick={ListCustomer} style={{ marginRight: '10px'}}>
          Customer
        </button>
        <button onClick={ListLoan} style= {{ marginRight: '10px'}}>
          Loan List
        </button>
      </div>
    </div>
  );
}


export default HomeComponent