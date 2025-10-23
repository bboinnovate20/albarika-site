"use client";

import { examApi } from '@/api/exam-cards/examsApi';
import { ExamCardsData, ScratchCard } from '@/api/exam-cards/type';
import PrimaryBtn from '@/components/custom-ui/primary-btn'
import Status from '@/components/custom-ui/status'
import CustomDialogueWithChild from '@/components/CustomDialogueWithChild';
import CustomDialogue from '@/components/Dialogue';
import { generateWAECCardsPDF } from '@/components/GenerateWAEC';
import HeaderAdmin from '@/components/HeaderAdmin';
import { handleGeneratePdf } from '@/components/HTMLToPDF'
import FullScreenLoader from '@/components/LoadingModal';
import LoadingModal from '@/components/LoadingModal';
import { Button } from '@/components/ui/button'
import WAECCard from '@/components/WAECCard'
import {generateMultipleWAECCardsHTML, generateWAECCardHTML } from '@/lib/convert-waec-html'
import convertToLongDate from '@/lib/date';
import { getExamType } from '@/lib/determine-exam-type';
import { Download, Send } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

export default function WAECVerification() {
   
   const [loading, setLoading] = useState<boolean>(false);
   const [globalLoading, setGlobalLoading] = useState<boolean>(false);
   const [allCards, setAllCards] = useState<ExamCardsData[]>([]);

   const handleDownload = () => {
    setLoading(true);
    const html = generateWAECCardsPDF([
        {serialNumber: "WRN1234567890455", pin: "555123456789456"},
        {serialNumber: "WRN1234567890455", pin: "555123456789456"}
    ])
    setLoading(false);
    toast.success("Sucessfully generated");
  }


   const handleDownloadSingle = (card: ScratchCard) => {
    console.log(card, "card");
    try {
        setGlobalLoading(true);
        // const {serialNumber, pin} = card;
        const html = generateWAECCardsPDF([card])

        setGlobalLoading(false);
        toast.success("Sucessfully generated");
        
    } catch (error) {
        
    }
  }

  const purchaseACard = async () => {
    setLoading(true)
    const info = await examApi.purchasedWAECCard();
    toast.success("Successfully purchased WAEC");

    const cards = info?.data?.cards[0];
    setLoading(false)
    console.log("Success");
    handleDownloadSingle({
        serialNumber: cards.serial_no,
        pin:cards.pin
    });
  }

  const getAllCard = async () =>{
    const info = await examApi.purchasedWAECExamList();
    const data: any[] = info?.data;
    console.log(data);

    setAllCards(data);
  }

  useEffect(() => {
    getAllCard();
  }, [])

  return (
    <div>
      {globalLoading &&  <FullScreenLoader/>}
       <main className='flex flex-col'>
        <div>
            <HeaderAdmin title='EXAM Cards'/>
            <WAECCard/>
            
            <CustomDialogueWithChild
            message='Are you sure you want to Purchase WAEC Card?'
            onConfirm={() => {
                purchaseACard();
            }}
            >
                <PrimaryBtn 
                isLoading={loading}
                // onClick={handleDownload}
                prefixIcon={<Send/>}>Purchase WAEC Card</PrimaryBtn>
            </CustomDialogueWithChild>
            
        </div>
        {/* <CustomDialogue message='Are you sure you want to purchase WAEC Card?' /> */}
            
            <h1 className='text-2xl font-bold mt-6 mb-3'>Transactions</h1>

            <table className=''>
                <thead className='border border-black bg-gray-200'>
                    <tr>
                        <th className='border border-black p-2'>Date</th>
                        <th className='border border-black p-2'>Transaction ID</th>
                        <th className='border border-black p-2'>Exam Type</th>
                        <th className='border border-black p-2'>Status</th>
                    </tr>
                </thead>


                <tbody>
                    {allCards.map((card) => 
                        <tr className='text-center' key={card.pin}>
                            
                            <td className='border border-black p-2'>{convertToLongDate(card.created_at)}</td>
                            <td  className='border border-black p-2 '>{card.reference}</td>
                            <td  className='border border-black p-2 '>{getExamType(card.exam_card_id)}</td>
                            <td className='border border-black p-2'> 
                                <div className='flex justify-center gap-3'>
                                <Download onClick={() => handleDownloadSingle({ serialNumber: card.serial_number, pin: card.pin})}/> 
                                <Status status='active'/>
                                </div>
                            </td>
                        </tr>
                    )}
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
