import type { Metadata } from 'next'
import AddProductForm from './AddProductForm'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'ثبت محصول جدید | مدیریت Aqua Blue',
  description: 'پنل مدیریت - ثبت محصول جدید در فروشگاه Aqua Blue',
  robots: { index: false, follow: false },
}

export default function AddProductPage() {
  return (
    <>
      <Header />
      <AddProductForm />
      <Footer />
    </>
  )
}
