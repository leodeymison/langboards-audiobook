'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import ContentBody from '@/components/Content';
import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';

export default function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const [currentPage, setCurrentPage] = useState(1);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!page || isNaN(Number(page))) {
      router.push('/?page=1');
    } else {
      setCurrentPage(Number(page));
    }
  }, [page, router]);

  useEffect(() => {
    async function fetchText() {
      if (currentPage <= 0 || currentPage >= 100) {
        setText('');
        return;
      }

      try {
        const response = await fetch(`/data/${currentPage}.txt`);
        if (!response.ok) {
          setText('');
          return;
        }
        const data = await response.text();
        setText(data);
      } catch (error) {
        setText('');
      }
    }

    fetchText();
  }, [currentPage]);

  async function getText(option: number) {
    if (option <= 0) return '';
    if (option >= 100) return '';

    try {
      const response = await fetch(`/data/${option}.txt`);
      if (!response.ok) return '';
      const data = await response.text();
      return data;
    } catch (error) {
      return '';
    }
  }

  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
    router.push(`/?page=${currentPage + 1}`);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      router.push(`/?page=${currentPage - 1}`);
    }
  };

  return (
    <div className="w-3/4 max-2xl:w-11/12 py-2">
      <div className='flex justify-center items-center flex-col py-10'>
        <h1 className='text-5xl font-bold'>{page}</h1>
        <p className='font-medium text-lg text-gray-500'>Nível atual</p>
      </div>
      <ContentBody audio={<>Audio aqui</>} text={text} />
      <div className='flex justify-between mt-4'>
        <button
          className='bg-gray-600 text-white px-5 py-2 rounded-md flex items-center gap-1'
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          <IoIosArrowBack />
          <span>Voltar</span>
        </button>
        <button className='bg-green-600 text-white px-5 py-2 rounded-md flex items-center gap-1' onClick={handleNext}>
          <span>Próximo</span>
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
}
