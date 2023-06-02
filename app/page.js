"use client";
import { Menu, Transition } from '@headlessui/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Home() {

  return (
    <div className="min-h-screen grid grid-col-1 content-center place-content-center">
      <div className='w-96 border border-solid border-inherit p-8'>
        HOLA
      </div>
    </div>
  );
}