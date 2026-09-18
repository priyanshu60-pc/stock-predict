'use client'

import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-gray-900 group-[.toaster]:text-white group-[.toaster]:border-gray-800 group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-gray-400',
          actionButton:
            'group-[.toast]:bg-yellow-400 group-[.toast]:text-yellow-900',
          cancelButton:
            'group-[.toast]:bg-gray-800 group-[.toast]:text-gray-400',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
