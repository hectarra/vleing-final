const OrderIndex = ({orders}) => {

  const ordersList = orders.map(order => {
    return (
      <tr key={order.id}>
        <td>{order.product.title}</td>
        <td>{order.status}</td>
      </tr>
    )
  })

  return(
    <div>
      <h1>Orders</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {ordersList}
        </tbody>
      </table>
    </div>
  )
}

OrderIndex.getInitialProps = async (context, client) => {
  const {data} = await client.get('/api/orders');
  return {orders: data }
};

export default OrderIndex;