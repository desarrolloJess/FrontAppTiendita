import { useState, useEffect } from 'react'; 
import { useLocation, useNavigate } from 'react-router-dom';
import AuthService from '../servicios/serviciosTiendita';
import '../estilos/estilos.css';

const ResultsScreen = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  //Obtiene el termino de la URL
  const query = searchParams.get('search'); 
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);  
  const [loading, setLoading] = useState(true);    
  const [numRegistros, setNumRegistros] = useState(0); 

  // Función para obtener los productos basado en el término de búsqueda
  const obtenerBusqueda = async (valorBuscado) => {
    try {
      const data = await AuthService.getItems(valorBuscado);
      setNumRegistros(data.totalResults);
      setProductos(data.products);    
      setLoading(false);  // Termina el estado de carga
    } catch (error) {
      console.log(error);
      
      setLoading(false);
    }
  };

  // Efecto para realizar la búsqueda cuando cambia el query
  useEffect(() => {
    if (query) {
      obtenerBusqueda(query);
    } else {
      setLoading(false);
    }
  }, [query]); 

  const handleProductClick = (id) => {
    navigate(`/item/${id}`); 
  };

  const handleSearchInputChange = (event) => {
    console.log(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      const searchValue = event.target.value.trim();
      if (searchValue) {
        navigate(`/items?search=${searchValue}`);
      }
    }
  };

  //Permite redireccionarnos a compras
  const handleLogoClick = () => {
    navigate('/sales');
  };

  // Renderiza un mensaje de carga si está en proceso
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="results-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <img
          src="/public/images/logo.png"
          alt="Logo"
          className="mb-4"
          style={{ width: '50px', cursor: 'pointer' }}
          onClick={handleLogoClick}
        />
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar más productos..."
            aria-label="Buscar producto"
            onChange={handleSearchInputChange}
            onKeyDown={handleKeyDown}
            defaultValue={query} 
          />
        </div>
      </div>

      <div className="mb-4">
        <h3>Resultados de la búsqueda de <strong> {query} </strong></h3>
        <p>
          {numRegistros} {numRegistros > 1 ? 'registros' : 'registro'} encontrados
        </p>
      </div>

      <div className="row scrollable-container">
        {productos.length > 0 ? (
          productos.map(product => (
            <div className="col-12 mb-4" key={product.id} onClick={() => handleProductClick(product.id)} style={{ cursor: 'pointer' }}>
              <div className="d-flex align-items-center"
                style={{
                  borderBottom: '1px solid #4f4f4f',
                  paddingBottom: '1rem', 
                  marginBottom: '1rem'
                }}
              >
              <img
                    src={product.images ? product.images[0] : 'https://cdn-icons-png.freepik.com/256/17205/17205369.png?semt=ais_hybrid'}
                    alt={product.title}
                    className="rounded-circle"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://cdn-icons-png.freepik.com/256/17205/17205369.png?semt=ais_hybrid';
                    }}
                  />
                <div className="col-8">
                  <div className="row">
                    <div className="col-12">
                      <h5>
                        <strong>{product.title}</strong>
                        <span style={{ marginLeft: '0.8rem', fontSize: '1rem', fontWeight: 'bold' }} className="text-danger" >{`$${product.price}`}</span>
                      </h5>
                    </div>
                    <div className="col-12">
                      <p className="text-muted" style={{ textTransform: 'uppercase', fontSize: '0.8rem',lineHeight: '1.5' }}> 
                        <strong>Categoría: </strong>
                        {product.category}
                        <br/>
                        {product.description}
                      </p>
                    </div>
                    <div className="col-12 d-flex justify-content-between align-items-center">                      
                      <span className="text-danger" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {'★'.repeat(product.rating)}{'☆'.repeat(5 - product.rating)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>
            <p className="text-danger">
              No se encontraron productos.
            </p>
          </div> 
        )}
      </div>
    </div>
  );
};

export default ResultsScreen;
