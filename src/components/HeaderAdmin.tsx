import React from 'react'

export default function HeaderAdmin({title}: {title: string}) {
  return (
    <div className='mt-5 mb-5'>
        <h1 className='font-bold text-3xl mb-1.5'>{title}</h1>
        <hr />
    </div>
  )
}
