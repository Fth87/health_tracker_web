'use client';
import React from 'react';
import { title, subtitle } from '../../components/primitives';
import CardHome from '../../components/CardHome';
import { FaWeightScale } from 'react-icons/fa6';
import { ImFire } from 'react-icons/im';
export default function Home() {
  const cardData = [
    {
      title: 'Trackker Kesehatan',
      image: 'https://i.pinimg.com/736x/cc/47/45/cc474537618ae14f3d62ff718641c491.jpg',
      desc: 'Tracker Kesehatan powered with AI',
      link: '/cekkesehatan',
      icon: FaWeightScale,
    },
    {
      title: 'Sorting Laptop',
      image: 'https://i.pinimg.com/736x/f8/38/1e/f8381e0836109a33b27bb9ad785dc4f9.jpg',
      desc: 'Coming Soon',
      link: '/sortinglaptop',
      icon: ImFire,
    },
  ];

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Final &nbsp;</span>
        <span className={title({ color: 'violet' })}>Project&nbsp;</span>
        <br />
        <div className={subtitle({ class: 'mt-4' })}>Matematika Diskrit</div>
      </div>
      <div className="flex gap-3 justify-center align-center w-full flex-wrap mt-6">
        {cardData.map((item, index) => (
          <CardHome key={index} title={item.title} image={item.image} desc={item.desc} link={item.link} Icon={item.icon} />
        ))}
      </div>
    </section>
  );
}
