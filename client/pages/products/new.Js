import { useState } from "react";
import Router from 'next/router';
import useRequest from "../../hooks/use-request";

const NewProduct = () => {

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/products',
    method: 'post',
    body: {
      title, 
      price,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = (event) => {
    event.preventDefault();
    doRequest();
  }

  const onBlur = () => {
    const value = parseFloat(price);
    if(isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  }

  return (
    <div>
 
    </div>
  );
};

export default NewProduct;