import './App.css';
import React, { useState , useEffect} from 'react';

function App(){
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [editingProductId, setEditingProductId] = useState(null);  
  const textlength = 18;

  useEffect(() => {
    const updatedCart = cart.map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (product) {
        return { ...item, name: product.name, price: product.price, stock: product.stock};
      } else {
        return null;
      }
    }).filter(item => item !== null);
    setCart(updatedCart);
  }, [products]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newProduct = {
      id: nextId,
      name: event.target.name.value,
      price: parseFloat(event.target.price.value),
      stock: parseInt(event.target.stock.value)
    };
    setProducts([...products, newProduct]);
    setNextId(nextId + 1);
    event.target.reset();
    
  };

  const handlePriceChange = (event) => {
    if (event.target.value < 0.00) {
      event.target.value = 0;
    }
    if (event.target.value > 999999999999){
      event.target.value = 1000000000000;
    }
  };

  const handleStockChange = (event) => {
    if (event.target.value < 0) {
      event.target.value = 0;
    }
    if (event.target.value > 999999999999){
      event.target.value = 1000000000000;
    }
  };

  const handleEditClick = (productId) => {
    setEditingProductId(productId);
  };

  const handleUpdateClick = (event, productId) => {
    event.preventDefault();
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        return {
          ...product,
          name: event.target.name.value,
          price: parseFloat(event.target.price.value),
          stock: parseInt(event.target.stock.value)
        };
      } else {
        return product;
      }
    });
    setProducts(updatedProducts);
    setEditingProductId(null);
  };

  const handleDeleteClick = (productId) => {
    const updatedProducts = products.filter((product) => product.id !== productId);
    setProducts(updatedProducts);
  };

  const addToCart = (product) => {
    const existingProduct = cart.find(p => p.id === product.id);
    if (existingProduct) {
      setCart(cart.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    updateStock(product.id, -1);
  };

  const addsToCart = (product) => {
    const existingProduct = cart.find(p => p.id === product.id);
    if (existingProduct) {
      setCart(cart.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    updateStock(product.id, -1);
  };

  const subFromCart = (product) => {
    const existingProduct = cart.find(p => p.id === product.id);
    if (existingProduct && existingProduct.quantity > 1) {
      setCart(cart.map(p => p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p));
      updateStock(product.id, 1);
    } else {
      setCart(cart.filter(p => p.id !== product.id));
      updateStock(product.id, existingProduct ? existingProduct.quantity : 0);
    }
  };

  const removeFromCart = (product) => {
    const existingProduct = cart.find(p => p.id === product.id);
    if (existingProduct) {
      setCart(cart.filter(p => p.id !== product.id));
      updateStock(product.id, existingProduct.quantity);
    }
  };

  const updateStock = (productId, quantity) => {
    const updatedProducts = products.map(p => p.id === productId ? { ...p, stock: p.stock + quantity } : p);
    setProducts(updatedProducts);
  };

  const calculateItemTotal = (product) => {
    return product.price * product.quantity;
  };

  const calculateTotal = () => {
    return cart.reduce((acc, product) => acc + calculateItemTotal(product), 0);
  };

  const notifNoItem = (props) => {
    if (props.length <= 0){
      return <center>There are no listed item(s) in the inventory.</center>;
    }
  }

  const handlePurchase = (total) => {
    console.log(cart);
    console.log("Total Overall Cost: ₱" + total);
    alert('You have Purchased the Items in Your Cart! \nTotal Cost of ₱'+total+'!');
    setCart([]);
  }

  return (
    <div>
      <div className='header'>
        <div className='title'>REACT Jeshua-Shop</div>
      </div>
      <table>
        <thead>
          <tr>
            <th><h1>VENDOR SIDE</h1></th>
            <th><h1>CUSTOMER SIDE</h1></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td width="50%">
              <form onSubmit={handleSubmit} autoComplete="off">
                <h2>Product Registration</h2>
                <table>
                  <thead>
                    <tr>
                      <th style={{width: '32%'}}>Product Name:</th>
                      <th style={{width: '24%'}}>Price:</th>
                      <th style={{width: '24%'}}>Stock:</th>
                      <th style={{width: '20%'}}>Register</th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>
                        <input type="text" name="name" maxLength={textlength} style={{width: '80%'}} required/>
                    </td>
                    <td>
                        ₱<input type="number" name="price" step="any" min="0" maxLength="15" onChange={handlePriceChange} style={{width: '80%'}} required/>
                    </td>
                    <td>
                        <input type="number" name="stock" min="0" maxLength="15" onChange={handleStockChange} style={{width: '80%'}} required/>
                    </td>
                    <td>
                      <button type="submit" style={{width: '95%'}}>Add Product</button>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </form>

              <div>
              <h2>Product Inventory</h2>
              <table>
                <thead>
                  <tr>
                    <th style={{width: '15%'}}>Product ID:</th>
                    <th style={{width: '25%'}}>Product Name:</th>
                    <th style={{width: '20%'}}>Price:</th>
                    <th style={{width: '20%'}}>Stock:</th>
                    <th style={{width: '20%'}}>Setting</th>
                  </tr>
                </thead>
              </table>
                {products.map((product) => (
                  <div key={product.id}>
                    {editingProductId === product.id ? (
                      <form onSubmit={(event) => handleUpdateClick(event, product.id)} autoComplete="off">
                        <table>
                          <tbody>
                            <tr>
                              <td style={{width: '15%'}}>{product.id}</td>
                              <td style={{width: '25%'}}><input type="text" name="name" maxLength={textlength} defaultValue={product.name} style={{width: '100%'}} required /></td>
                              <td style={{width: '20%'}}><input type="number" name="price" maxLength="15" step="any" defaultValue={product.price} onChange={handlePriceChange} style={{width: '100%'}} required /></td>
                              <td style={{width: '20%'}}><input type="number" name="stock" maxLength="15" defaultValue={product.stock} onChange={handleStockChange} style={{width: '100%'}} required /></td>
                              <td style={{width: '20%'}}>
                                <button type="submit" style={{width: '45%'}}>Update</button>{" "}
                                <button type="button" style={{width: '45%'}} onClick={() => setEditingProductId(null)}>Cancel</button>
                              </td>
                            </tr>
                          </tbody>
                        </table> 
                      </form>
                    ) : (
                      <>
                        <table>
                          <tbody>
                            <tr>
                              <td style={{width: '15%'}}>{product.id}</td>
                              <td style={{width: '25%'}}>{product.name}</td>
                              <td style={{width: '20%'}}>₱{product.price}</td>
                              <td style={{width: '20%'}}>{product.stock}</td>
                              <td style={{width: '20%'}}>
                                <button type="button" onClick={() => handleEditClick(product.id)} style={{width: '45%'}}>Edit</button>{" "}
                                <button type="button" onClick={() => handleDeleteClick(product.id)} style={{width: '45%'}}>Delete</button></td>
                            </tr>
                          </tbody>  
                        </table>
                      </>
                    )}
                  </div>
                ))}
                {notifNoItem(products)}
              </div>
            </td>
            <td width="50%">
              <h2>Product List</h2>
              <table>
                <thead>
                  <tr>
                    <th style={{width: '30%'}}>Name</th>
                    <th style={{width: '24%'}}>Price</th>
                    <th style={{width: '24%'}}>Stock</th>
                    <th style={{width: '22%'}}>Option</th>
                  </tr>
                </thead>
                {products.length > 0 ? (
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>₱{product.price}</td>
                      <td>{product.stock}</td>
                      <td>
                        <button disabled={product.stock <= 0} onClick={() => addToCart(product)} style={{width: '95%'}}>Add to Cart</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                ) : (
                  <tbody><tr><td colSpan="6">There are no available item(s) in the product list.</td></tr></tbody>
                )}
              </table>
              <h2>Shopping Cart</h2>
              <table>
                <thead>
                  <tr>
                    <th style={{width: '25%'}}>Name</th>
                    <th style={{width: '18%'}}>Price</th>
                    <th style={{width: '22%'}}>Quantity</th>
                    <th style={{width: '20%'}}>Total</th>
                    <th style={{width: '15%'}}>Option</th>
                  </tr>
                </thead>
                {cart.length > 0 ? (
                <tbody>
                  {cart.map(cartItems => (
                    <tr key={cartItems.id}>
                      <td>{cartItems.name}</td>
                      <td>₱{cartItems.price}</td>
                      <td>
                        <button onClick={() => subFromCart(cartItems)}>-</button>
                        {" "}{cartItems.quantity}{" "}
                        <button disabled={cartItems.stock <= 0} onClick={() => addsToCart(cartItems)}>+</button>
                      </td>
                      <td>₱{calculateItemTotal(cartItems)}</td>
                      <td>
                        <button style={{width: '95%'}} onClick={() => removeFromCart(cartItems)}>Remove</button>
                    </td>
                  </tr>
                ))}
                </tbody>
                ) : (
                  <tbody><tr><td colSpan="6">There are no item(s) in the cart.</td></tr></tbody>
                )}
                <tfoot>
                  <tr>
                    <th colSpan="3">Overall Total Cost: </th>
                    <th colSpan="3">₱{calculateTotal()}</th>
                  </tr>
                  <tr>
                    <td colSpan="6"><button style={{width: '95%'}} disabled={cart.length <= 0} onClick={() => handlePurchase(calculateTotal())}>Purchase</button></td>
                  </tr>
                </tfoot>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;