"use client";

import { examApi } from '@/api/exam-cards/examsApi';
import HeaderAdmin from '@/components/HeaderAdmin';
import FullScreenLoader from '@/components/LoadingModal';
import { Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react'

export default function AdminHome() {
  const [loading, setLoading] = useState<boolean>(false);
  
  const getAccountInfo = async () => {
    try{
      setLoading(true);
      const accountInfo = await examApi.accountDetails();
      console.log(accountInfo);
      setLoading(false);
    }catch{
      setLoading(false);
    }
  }

  useEffect(() => {
    getAccountInfo();
    
    
  }, [])
  return (
    <div>
        {loading && <FullScreenLoader/>}
        <HeaderAdmin title="Dashboard"/>
        {/* <h1>Hello</h1> */}
        <div>
          <div className='shadow-lg rounded-lg p-10 ring bg-green-900 text-white px-7 max-w-fit'>
          <div className='flex items-center gap-5'>
            <div>
              <h1 className='text-lg'>Total Balance</h1>
              <h1 className='font-bold '>N4,000</h1>

            </div>
            <Wallet/>

          </div>
          </div>
          <div className='my-4 ring-green-900 rounded p-2 bg-green-100'>
            <h2 className='font-bold'>To fund Wallet</h2>
            <p>Account Name: Musa Ibrahim </p>
            <p>Account Number: 9894878585995</p>
          </div>
        </div>
    </div>
  )
}
AdminHome.title = "Dashboard";