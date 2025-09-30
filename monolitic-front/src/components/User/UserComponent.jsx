import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";

const apiBase = import.meta.env.VITE_API_BASE_URL;

export const UserComponent = () => {
  const { keycloak } = useKeycloak();
  const navigator = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const userEmail = keycloak?.tokenParsed?.email;

  useEffect(() => {
    if (!userEmail) return;

    fetch(`${apiBase}/user/getByEmail?email=${encodeURIComponent(userEmail)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener usuario");
        return res.json();
      })
      .then((data) => {
        // Sincronizar campos DTO para envío
        setUser({
          ...data,
          firstName: data.user_firstname,
          lastName: data.user_lastname,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar el usuario:", error);
        setLoading(false);
      });
  }, [userEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const digits = value.replace(/\D/g, "");
      const clean = digits.startsWith("56") ? digits.slice(2) : digits;
      const limited = clean.slice(0, 9);
      const formatted = "+56" + limited;

      setUser((prevUser) => ({
        ...prevUser,
        phone: formatted,
      }));
    } else if (name === "user_firstname") {
      setUser((prevUser) => ({
        ...prevUser,
        user_firstname: value,
        firstName: value,
      }));
    } else if (name === "user_lastname") {
      setUser((prevUser) => ({
        ...prevUser,
        user_lastname: value,
        lastName: value,
      }));
    } else {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      email: user.email,
      role: user.role,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
    };

    fetch(`${apiBase}/user/updateUser`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al actualizar usuario");
        navigator("/Home");
      })
      .catch((error) => {
        console.error("Error al actualizar el usuario:", error);
      });
  };

  if (loading || !user) {
    return <div className="container">loading user...</div>;
  }

  const { email, role, user_firstname, user_lastname, phone } = user;

  return (
    <div className="container">
      <h2 className="text-center">Edit User</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email (not editable):</label>
          <input type="email" name="email" value={email || ""} className="form-control" disabled />
        </div>
        <div className="form-group">
          <label>Rol (not editable):</label>
          <input type="text" name="role" value={role || ""} className="form-control" disabled />
        </div>
        <div className="form-group">
          <label>Fist Name:</label>
          <input type="text" name="user_firstname" value={user_firstname || ""} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input type="text" name="user_lastname" value={user_lastname || ""} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input type="text" name="phone" value={phone || ""} onChange={handleChange} className="form-control" />
        </div>

        <button type="submit" className="btn btn-success mt-4">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UserComponent;

