import '@/styles/globals.css';
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';
import 'react-tooltip/dist/react-tooltip.css';
import { SWRConfig } from 'swr';
import { Karla, Poppins } from '@next/font/google';
import { Toaster } from 'react-hot-toast';

const karla = Karla({
  subsets: ['latin'],
  variable: '--font-karla',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  const layout = getLayout(<Component {...pageProps} />);
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-poppins: ${poppins.style.fontFamily};
            --font-karla: ${karla.style.fontFamily};
          }
        `}
      </style>
      <SWRConfig
        value={{
          // refreshInterval: 3000,
          revalidateOnFocus: false,
          fetcher: (resource, init) =>
            fetch(resource, init).then((res) => res.json()),
        }}
      >
        <Toaster
          position="bottom-center"
          containerStyle={{
            top: 40,
            left: 40,
            bottom: 40,
            right: 40,
          }}
          toastOptions={{
            duration: 5000,
            className:
              'max-w-[200px] font-body text-white rounded-md shadow-md p-3',
            style: {
              background: '#3c3744',
              color: '#fff',
            },
          }}
        />
        {layout}
      </SWRConfig>
    </>
  );
}
