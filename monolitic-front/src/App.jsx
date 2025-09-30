import "./App.css";
import FooterComponent from "./components/FooterComponent";
import ListToolComponent from "./components/Tool/ListToolComponent";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ToolComponent from "./components/Tool/ToolComponent";
import HomeComponent from "./components/HomeComponent";
import ListCustomerComponent from "./components/Customer/ListCustomerComponent";
import CustomerComponent from "./components/Customer/CustomerComponent";
import NotFound from "./components/NotFound";
import { useKeycloak } from "@react-keycloak/web";
import Navbar from "./components/navbar";
import ListLoanComponent from "./components/Loan/ListLoanComponent";
import UpdateTool from "./components/Tool/UpdateTool";
import LoanComponent from "./components/Loan/LoanComponent"; 
import UserComponent from "./components/User/UserComponent";
import CardexListComponent from "./components/Cardex/CardexListComponent";
import RankingComponent from "./components/Tool/RankingComponent";


const apiBase = import.meta.env.VITE_API_BASE_URL;



function App() {

const { keycloak, initialized } = useKeycloak();

  if (!initialized) return <div>Cargando...</div>;

  const isLoggedIn = keycloak.authenticated;
  const roles = keycloak.tokenParsed?.realm_access?.roles || [];

  const PrivateRoute = ({ element, rolesAllowed }) => {
    if (!isLoggedIn) {
      keycloak.login();
      return null;
    }
    if (rolesAllowed && !rolesAllowed.some(r => roles.includes(r))) {
      return <h2>No tienes permiso para ver esta página</h2>;
    }
    return element;
  };

  if (!isLoggedIn) { 
    keycloak.login(); 
    return null; 
  }

const email = keycloak.tokenParsed?.email;
const role = keycloak.tokenParsed?.realm_access?.roles?.find(r =>
  r === "USER" || r === "ADMIN"
) ?? '';

if (email && role && !window.__userInfoSent && keycloak.token) {
  window.__userInfoSent = true;

  fetch(`${apiBase}/user/createUser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${keycloak.token}`,
    },
    body: JSON.stringify({ email, role }),
  })
  .then(res => {
    if (!res.ok) {
      console.error('Error en la respuesta del backend:', res.status);
    }
  })
  .catch(err => {
    console.error('Error enviando datos del usuario:', err);
  });
}

  return (
    <>
    <BrowserRouter> 
      <Navbar></Navbar>
      <Routes>
        <Route path="/home" 
            element={<PrivateRoute element={<HomeComponent/>} rolesAllowed={["USER","ADMIN"]}/>}
          />   

        <Route path='/'
             element={<PrivateRoute element={<HomeComponent/>} rolesAllowed={["USER","ADMIN"]}/>}
          />

        <Route path='/ListTools' 
            element={<PrivateRoute element={<ListToolComponent/>} rolesAllowed={["USER","ADMIN"]}/>}
          />

        <Route path='/add-Tool' 
            element={<PrivateRoute element={<ToolComponent/>} rolesAllowed={["USER","ADMIN"]}/>}
        />

        <Route path='/updateTool/:id' 
            element={<PrivateRoute element= { <UpdateTool />} rolesAllowed={["ADMIN"]}/>}
        />

        <Route path='/ListCustomers' 
            element={<PrivateRoute element= { <ListCustomerComponent />} rolesAllowed={["USER","ADMIN"]}/>}
        />

        <Route path="/add-Customer"
            element={<PrivateRoute element= { <CustomerComponent />} rolesAllowed={["USER","ADMIN"]}/>}
        />

        <Route path="/ListLoan"
            element={<PrivateRoute element= { <ListLoanComponent />} rolesAllowed={["USER","ADMIN"]}/>}
        />

        <Route path="/add-Loan/:idTool"
            element={<PrivateRoute element= { <LoanComponent />} rolesAllowed={["USER","ADMIN"]}/>}
        />

        <Route path="/updateUser"
            element={<PrivateRoute element= { <UserComponent />} rolesAllowed={["USER","ADMIN"]}/>}
        />

        <Route path="/Cardex"
            element={<PrivateRoute element= { <CardexListComponent />} rolesAllowed={["USER","ADMIN"]}/>}
        />

        <Route path="/Ranking"
            element={<PrivateRoute element= { <RankingComponent />} rolesAllowed={["USER","ADMIN"]}/>}
        />

        <Route path="*"
            element={<PrivateRoute element= {<NotFound />} rolesAllowed={["USER","ADMIN"]}/>}
        />

        </Routes>
      <FooterComponent/>
    </BrowserRouter>
    </>
  );
}

export default App;
