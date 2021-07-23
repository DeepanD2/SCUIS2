import Axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import React, { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deliverOrder, detailsOrder, payOrder } from '../actions/orderActions';
import PaypalButton from '../components/PaypalButton';
import CheckoutSteps from '../components/CheckoutSteps';
import {
  ORDER_DELIVER_RESET,
  ORDER_PAY_RESET,
} from '../constants/orderConstants';


function OrderScreen(props) {

  const orderId = props.match.params.id;
  const [sdkReady, setSdkReady] = useState(false);
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const orderPay = useSelector((state) => state.orderPay);
  const {
    loading: loadingPay,
    error: errorPay,
    success: successPay,
  } = orderPay;
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const {
    loading: loadingDeliver,
    error: errorDeliver,
    success: successDeliver,
  } = orderDeliver;
  const dispatch = useDispatch();
  useEffect(() => {
    const addPayPalScript = async () => {
      const { data } = await Axios.get('/api/config/paypal');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };
    if (
      !order ||
      successPay ||
      successDeliver ||
      (order && order._id !== orderId)
    ) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(detailsOrder(orderId));
    } else {
      if (!order.isPaid) {
        if (!window.paypal) {
          addPayPalScript();
        } else {
          setSdkReady(true);
        }
      }
    }
  }, [dispatch, order, orderId, sdkReady, successPay, successDeliver]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(order, paymentResult));
  };
  const deliverHandler = () => {
    dispatch(deliverOrder(order._id));
  };

  return loading ? (<div>Loading ...</div>) : error ? (<div>{error}</div>) : (
    <div>
      <h2>Order {order._id}</h2>
      <div className="row top">
        <div className="col-2">
          <ul>
            <li>
              <div className="card card-body">
                <h3>Shipping</h3>
                <p>
                  <strong>Address: </strong> {order.shipping.address},
                  {order.shipping.city},{' '}
                  {order.shipping.postalCode},
                  {order.shipping.country}
                </p>
                {order.isDelivered ? (
                  <div variant="success">
                    Delivered at {order.deliveredAt}
                  </div>
                ) : (
                  <div variant="danger">Not Delivered</div>
                )}
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h3>Payment</h3>
                <p>
                  <strong>Method:</strong> {order.paymentMethod}
                </p>
                {order.isPaid ? (
                  <div variant="success">
                    Paid at {order.paidAt}
                  </div>
                ) : (
                  <div variant="danger">Not Paid</div>
                )}
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h3>Order Items</h3>
                <ul>
                  {order.orderItems.map((item) => (
                    <li key={item.product}>
                      <div className="row">
                        <div>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="small"
                          ></img>
                        </div>
                        <div className="min-30">
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </div>

                        <div>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-1">
          <div className="card card-body">
            <ul>
              <li>
                <h3>Order Summary</h3>
              </li>
              <li>
                <div className="row">
                  <div>Items</div>
                  <div>${order.itemsPrice}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Shipping</div>
                  <div>${order.shippingPrice}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Tax</div>
                  <div>${order.taxPrice}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>
                    <strong> Order Total</strong>
                  </div>
                  <div>
                    <strong>${order.totalPrice}</strong>
                  </div>
                </div>
              </li>
              {!order.isPaid && (
                <li>
                  {!sdkReady ? (
                    <div>Loading...</div>
                  ) : (
                    <>
                      {errorPay && (
                        <div variant="danger">{errorPay}</div>
                      )}
                      {loadingPay && <div></div>}

                      <PayPalButton
                        amount={order.totalPrice}
                        onSuccess={successPaymentHandler}
                      ></PayPalButton>
                    </>
                  )}
                </li>
              )}
              {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <li>
                  {loadingDeliver && <div>Loading...</div>}
                  {errorDeliver && (
                    <div variant="danger">{errorDeliver}</div>
                  )}
                  <button
                    type="button"
                    className="primary block"
                    onClick={deliverHandler}
                  >
                    Deliver Order
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderScreen;