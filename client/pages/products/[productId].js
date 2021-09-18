import Router from "next/router";
import useRequest from "../../hooks/use-request";

const ProductShow = ({product}) => {

  const {doRequest, errors} = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      productId: product.id
    },
    onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`),
  })

  return (
  <div>
    <h1>{product.title}</h1>
    <h4>Price: {product.price}</h4>
    {errors}
    <button onClick={() => doRequest()} className="btn btn-primary">Purchase</button>
  </div>
  )
}

ProductShow.getInitialProps = async (context, client) => {

}

export default ProductShow;