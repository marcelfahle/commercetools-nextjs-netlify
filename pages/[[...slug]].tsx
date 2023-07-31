import Image from 'next/image'
import { Inter } from 'next/font/google'
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] })

type MenuItem = {
  slug: { target: string };
  name: { en_GB: string };
}

type Product = {
  name: string;
  _url: string;
  variants?: [{ images: string[] }]
}

type Props = {
  title: string;
  menu?: MenuItem[];
  products?: Product[];
  product?: Product
}

export default function Home({ title, menu, products, product }: Props) {
  console.log(products)
  console.log(product)
  return (
    <main
      className={`flex min-h-screen flex-col items-center p-24 ${inter.className}`}
    >
      <nav className='ring-1 p-4 mb-12'>
        <ul className='flex flex-row gap-x-4'>
          <li><Link href="/">Home</Link></li>
          {menu && menu.map(item => {
            return <li key={item.slug.target}><Link href={item.slug.target}>{item.name.en_GB}</Link></li>
          })}
        </ul>
      </nav>
      <h1></h1>
      <div className='w-full flex gap-x-8'>
        <ul className='w-1/3'>
          {products && products.length > 0 && products.map(item => {
            return <li key={item.name}><Link href={item._url}>{item.name}</Link></li>
          })}
        </ul>
        <div className='w-2/3'>
          {product && <div>
            <h1>{product.name}</h1>
            {product.variants
              && product.variants.length > 0
              && <Image src={product.variants[0].images[0]} alt={product.variants[0].images[0]} width={360} height={240} />}
          </div>}
        </div>
      </div>
    </main>
  )
}

export async function getStaticPaths() {

  const paths: any = [];
  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }: { params: any }) {
  console.log('params', params)
  const slug = params.slug?.join('/') || '/';
  const url = process.env.SITE_URL || '';
  const res = await fetch(url, {
    headers: {
      'Frontastic-Path': slug,
      'Frontastic-Locale': 'en_GB',
      'Frontastic-Currency': 'GBP'
    }
  });
  const payload = await res.json();
  console.log(url)
  console.log(payload)

  //$.page.sections.head.layoutElements[0].tastics[0].configuration.navigationCategories

  return {
    props: {
      title: payload.pageFolder.name,
      menu: payload.page.sections.head.layoutElements[0].tastics[0].configuration.navigationCategories,
      products: payload.data.dataSources.__master?.items || [],
      product: payload.data.dataSources.__master?.product || []
    },
    revalidate: 3600
  }
}

