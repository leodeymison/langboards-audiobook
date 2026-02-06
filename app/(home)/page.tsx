import fs from 'fs';
import path from 'path';

import ContentBody from '@/components/Content';

export default async function Home() {
  const filePath = path.join(process.cwd(), 'public', 'data', '1.txt');
  const text = fs.readFileSync(filePath, 'utf-8');
  return (
    <div className="w-3/4 max-2xl:w-11/12 py-2">
      <div className='flex justify-center items-center flex-col py-10'>
        <h1 className='text-5xl font-bold'>1</h1>
        <p className='font-medium text-lg text-gray-500'>Nível atual</p>
      </div>
      <ContentBody audio={<>Audio aqui</>} text={text} />
    </div>
  );
}
