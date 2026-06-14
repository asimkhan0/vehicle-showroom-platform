import { Resend } from 'resend'

let cached: Resend | null = null
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null
  if (!cached) cached = new Resend(process.env.RESEND_API_KEY)
  return cached
}

export type InquiryEmailInput = {
  to: string
  showroomName: string
  vehicleTitle: string
  vehicleUrl: string
  inquirer: { name: string; email: string; phone: string | null; message: string }
}

export async function sendInquiryEmail(input: InquiryEmailInput) {
  const resend = getResend()
  if (!resend) {
    // Email is best-effort — log and continue so the inquiry still gets stored.
    console.warn('[email] RESEND_API_KEY not set — skipping send')
    return { skipped: true as const }
  }

  const from = process.env.RESEND_FROM ?? 'Showroom <onboarding@resend.dev>'
  const replyTo = process.env.RESEND_REPLY_TO || input.inquirer.email

  const subject = `New inquiry: ${input.vehicleTitle}`
  const text = [
    `You received a new inquiry on ${input.showroomName}.`,
    '',
    `Vehicle: ${input.vehicleTitle}`,
    `Listing:  ${input.vehicleUrl}`,
    '',
    `From:  ${input.inquirer.name} <${input.inquirer.email}>`,
    input.inquirer.phone ? `Phone: ${input.inquirer.phone}` : null,
    '',
    'Message:',
    input.inquirer.message,
  ]
    .filter((v) => v !== null)
    .join('\n')

  const result = await resend.emails.send({
    from,
    to: input.to,
    replyTo,
    subject,
    text,
  })

  if (result.error) {
    console.error('[email] resend error:', result.error)
    return { skipped: false as const, error: result.error.message }
  }
  return { skipped: false as const, id: result.data?.id }
}
