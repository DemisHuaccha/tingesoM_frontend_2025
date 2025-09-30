import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateTool } from "../../services/ToolService";
import { useKeycloak } from "@react-keycloak/web";

const apiBase = import.meta.env.VITE_API_BASE_URL;

export const UpdateTool = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { keycloak } = useKeycloak();
  const userEmail = keycloak?.tokenParsed?.email;
  const [tool, setTool] = useState(state?.tool || null);
  const [condiciones, setCondiciones] = useState([]);

  useEffect(() => {
    if (!tool) {
      alert("Tool not received.");
      navigate("/ListTools");
    }
  }, [tool, navigate]);

  useEffect(() => {
    fetch(`${apiBase}/tool/conditions`)
      .then((res) => res.ok ? res.json() : Promise.reject("Failed to fetch conditions"))
      .then(setCondiciones)
      .catch((error) => {
        console.error("Fetch error:", error);
        setCondiciones([]);
      });
  }, []);

  const handleChange = ({ target: { name, value, type, checked } }) => {
    const parsedValue = type === "number"
      ? Math.max(0, parseInt(value, 10) || 0)
      : type === "checkbox"
      ? checked
      : value;

    setTool((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateTool({ ...tool, email: userEmail, idTool: tool.idTool })
      .then(() => navigate("/ListTools"))
      .catch((error) => console.error("Update error:", error));
  };

  if (!tool) return <div className="container">Loading Tool...</div>;

  return (
    <div className="container">
      <h2 className="text-center">Edit Tool:</h2>
      <form onSubmit={handleSubmit}>
        {[
          { label: "Name", name: "name", type: "text" },
          { label: "Category", name: "category", type: "text" },
          { label: "Replacement Value", name: "replacementValue", type: "number" },
          { label: "Loan Fee", name: "loanFee", type: "number" },
          { label: "Delay Penalty", name: "penaltyForDelay", type: "number" },
        ].map(({ label, name, type }) => (
          <div className="form-group" key={name}>
            <label>{label}:</label>
            <input
              type={type}
              name={name}
              value={tool[name] ?? (type === "number" ? 0 : "")}
              onChange={handleChange}
              className="form-control"
              required
              {...(type === "number" ? { min: 0, step: 1 } : {})}
            />
          </div>
        ))}
        <div className="form-group">
          <label>Initial Condition:</label>
          <select
            name="initialCondition"
            value={tool.initialCondition || ""}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">-- Select Condition --</option>
            {condiciones.map((cond, i) => (
              <option key={i} value={cond}>{cond}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-success mt-4">Save Changes</button>
      </form>
    </div>
  );
};

export default UpdateTool;