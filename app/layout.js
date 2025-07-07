import { Inter } from 'next/font/google'
import "./globals.css";
import Footer from '@/components/footer';
import Header from '@/components/header';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ExpensifyX",
  description: "One stop  Finance platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>

    <html lang="en">
      <body
        className={`${inter.className}`}>
        {/* Header */}
        <Header/>

        <main className='min-h-screen' >
          {children}
        </main>
        <Toaster richColors />


        {/* Footer */}
        <div className='bg-blue-100' >
          <Footer />
        </div>



      </body>
    </html>
          </ClerkProvider>
  );
}
