import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../servicios/serviciosTiendita';
import '../estilos/estilos.css';
import Swal from 'sweetalert2'; 

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [searchTerm, setSearchTerm] = useState("");
  const [product, setProduct] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerDetalles = async () => {
      try {
        const productData = await api.getProductDetails(id); 
        setProduct(productData); 
        setLoading(false); 
      } catch (err) {
        console.log(err);
        setError("No se pudo obtener los detalles del producto.");
        setLoading(false); 
      }
    };

    obtenerDetalles();
  }, [id]); 

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchEnter = (event) => {
    if (event.key === 'Enter') {
      navigate(`/items?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLogoClick = () => {
    navigate('/sales');
  };

  // Función para agregar la cantidad de productos de la compra
  const handlePurchase = () => {
    Swal.fire({
      title: '¿Cuántos productos deseas comprar?',
      input: 'number',
      inputLabel: 'Cantidad',
      inputValue: 1,
      inputAttributes: {
        min: 1,
        max: 100,
        step: 1
      },
      showCancelButton: true,
      confirmButtonText: 'Finalizar compra',
      cancelButtonText: 'Cancelar',
      preConfirm: async (cantidad) => {
        if (cantidad && cantidad > 0) {
          try {
            const saleData = {
              productId: product.id,   
              amount: cantidad         
            };
            await addSale(saleData); 
            Swal.fire('¡Compra finalizada!', 'Tu compra ha sido procesada exitosamente.', 'success');
            navigate('/sales'); 
          } catch (error) {
            console.log(error);            
            Swal.fire('Error', 'Hubo un problema al realizar la compra.', 'error');
          }
        } else {
          Swal.showValidationMessage('Por favor ingresa una cantidad válida');
        }
      }
    });
  };

  // Función para realizar una compra
  const addSale = async (saleData) => {
    try {
      const response = await api.addSale(saleData);
      if (response === 'success') {
        return true;
      } else {
        throw new Error(response.data.mensaje || 'Error al realizar la compra');
      }
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error al realizar la compra');
    }
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (error) {
    return <div>{error}</div>; 
  }

  if (!product) {
    return <div>Producto no encontrado.</div>; 
  }

  return (
    <div className="product-details-container">
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
            placeholder="Buscar productos..."
            aria-label="Buscar producto"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchEnter}
          />
        </div>
      </div>

      <div className="d-flex justify-content-between mb-4">
        {Array.from({ length: 3 }).map((_, index) => {
          const imgSrc = product.images && product.images[index] 
            ? product.images[index] 
            : 'https://cdn-icons-png.freepik.com/256/17205/17205369.png?semt=ais_hybrid';

          return (
            <div key={index} className="circle-image-container">
              <img
                src={imgSrc}
                alt={`Imagen ${index + 1}`}
                className="rounded-circle"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://cdn-icons-png.freepik.com/256/17205/17205369.png?semt=ais_hybrid';
                }}
              />
            </div>
          );
        })}
      </div>


      <div className="product-name mb-2 text-center">
        <h3>{product.title}</h3>
      </div>

      <div className="product-category mb-4 text-center">
        <p className="text-muted" style={{ textTransform: 'uppercase', fontSize: '0.8rem',lineHeight: '1.5' }}>
          <strong>Categoría: </strong>
          {product.category}
        </p>
      </div>

      <div className="product-description mb-4">
        <p style={{ textTransform: 'uppercase', fontSize: '1rem',lineHeight: '1.5' }}>
          {product.description}
        </p>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <span className="text-danger" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          {`$${product.price}`}
        </span>
        <span className="text-danger" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
          {'★'.repeat(product.rating)}{'☆'.repeat(5 - product.Rating)}
        </span>
      </div>

      <div className="d-flex justify-content-center">
        <button className="btn btn-primary" onClick={handlePurchase}>Comprar</button>
      </div>
    </div>
  );
};

export default ProductDetails;
