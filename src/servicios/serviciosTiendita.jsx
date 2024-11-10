import axios from 'axios';

const endPoint = import.meta.env.VITE_REACT_API_URL;


// Función para obtener la lista de productos
const getItems = async (search = '') => {
    try {
        const response = await axios.get(`${endPoint}items`, {
            params: { search }
        });
        if (response.data.estatus === "success") {
            console.log(response.data.data);
            return response.data.data; 
        } else {
            throw new Error(response.data.mensaje || 'Error al obtener productos');
        }
    } catch (error) {
        throw error.response ? error.response.data : new Error('Error al obtener productos');
    }
};

// Función para obtener los detalles de un producto
const getProductDetails = async (id) => {
    try {
        const response = await axios.get(`${endPoint}item/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Error al obtener detalles del producto');
    }
};

// Función para realizar una compra
const addSale = async (saleData) => {
    try {
        const response = await axios.post(`${endPoint}addSale`, saleData);
        console.log(response);
        console.log(response.data);
        
        if (response.data.estatus === "success") {
            return response.data.estatus;
        } else {
            throw new Error(response.data.mensaje || 'Error al realizar la compra');
        }
    } catch (error) {
        throw error.response ? error.response.data : new Error('Error al realizar la compra');
    }
};

// Función para consultar las compras realizadas
const getSales = async () => {
    try {
        const response = await axios.get(`${endPoint}sales`);
        console.log(response.data.data);
        if (response.data.estatus === "success") {
            return response.data.data; 
        } else {
            throw new Error(response.data.mensaje || 'Error al obtener las compras');
        }
    } catch (error) {
        throw error.response ? error.response.data : new Error('Error al obtener las compras');
    }
};

export default {
    getItems,
    getProductDetails,
    addSale,
    getSales
};