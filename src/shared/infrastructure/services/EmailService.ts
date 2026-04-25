import { Resend } from 'resend';

type SupportedLocale = 'pt-BR' | 'es' | 'en';

interface EmailTemplate {
  subject: string;
  greeting: string;
  body: string;
  expiry: string;
  buttonLabel: string;
  fallbackText: string;
  ignoreText: string;
  footer: string;
}

const templates: Record<SupportedLocale, (name: string) => EmailTemplate> = {
  'pt-BR': (name) => ({
    subject: 'Confirme seu e-mail - ProjectEVE',
    greeting: `Olá, ${name}! 👋`,
    body: 'Obrigado por se cadastrar no <strong>ProjectEVE</strong>. Para ativar sua conta, clique no botão abaixo para confirmar seu endereço de e-mail.',
    expiry: 'Este link expira em <strong>24 horas</strong>.',
    buttonLabel: 'Confirmar E-mail',
    fallbackText: 'Ou copie e cole este link no navegador:',
    ignoreText: 'Se você não criou uma conta no ProjectEVE, ignore este e-mail.',
    footer: `© ${new Date().getFullYear()} ProjectEVE. Todos os direitos reservados.`,
  }),
  'es': (name) => ({
    subject: 'Confirma tu correo electrónico - ProjectEVE',
    greeting: `¡Hola, ${name}! 👋`,
    body: 'Gracias por registrarte en <strong>ProjectEVE</strong>. Para activar tu cuenta, haz clic en el botón de abajo para confirmar tu dirección de correo electrónico.',
    expiry: 'Este enlace expira en <strong>24 horas</strong>.',
    buttonLabel: 'Confirmar Correo',
    fallbackText: 'O copia y pega este enlace en tu navegador:',
    ignoreText: 'Si no creaste una cuenta en ProjectEVE, ignora este correo.',
    footer: `© ${new Date().getFullYear()} ProjectEVE. Todos los derechos reservados.`,
  }),
  'en': (name) => ({
    subject: 'Confirm your email - ProjectEVE',
    greeting: `Hello, ${name}! 👋`,
    body: 'Thank you for signing up for <strong>ProjectEVE</strong>. To activate your account, click the button below to confirm your email address.',
    expiry: 'This link expires in <strong>24 hours</strong>.',
    buttonLabel: 'Confirm Email',
    fallbackText: 'Or copy and paste this link into your browser:',
    ignoreText: 'If you did not create a ProjectEVE account, you can safely ignore this email.',
    footer: `© ${new Date().getFullYear()} ProjectEVE. All rights reserved.`,
  }),
};

function resolveLocale(locale?: string): SupportedLocale {
  if (locale === 'pt-BR' || locale === 'es' || locale === 'en') return locale;
  return 'pt-BR';
}

const verifyEmailPaths: Record<SupportedLocale, string> = {
  'pt-BR': 'verificar-email',
  'en': 'en/verify-email',
  'es': 'es/verificar-email',
};

const resetPasswordPaths: Record<SupportedLocale, string> = {
  'pt-BR': 'redefinir-senha',
  'en': 'en/reset-password',
  'es': 'es/restablecer-contrasena',
};

interface ResetPasswordEmailTemplate {
  subject: string;
  greeting: string;
  body: string;
  expiry: string;
  buttonLabel: string;
  fallbackText: string;
  ignoreText: string;
  footer: string;
}

const resetPasswordTemplates: Record<SupportedLocale, (name: string) => ResetPasswordEmailTemplate> = {
  'pt-BR': (name) => ({
    subject: 'Redefinição de senha - ProjectEVE',
    greeting: `Olá, ${name}! 👋`,
    body: 'Recebemos uma solicitação para redefinir a senha da sua conta no <strong>ProjectEVE</strong>. Clique no botão abaixo para criar uma nova senha.',
    expiry: 'Este link expira em <strong>1 hora</strong>.',
    buttonLabel: 'Redefinir Senha',
    fallbackText: 'Ou copie e cole este link no navegador:',
    ignoreText: 'Se você não solicitou a redefinição de senha, ignore este e-mail. Sua senha permanecerá a mesma.',
    footer: `© ${new Date().getFullYear()} ProjectEVE. Todos os direitos reservados.`,
  }),
  'es': (name) => ({
    subject: 'Restablecimiento de contraseña - ProjectEVE',
    greeting: `¡Hola, ${name}! 👋`,
    body: 'Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>ProjectEVE</strong>. Haz clic en el botón de abajo para crear una nueva contraseña.',
    expiry: 'Este enlace expira en <strong>1 hora</strong>.',
    buttonLabel: 'Restablecer Contraseña',
    fallbackText: 'O copia y pega este enlace en tu navegador:',
    ignoreText: 'Si no solicitaste restablecer tu contraseña, ignora este correo. Tu contraseña seguirá siendo la misma.',
    footer: `© ${new Date().getFullYear()} ProjectEVE. Todos los derechos reservados.`,
  }),
  'en': (name) => ({
    subject: 'Password reset - ProjectEVE',
    greeting: `Hello, ${name}! 👋`,
    body: 'We received a request to reset the password for your <strong>ProjectEVE</strong> account. Click the button below to create a new password.',
    expiry: 'This link expires in <strong>1 hour</strong>.',
    buttonLabel: 'Reset Password',
    fallbackText: 'Or copy and paste this link into your browser:',
    ignoreText: 'If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.',
    footer: `© ${new Date().getFullYear()} ProjectEVE. All rights reserved.`,
  }),
};

