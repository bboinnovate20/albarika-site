import { Dot } from 'lucide-react'
import React from 'react'

export default function WAECCard() {
  return (
    <div className='bg-gray-50 shadow-2xl ring-1 rounded-lg w-[400px] h-[210px] overflow-hidden'>
        <div className='bg-gray-700 p-2 text-white flex justify-between'>
            <h1 className='font-bold text-lg'>WAEC Card Checker</h1>
            <h1 className='font-bold '>AL-BARIKA COMPUTER SCIENCE</h1>
        </div>
        <div className='p-2 leading-4 text-[12px]'>
            <ul>
                <p className='font-bold'>Instructions:</p>
                <li>&#8226; Obtain your serial PIN (a 12 digit number)</li>
                <li>&#8226; Visit the website WAEC DIRECT https://www.waecdirect.org/</li>
                <li>&#8226; Fill in the information required on the Home Page</li>
                <li>&#8226; Click Submit</li>
            </ul>
            <div className='flex gap-2 justify-stretch mt-3.5 '>
                
                <div className='ring-1 ring-gray-500 grow-1 leading-5 rounded-md p-1 bg-gray-100 basis-[45%]'>
                    <h4>Serial Number</h4>
                    <h1 className='text-[16px] font-bold'>WRN******************455</h1>
                </div>
                <div className='ring-1 ring-gray-500 grow-1 leading-5 rounded-md p-1 bg-gray-100 basis-[45%]'>
                    <h4>PIN</h4>
                    <h1 className='text-[16px] font-bold'>555*************456</h1>
                </div>
            </div>
        </div>
    </div>
  )
}
