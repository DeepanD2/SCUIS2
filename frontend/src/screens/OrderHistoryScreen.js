import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listMyOrders } from '../actions/orderActions';

function OrderHistoryScreen(props){
	const orderList = useSelector((state)=>state.myOrderList);
	const { loading, error, orders } = orderList;
	const dispatch = useDispatch();
	useEffect(()=>{
		dispatch(listMyOrders());
	}, [dispatch]);
	return (
		<div>
			<h1>Order History</h1>
			{loading? (
				<div>Loading...</div>
			) : error ? (
				<div>{error}</div>
			) : (
				<table className="table">
					<thead>
						<tr>
							<th>ID</th>
							<th>DATE</th>
							<th>TOTAL</th>
							<th>PAID</th>
							<th>DELIVERED</th>
							<th>ACTIONS</th>
						</tr>
					</thead>
					<tbody>
						{orders.map((order)=>(
							<tr key={order._id}>
								<td>{order._id}</td>
								<td>{order.createdAt.substring(0,10)}</td>
								<td>{order.totalPrice}</td>
								<td>{order.isPaid ? order.paidAt.substring(0,10): 'No'}</td>
								<td>{order.isDelivered ? order.deliveredAt.substring(0,10) : 'No'}</td>
								<td>
									<button type="button" className="small" 
									onClick={()=>{props.history.push(`/order/${order._id}`);
								}}>Details</button>
								</td>
							</tr>
							))}
					</tbody>
				</table>
				)}

		</div>
		);
}

export default OrderHistoryScreen;