function buildHtml(verificationUrl: string, tpl: EmailTemplate, lang: string): string {
  return `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>${tpl.subject}</title>
    </head>
    <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
              <tr>
                <td style="background:#1976d2;padding:32px 40px;text-align:center;">
                  <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:1px;">ProjectEVE</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:40px;">
                  <h2 style="margin:0 0 16px;color:#1a1a2e;font-size:20px;">${tpl.greeting}</h2>
                  <p style="margin:0 0 16px;color:#555;font-size:15px;line-height:1.6;">
                    ${tpl.body}
                  </p>
                  <p style="margin:0 0 32px;color:#555;font-size:15px;line-height:1.6;">
                    ${tpl.expiry}
                  </p>
                  <table cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center">
                        <a href="${verificationUrl}"
                           style="display:inline-block;background:#1976d2;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:16px;font-weight:600;letter-spacing:0.5px;">
                          ${tpl.buttonLabel}
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin:32px 0 0;color:#999;font-size:13px;line-height:1.6;">
                    ${tpl.ignoreText}<br/>
                    ${tpl.fallbackText}<br/>
                    <a href="${verificationUrl}" style="color:#1976d2;word-break:break-all;">${verificationUrl}</a>
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background:#f4f6f8;padding:20px 40px;text-align:center;border-top:1px solid #e0e0e0;">
                  <p style="margin:0;color:#aaa;font-size:12px;">${tpl.footer}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.PROJECT_EVE_RESEND_API_KEY);
  }

  async sendVerificationEmail(
    to: string,
    name: string,
    token: string,
    locale?: string
  ): Promise<void> {
    const frontendUrl = process.env.PROJECT_EVE_FRONTEND_URL ?? 'https://projecteve-web.onrender.com';
    const resolvedLocale = resolveLocale(locale);
    const verificationUrl = `${frontendUrl}/${verifyEmailPaths[resolvedLocale]}?token=${token}`;
    const from = process.env.PROJECT_EVE_RESEND_FROM ?? 'ProjectEVE <no-reply@projecteve.app>';
    const tpl = templates[resolvedLocale](name);

    console.log(`[EmailService]: Sending verification email to ${to} (locale: ${resolvedLocale})`);
    console.log(`[EmailService]: Verification URL: ${verificationUrl}`);

    try {
      const { data, error } = await this.resend.emails.send({
        from,
        to,
        subject: tpl.subject,
        html: buildHtml(verificationUrl, tpl, resolvedLocale),
      });

      if (error) {
        console.error(`[EmailService]: Failed to send email to ${to}:`, error);
        throw new Error(error.message);
      }

      console.log(`[EmailService]: Email sent successfully - id: ${data?.id}`);
    } catch (err) {
      console.error(`[EmailService]: Failed to send email to ${to}:`, err);
      throw err;
    }
  }

  async sendPasswordResetEmail(
    to: string,
    name: string,
    token: string,
    locale?: string
  ): Promise<void> {
    const frontendUrl = process.env.PROJECT_EVE_FRONTEND_URL ?? 'https://projecteve-web.onrender.com';
    const resolvedLocale = resolveLocale(locale);
    const resetUrl = `${frontendUrl}/${resetPasswordPaths[resolvedLocale]}?token=${token}`;
    const from = process.env.PROJECT_EVE_RESEND_FROM ?? 'ProjectEVE <no-reply@projecteve.app>';
    const tpl = resetPasswordTemplates[resolvedLocale](name);

    console.log(`[EmailService]: Sending password reset email to ${to} (locale: ${resolvedLocale})`);
    console.log(`[EmailService]: Reset URL: ${resetUrl}`);

    try {
      const { data, error } = await this.resend.emails.send({
        from,
        to,
        subject: tpl.subject,
        html: buildHtml(resetUrl, tpl, resolvedLocale),
      });

      if (error) {
        console.error(`[EmailService]: Failed to send password reset email to ${to}:`, error);
        throw new Error(error.message);
      }

      console.log(`[EmailService]: Password reset email sent successfully - id: ${data?.id}`);
    } catch (err) {
      console.error(`[EmailService]: Failed to send password reset email to ${to}:`, err);
      throw err;
    }
  }
}

export const emailService = new EmailService();
