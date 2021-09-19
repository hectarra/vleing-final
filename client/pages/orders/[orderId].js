import { useEffect, useState } from "react";
import StripeCheckout from 'react-stripe-checkout';
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const OrderShow = ({order, currentUser}) => {

  const [timeLeft, setTimeLeft] = useState(0);
  const {doRequest, errors} = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: () => Router.push('/orders'), 
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft /1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    if(timeLeft < 0) {
      return <div>Order Expired</div>;
    }

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({id}) => doRequest({token: id})}
        stripeKey="pk_test_51JaRqYInLbyH7ZPEzZYkevc7PFhwtunPXa0WiiWnR4lz3YjsSt9JlmBwtSNWDGaf4zn3EE5NY1qL9m2Tsl2JWGFH00LN05M25C"
        amount={order.product.price * 100}
        email={currentUser.email}
        currency="EUR"/>
      {errors}
    </div>
  );
}

OrderShow.getInitialProps = async (context,client) => {
  const {orderId} = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data};
}

export default OrderShow;