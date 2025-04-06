'use client';
import React from 'react';
import { ArrowRight, Users, Sparkles, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Props = {};

const Hero = (props: Props) => {
  const router = useRouter();

  const scrollToFeature = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    const featureSection = document.getElementById('feature');
    if (featureSection) {
      featureSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero relative overflow-hidden pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        {/* Feature spans */}
        <span className="hidden md:inline-flex absolute top-[10rem] left-8 px-4 py-2 bg-white/10 text-white rounded-full items-center space-x-2 backdrop-blur-sm">
          <Users size={18} />
          <span>Real-Time Collaboration</span>
        </span>

        <span className="hidden md:inline-flex absolute top-[13rem] right-28 px-4 py-2 bg-white/10 text-white rounded-full items-center space-x-2 backdrop-blur-sm">
          <Sparkles size={18} />
          <span>AI-Powered Assistance</span>
        </span>

        <span className="hidden md:inline-flex px-4 absolute bottom-[10rem] left-[5rem] py-2 mt-8 bg-white/10 text-white rounded-full items-center space-x-2 backdrop-blur-sm">
          <MessageSquare size={18} />
          <span>Smart Summarization</span>
        </span>

        <div className="text-center">
          <h1 className="text-6xl md:text-7xl font-extrabold leading-tight mb-6">
            Collaborative editing
            <br />
            powered by AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto">
            Experience the future of document editing with{' '}
            <FeatureTag text="Real-time Collaboration" color="blue" />,
            <FeatureTag text="AI-Powered Writing" color="green" />, and{' '}
            <FeatureTag text="Smart Summarization" color="pink" />. Elevate your
            team productivity to new heights.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => router.push('/sign-up')}
              className="px-8 py-4 bg-white text-black rounded-md text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
            >
              Start writing for free
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <div className="relative">
              <a
                href="#feature"
                onClick={scrollToFeature}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-md text-lg font-semibold transition duration-300 ease-in-out"
              >
                Watch demo
              </a>
              <Image
                className="hidden md:block absolute left-[11.5rem] bottom-[1rem]"
                height={200}
                width={200}
                src="/pointingArrow.svg"
                alt="Click on Watch Demo"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Background pattern */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-purple-900/20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>
    </section>
  );
};

export default Hero;

const FeatureTag: React.FC<{ text: string; color: string }> = ({
  text,
  color,
}) => {
  const colorClasses: { [key: string]: string } = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    pink: 'bg-pink-500/20 text-pink-400',
  };

  return (
    <span
      className={`inline-block px-2 py-1 rounded-md text-sm font-medium ${colorClasses[color]}`}
    >
      {text}
    </span>
  );
};
