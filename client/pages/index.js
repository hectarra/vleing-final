import Link from 'next/link'
import buildClient from '../api/build-client'

const LandingPage = ({ currentUser, products }) => {

  const productsList = products.map(product => {
    return (
      <tr key={product.id}>
        <td>{product.title}</td>
        <td>{product.price}</td>
        <td>
          <Link href="/products/[productId]" as={`/products/${product.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    )
  })

  return(
    <div>
      <h1>Products!</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {productsList}
        </tbody>
      </table>
    </div>
  )
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const {data} = await client.get('/api/products');
  return {products: data }
};

export default LandingPage;