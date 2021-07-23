import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import { useSelector,useDispatch } from 'react-redux';
import { logout } from './actions/userActions';
import RegisterScreen from './screens/RegisterScreen';
import ShippingScreen from './screens/ShippingScreen';
import ProductsScreen from './screens/ProductsScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';

function App() {

  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;

  const cart= useSelector(state=> state.cart);
  const {cartItems} = cart;

  const dispatch=useDispatch();
  const signoutHandler = ()=>{
    dispatch(logout());
  };

  const openMenu = () => {
    document.querySelector(".sidebar").classList.add("open");
  }
  const closeMenu = () => {
    document.querySelector(".sidebar").classList.remove("open")
  }
  return (
    <BrowserRouter>
      <div className="grid-container">
        <header className="row">
          <div>
            <button onClick={openMenu}>
              &#9776;
              </button>
            <Link to="/" className="brand">DressMe</Link>
          </div>

          <div>
            <Link to="/cart">
              Cart
              {cartItems.length > 0 && (
                <span className="badge">{cartItems.length}</span>
                )}
            </Link>
            {userInfo ? (
              <div className="dropdown">
                <Link to="#">
                  {userInfo.name} <i className="fa fa-caret-down"></i>{' '}
                </Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/profile">User Profile</Link>
                  </li>
                  <li>
                    <Link to="/orderhistory">Order History</Link>
                  </li>
                  <li>
                    <Link to="#signout" onClick={signoutHandler}>Sign out</Link>
                  </li>
                </ul>
              </div>
              ): (
                <Link to="/signin">Sign In</Link>
              )}
              {userInfo && userInfo.isAdmin && (
                <div className="dropdown">
                  <Link to="#admin">
                    Admin <i className="fa fa-caret-down"></i>
                  </Link>
                  <ul className="dropdown-content">
                    <li>
                       <Link to="/products">Products</Link>
                    </li>
                    <li>
                       <Link to="/orderhistory">Orders</Link>
                    </li>
                  </ul>
                </div>
            )}
          </div>
        </header>

        <aside className="sidebar">
          <h3>Shopping Categories</h3>
          <button className="sidebar-close-button" onClick={closeMenu}>x</button>
          <ul className="categories">
            <li>
              <Link to="/category/dress">Dresses</Link>
            </li>

            <li>
              <Link to="/category/accessories">Accessories</Link>
            </li>

          </ul>
        </aside>
        <main className="main">

          <div className="content">
            <Route path="/order/:id" component={OrderScreen} />
            <Route path="/orderhistory" component={OrderHistoryScreen} />
            <Route path="/profile" component={ProfileScreen} />
            <Route path="/products" component={ProductsScreen} />
            <Route path="/shipping" component={ShippingScreen} />
            <Route path="/payment" component={PaymentScreen} />
            <Route path="/placeorder" component={PlaceOrderScreen} />
            <Route path="/signin" component={SigninScreen} />
            <Route path="/register" component={RegisterScreen} />
            <Route path="/cart/:id?" component={CartScreen} />
            <Route path="/" exact={true} component={HomeScreen} />
            <Route path="/category/:id" component={HomeScreen} />
            <Route path="/product/:id" exact={true} component={ProductScreen} />
          </div>

        </main>

        <footer className="footer">
          &#169; 2017 DressMe
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
