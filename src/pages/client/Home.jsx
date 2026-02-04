// src/pages/client/Home.jsx
import Navbar from '../../components/layout/Navbar';
import Hero from '../../components/client/Hero';
import NewArrivals from '../../components/client/NewArrivals'; // [!code ++]
import OurProducts from '../../components/client/OurProducts';
import Footer from '../../components/layout/Footer'; //

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col ">
      <Navbar />
      
      <main className="max-w-full mx-auto pb-20 flex-grow">
        <Hero />

        {/* 1. Latest 4 Products */}
        <NewArrivals /> 

        {/* 2. Full Collection with Filters and Pagination */}
        <OurProducts /> 
      </main>

      <Footer />
    </div>
  );
}