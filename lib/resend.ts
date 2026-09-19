import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)
const FROM = process.env.RESEND_FROM_EMAIL || 'Signalist <alerts@yourdomain.com>'

/** Send a personalized welcome email to a new user */
export async function sendWelcomeEmail({
  to,
  name,
  intro,
}: {
  to: string
  name: string
  intro: string
}) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Welcome to Signalist, ${name}! 🎉`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;background:#0f172a;color:#e2e8f0;padding:40px;border-radius:16px;">
        <h1 style="color:#facc15;font-size:24px;margin-bottom:8px;">Welcome to Signalist 📈</h1>
        <p style="color:#94a3b8;font-size:14px;margin-bottom:24px;">Your real-time stock market toolkit is ready.</p>
        <div style="background:#1e293b;padding:24px;border-radius:12px;border-left:4px solid #facc15;">
          ${intro}
        </div>
        <div style="margin-top:32px;">
          <p style="color:#64748b;font-size:12px;">This is not financial advice. Always do your own research.</p>
        </div>
      </div>
    `,
  })
}

/** Send a stock price alert email */
export async function sendAlertEmail({
  to,
  symbol,
  condition,
  threshold,
  currentPrice,
  alertType,
}: {
  to: string
  symbol: string
  condition: string
  threshold: number
  currentPrice: number
  alertType: string
}) {
  const direction = condition === 'above' ? '⬆️' : '⬇️'
  const unit = alertType === 'price' ? '$' : ''
  return resend.emails.send({
    from: FROM,
    to,
    subject: `🚨 Alert Triggered: ${symbol} ${condition} ${unit}${threshold}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;background:#0f172a;color:#e2e8f0;padding:40px;border-radius:16px;">
        <h1 style="color:#facc15;font-size:20px;">Alert Triggered ${direction}</h1>
        <div style="background:#1e293b;padding:24px;border-radius:12px;margin-top:16px;">
          <p style="font-size:32px;font-weight:bold;color:#fff;margin:0;">${symbol}</p>
          <p style="color:#94a3b8;margin:8px 0 0;">Current ${alertType}: <strong style="color:#facc15;">${unit}${currentPrice.toLocaleString()}</strong></p>
          <p style="color:#94a3b8;margin:4px 0 0;">Your alert: ${condition} ${unit}${threshold.toLocaleString()}</p>
        </div>
        <p style="color:#64748b;font-size:12px;margin-top:24px;">Not financial advice. Manage your alerts in Signalist.</p>
      </div>
    `,
  })
}

/** Send a daily digest email */
export async function sendDailyDigest({
  to,
  name,
  digestHtml,
  stockLines,
}: {
  to: string
  name: string
  digestHtml: string
  stockLines: string[]
}) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `📊 Your Daily Market Digest — ${new Date().toLocaleDateString()}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;background:#0f172a;color:#e2e8f0;padding:40px;border-radius:16px;">
        <h1 style="color:#facc15;font-size:20px;">Good morning, ${name} 🌅</h1>
        <p style="color:#94a3b8;font-size:14px;margin-bottom:24px;">Here's your daily market snapshot.</p>
        <div style="background:#1e293b;padding:24px;border-radius:12px;border-left:4px solid #facc15;margin-bottom:24px;">
          ${digestHtml}
        </div>
        <div style="background:#1e293b;padding:20px;border-radius:12px;">
          <p style="color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">YOUR STOCKS TODAY</p>
          ${stockLines.map((line) => `<p style="color:#e2e8f0;font-size:14px;margin:6px 0;font-family:monospace;">${line}</p>`).join('')}
        </div>
        <p style="color:#64748b;font-size:12px;margin-top:24px;">Not financial advice.</p>
      </div>
    `,
  })
}
