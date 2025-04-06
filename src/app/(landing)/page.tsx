import React from 'react';
import Nav from '../components/Nav';
import Hero from '../components/Hero';
import Feature from '../components/Feature';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white dark:bg-white dark:text-black font-sans">
      <Nav />
      <Hero />
      <Feature />
    </div>
  );
};

export default LandingPage;
