import type { AppProps } from 'next/app';
import Layout from '../components/layout'; // Sesuaikan path jika berbeda
import '../styles/globals.css'; // Ini penting untuk styling global Anda

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}