import { GetStaticProps } from 'next';
import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';

import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({product}: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
     <main className={styles.contentContainer}>
       <section className={styles.hero}>
         <span> Hey, welcome</span>
         <h1>News about the <span>React</span> world.</h1>
         <p>
           Get access to all the publications <br />
           <span>for {product.amount} month</span>
         </p>
         <SubscribeButton priceId={product.priceId} />
       </section>
       <img src="/images/avatar.svg" alt="Girl coding" />
     </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  // recupera id de preço referente a algum produto no stripe
  const price = await stripe.prices.retrieve('price_1IvjOHBO63vCfWmI2RKdfntH', {
    // permite acesso a todas as informações do produto
    expand: ['product']
  });

  const product = {
    priceId: price.id,
    // salvar preço no banco de dados sempre em centavos 
    // pois se torna mais fácil de manipular o valor
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount/100),
  }

  return {
    props: {
      product
    },
    // quanto tempo em segundos para a página ser reconstruída e salva novamente
    revalidate: 60 * 60 * 24
  }
}
