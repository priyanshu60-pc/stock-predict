import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendWelcomeEmail } from '@/lib/resend'
import { generateWelcomeEmail } from '@/lib/gemini'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'No webhook secret' }, { status: 500 })
  }

  const headerPayload = await headers()
  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  const body = await req.text()

  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: {
    type: string
    data: {
      id: string
      email_addresses: { email_address: string }[]
      first_name?: string
      last_name?: string
    }
  }

  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as typeof evt
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (evt.type === 'user.created') {
    const { email_addresses, first_name, last_name } = evt.data
    const email = email_addresses[0]?.email_address
    const name = [first_name, last_name].filter(Boolean).join(' ') || 'there'

    if (email) {
      try {
        await supabase.from('user_emails').upsert({
          user_id: evt.data.id,
          email,
          name,
        })

        const intro = await generateWelcomeEmail(name)
        await sendWelcomeEmail({ to: email, name, intro })

        console.log(`Welcome email sent to ${email}`)
      } catch (err) {
        console.error('Failed to send welcome email:', err)
      }
    }
  }

  return NextResponse.json({ received: true })
}
