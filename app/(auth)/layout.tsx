import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  // If already logged in, redirect to dashboard
  if (userId) redirect('/')

  return (
    <main className="auth-layout">
      {/* Left: Form */}
      <section className="auth-left scrollbar-hide overflow-y-auto">
        {/* Logo */}
        <div className="mb-10">
          <span className="text-2xl font-bold text-yellow-400">📈 Signalist</span>
        </div>

        {/* Form content */}
        <div className="flex-1">{children}</div>

        {/* Footer */}
        <p className="text-xs text-gray-600 mt-8">
          © {new Date().getFullYear()} Signalist. Not financial advice.
        </p>
      </section>

      {/* Right: Marketing panel */}
      <section className="auth-right">
        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 40px, #374151 40px, #374151 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, #374151 40px, #374151 41px)',
            }}
          />
        </div>

        <div className="relative z-10">
          {/* Testimonial */}
          <blockquote className="text-gray-300 text-lg leading-relaxed italic border-l-4 border-yellow-400 pl-6">
            &ldquo;Signalist helped me track the market shifts that mattered. The
            AI summaries save me hours of research every week.&rdquo;
          </blockquote>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">Ethan R.</p>
              <p className="text-gray-500 text-sm">Retail Investor</p>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-yellow-400 text-lg">
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4 mt-auto">
          {[
            { label: 'Stocks Tracked', value: '10,000+' },
            { label: 'Daily Alerts', value: '50,000+' },
            { label: 'AI Insights', value: '1M+' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-800/60 rounded-xl p-4 border border-gray-700"
            >
              <p className="text-yellow-400 text-xl font-bold">{stat.value}</p>
              <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
