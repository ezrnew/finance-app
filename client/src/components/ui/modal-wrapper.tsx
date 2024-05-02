import React from 'react'


export interface ModalWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const ModalWrapper = ({children,...props}:ModalWrapperProps) => {
  return (
    <div {...props} className='fixed inset-0 flex  backdrop-brightness-75 backdrop-blur-sm z-50'>{children}</div>
  )
}
