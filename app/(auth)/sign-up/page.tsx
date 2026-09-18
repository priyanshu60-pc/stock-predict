import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Create your account</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Start tracking markets and get AI-powered insights
        </p>
      </div>
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: 'yellow-btn',
            card: 'bg-transparent shadow-none p-0',
            headerTitle: 'hidden',
            headerSubtitle: 'hidden',
            socialButtonsBlockButton:
              'bg-gray-800 border-gray-700 text-white hover:bg-gray-700',
            formFieldInput:
              'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-yellow-400',
            formFieldLabel: 'text-gray-300',
            footerActionLink: 'text-yellow-400 hover:text-yellow-300',
            dividerLine: 'bg-gray-700',
            dividerText: 'text-gray-500',
          },
        }}
      />
    </div>
  )
}
