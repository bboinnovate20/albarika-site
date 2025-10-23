'use client';

import { Info } from 'lucide-react';
import React, { useState } from 'react'
import PrimaryBtn from './custom-ui/primary-btn';

export default function CustomDialogueWithChild({children,
      message = "Are you sure you want to continue?",
  onConfirm,
  onCancel,

    
}: {children: React.ReactNode,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
}) {
  const [showDialogue, setShowDialogue] = useState<boolean>(false);


  return (
    
    <>
    <span className='block max-w-max' onClick={() => setShowDialogue(true)}>{children}</span>
    {showDialogue && <div className="fixed inset-0 flex items-center justify-center bg-black/60  z-[9999]">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-6 w-[90%] max-w-sm text-center animate-fade-in">
        <Info className="h-10  w-full mb-2.5 text-center"/>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          {message}
        </h1>

        <div className="flex justify-center gap-4">
            <PrimaryBtn className="bg-red-500 text-white" onClick={() =>{
                if(onCancel == null) {
                    setShowDialogue(false);
                    return;
                }
                onCancel();

            }}>Cancel</PrimaryBtn>
            <PrimaryBtn onClick={() => {
                setShowDialogue(false);
                onConfirm();
            }}>Confirm</PrimaryBtn>
          
        </div>
      </div>
    </div>}
    </>
    
  )
}
