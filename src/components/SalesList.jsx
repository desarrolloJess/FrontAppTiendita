import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AuthService from '../servicios/serviciosTiendita';
import '../estilos/estilos.css';

const SalesList = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);

  // Función para obtener los Compras realizadas
  const obtenerCompras = async () => {
    try {
      const data = await AuthService.getSales();
      setSales(data);      
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerCompras();

  }, []);

  const handleExit = () => {
    navigate('/');
  };
  const handleRegresar = () => {
    navigate(-1); 
  };

  return (
    <div className="row">

      <div className="sales-list-container">
        <h2 className="text-center font-weight-bold">Tus Compras</h2>
        <div className="scrollable-container">
        <ul className="list-group list-group-flush">
          {sales.map((sale) => (
            <li key={sale.id} className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start mb-3 p-3 border rounded shadow-sm">
              <div className="w-100 mb-2 mb-md-0">
                <strong className="d-block mb-1">{sale.nombreProducto}</strong>
                <p className="text-muted mb-1">Fecha: {sale.fecha}</p>
                <p className="text-warning mb-1">
                  <strong>Cantidad: </strong>
                  {sale.cantidad}
                </p>
              </div>
              <div className="text-end">
                <p className="text-secondary mb-0">
                  <strong>Costo: </strong>${sale.costo} <small>c/u</small>
                </p>
              </div>
            </li>
          ))}
        </ul>

        </div>
        <div className="text-center mt-4">
          <button className="btn btn-primary" onClick={handleExit}>Home</button>
          <button className="btn btn-outline-danger btn-sm" onClick={handleRegresar}>Regresar</button>
        </div>
      </div>

    </div>
    
  );
};

export default SalesList;
