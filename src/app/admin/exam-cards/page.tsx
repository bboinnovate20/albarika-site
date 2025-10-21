"use client";

import PrimaryBtn from '@/components/custom-ui/primary-btn'
import Status from '@/components/custom-ui/status'
import { generateWAECCardsPDF } from '@/components/GenerateWAEC';
import HeaderAdmin from '@/components/HeaderAdmin';
import { handleGeneratePdf } from '@/components/HTMLToPDF'
import { Button } from '@/components/ui/button'
import WAECCard from '@/components/WAECCard'
import {generateMultipleWAECCardsHTML, generateWAECCardHTML } from '@/lib/convert-waec-html'
import { Download, Send } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

export default function WAECVerification() {
   
   const [loading, setLoading] = useState<boolean>(false);

   const handleDownload = () => {
    setLoading(true);
    const html = generateWAECCardsPDF([
        {serialNumber: "WRN1234567890455", pin: "555123456789456"},
        {serialNumber: "WRN1234567890455", pin: "555123456789456"}
    ])
      setLoading(false);
    // handleGeneratePdf(html)
    toast.success("Sucessfully generated");

    // setTimeout(()=> {
    //     // setLoading(false);
    // }, 1000);
  }

  useEffect(() => {
   
  }, [])

  return (
    <div>
       
       <main className='flex flex-col'>
        <div>
            <HeaderAdmin title='EXAM Cards'/>
            <WAECCard/>
            <PrimaryBtn 
            isLoading={loading}
            onClick={handleDownload}
            prefixIcon={<Send/>}>Purchase WAEC Card</PrimaryBtn>
            
        </div>
            
            <h1 className='text-2xl font-bold mt-6 mb-3'>Transactions</h1>

            <table className=''>
                <thead className='border border-black bg-gray-200'>
                    <tr>
                    <th className='border border-black p-2'>Date</th>
                    <th className='border border-black p-2'>Transaction ID</th>
                    <th className='border border-black p-2'>Status</th>

                    </tr>
                </thead>

                <tbody>
                    <tr className='text-center'>
                        <td className='border border-black p-2'>4th December, 2025</td>
                        <td  className='border border-black p-2 w-[60%]'>ka9990809adfakdjfaskdfajksd88</td>
                        <td className='border border-black p-2'> 
                            <div className='flex justify-center gap-3'>
                             <Download/> <Status status='pending'/>

                            </div>
                         </td>
                    </tr>
                    <tr className='text-center'>
                        <td className='border border-black p-2'>4th December, 2025</td>
                        <td  className='border border-black p-2 w-[60%]'>ka9990809adfakdjfaskdfajksd88</td>
                        <td className='border border-black p-2'> <Status status='pending'/> </td>
                    </tr>
                    <tr className='text-center'>
                        <td className='border border-black p-2'>4th December, 2025</td>
                        <td  className='border border-black p-2 w-[60%]'>ka9990809adfakdjfaskdfajksd88</td>
                        <td className='border border-black p-2'> <Status status='pending'/> </td>
                    </tr>
                    <tr className='text-center'>
                        <td className='border border-black p-2'>4th December, 2025</td>
                        <td  className='border border-black p-2 w-[60%]'>ka9990809adfakdjfaskdfajksd88</td>
                        <td className='border border-black p-2'> <Status status='pending'/> </td>
                    </tr>
                     <tr className='text-center'>
                        <td className='border border-black p-2'>4th December, 2025</td>
                        <td  className='border border-black p-2 w-[60%]'>ka9990809adfakdjfaskdfajksd88</td>
                        <td className='border border-black p-2'> <Status status='pending'/> </td>
                    </tr>
                     <tr className='text-center'>
                        <td className='border border-black p-2'>4th December, 2025</td>
                        <td  className='border border-black p-2 w-[60%]'>ka9990809adfakdjfaskdfajksd88</td>
                        <td className='border border-black p-2'> <Status status='pending'/> </td>
                    </tr>
                     <tr className='text-center'>
                        <td className='border border-black p-2'>4th December, 2025</td>
                        <td  className='border border-black p-2 w-[60%]'>ka9990809adfakdjfaskdfajksd88</td>
                        <td className='border border-black p-2'> <Status status='pending'/> </td>
                    </tr>
                     <tr className='text-center'>
                        <td className='border border-black p-2'>4th December, 2025</td>
                        <td  className='border border-black p-2 w-[60%]'>ka9990809adfakdjfaskdfajksd88</td>
                        <td className='border border-black p-2'> <Status status='pending'/> </td>
                    </tr>
                </tbody>
            </table>
            {/* <div className='flex-grow ring'> */}
                
                {/* <div className='flex overflow-hidden border border-b-1 border-b-black bg-gray-200'>
                    <p className='basis-[20%]  p-2.5 border-r-black'>Date</p>
                    <p className='flex-grow p-2.5  border-r-black'>Transaction ID</p>
                    <p className='basis-[20%] p-2.5 ring'>Status</p>
                </div>
             */}
                
             

                {/* <div className='flex ring rounded-lg overflow-hidden'>
                    <p className='basis-[20%] p-2.5 ring'>Date</p>
                    <p className='flex-grow  p-2.5 ring'>Transaction ID</p>
                    <p className='basis-[20%]  p-2.5 ring'>Status</p>
                </div> */}
            {/* </div> */}
       </main>
    </div>
  )
}
