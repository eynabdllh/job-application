import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, html }) {
  try {
    const gmailUser = process.env.GMAIL_USER;
    const gmailPassword = process.env.GMAIL_APP_PASSWORD;
    
    if (!gmailUser || !gmailPassword) {
      console.warn('Gmail credentials not set; skipping email send');
      return { skipped: true };
    }

    console.log('Attempting to send email:', { to, subject });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPassword 
      }
    });

    // Send email
    const result = await transporter.sendMail({
      from: `"Lifewood Data Technology" <${gmailUser}>`,
      to,
      subject,
      html
    });

    console.log('Email sent successfully:', result.messageId);
    return { success: true, result };
  } catch (error) {
    console.error('Email send failed:', error);
    return { error };
  }
}

const BRAND_DARK = '#133020';
const BRAND_GREEN = '#046241';
const BRAND_GOLD = '#FFC370';

function getLogoUrl() {
  const base = process.env.NEXT_PUBLIC_APP_URL || '';
  return base ? `${base}/lifewood_logo2.png` : 'https://lwfiles.mycourse.app/683d544cf9e3cad852e77ba5-public/f3f91dbfb939c65479b7f97ba33af7a7.png';
}

function wrapEmail({ title, contentHtml }) {
  const logoUrl = getLogoUrl();
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:0;">
    <tr>
      <td align="center">
        <table role="presentation" width="760" cellpadding="0" cellspacing="0" style="width:760px;max-width:100%;background:#ffffff;">
          <tr>
            <td style="background:#ffffff;padding:18px 22px;border-bottom:1px solid #e5e7eb;text-align:left;">
              <img src="${logoUrl}" alt="Lifewood" height="42" style="display:block;max-width:220px;height:42px;object-fit:contain" />
            </td>
          </tr>
          <tr>
            <td style="padding:24px 24px 10px 24px;font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;color:${BRAND_DARK};">
              <h1 style="margin:0 0 10px 0;font-size:24px;line-height:1.35;color:${BRAND_DARK};">${title}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:2px 24px 24px 24px;font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;color:${BRAND_DARK};">
              ${contentHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 16px 24px;border-top:1px solid #e5e7eb;text-align:center;color:#6b7280;font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;">
              © ${new Date().getFullYear()} Lifewood Data Technology
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

export function renderReceivedEmail({ firstName, project }) {
  const name = firstName ? ` ${firstName}` : '';
  const body = `
    <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:${BRAND_DARK};">Hello${name},</p>
    <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;">Thank you for applying to <strong>Lifewood</strong>${project ? ` for the <strong>${escapeHtml(project)}</strong> project` : ''}. Your application was submitted successfully and is now awaiting review by our recruitment team.</p>
    <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;">Here’s what happens next:</p>
    <ol style="margin:8px 0 14px 20px;padding:0;font-size:14px;line-height:1.6;color:${BRAND_DARK};">
      <li><strong>Initial screening</strong> — we verify your details and match them against the role requirements.</li>
      <li><strong>Shortlisting</strong> — if your profile aligns, we’ll invite you to the next step (assessment or interview).</li>
      <li><strong>Decision</strong> — we’ll notify you by email either way. This typically takes 3–7 business days.</li>
    </ol>
    <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;">If we need more information, we’ll reach out using this email address. You can reply to this message at any time to share updates (e.g., corrected details or an updated resume).</p>
    <p style="margin:12px 0 0 0;font-size:14px;line-height:1.6;color:${BRAND_GREEN};"><strong>We appreciate your interest and the time you invested in applying.</strong></p>
    <p style="margin:8px 0 0 0;font-size:14px;line-height:1.6;color:${BRAND_GREEN};">Best regards,<br/><strong>Lifewood Recruitment</strong></p>
  `;
  return wrapEmail({
    title: 'We received your application',
    contentHtml: body,
  });
}

export function renderDecisionEmail({ firstName, status, project }) {
  const name = firstName ? ` ${firstName}` : '';
  const approved = status === 'approved';
  const title = approved ? 'Your application was approved' : 'Update on your application';
  const body = approved
    ? `
      <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:${BRAND_DARK};">Hello${name},</p>
      <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;">Great news! Your application${project ? ` for <strong>${escapeHtml(project)}</strong>` : ''} has been <strong>approved</strong>.</p>
      <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;">Our coordinator will reach out shortly with scheduling options and any documents we need from you (e.g., ID verification or portfolio). Please watch your inbox (and spam) over the next 1–3 business days.</p>
      <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;">If anything changes on your side, feel free to reply to this email so we can accommodate your availability.</p>
      <p style="margin:12px 0 0 0;font-size:14px;line-height:1.6;color:${BRAND_GREEN};">Best regards,<br/><strong>Lifewood Recruitment</strong></p>
    `
    : `
      <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:${BRAND_DARK};">Hello${name},</p>
      <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;">Thank you for your interest in Lifewood${project ? ` and the <strong>${escapeHtml(project)}</strong> project` : ''}. After a thorough review, we will not be moving forward at this time.</p>
      <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;">This decision doesn't reflect on your potential. Roles open frequently, and your experience may be a strong match for future opportunities. We encourage you to apply again when a suitable role appears.</p>
      <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;">If you'd like basic feedback on your application, you can reply to this email and our team will do our best to share helpful pointers.</p>
      <p style="margin:12px 0 0 0;font-size:14px;line-height:1.6;color:${BRAND_GREEN};">Best regards,<br/><strong>Lifewood Recruitment</strong></p>
    `;
  return wrapEmail({ title, contentHtml: body });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}