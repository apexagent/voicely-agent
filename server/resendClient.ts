// Resend connector for Voicely Agent demo confirmation emails
// Using Replit Resend integration pattern

import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return {
    apiKey: connectionSettings.settings.api_key, 
    fromEmail: connectionSettings.settings.from_email
  };
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
export async function getUncachableResendClient() {
  const creds = await getCredentials();
  return {
    client: new Resend(creds.apiKey),
    fromEmail: creds.fromEmail
  };
}

// Send demo confirmation email
export async function sendDemoConfirmationEmail(data: {
  industry: string;
  agentName: string;
  demoMode: 'business' | 'client';
  prospectName: string;
  prospectPhone: string;
  prospectEmail: string;
  conversationSummary?: string;
}) {
  const { client, fromEmail } = await getUncachableResendClient();
  
  const timestamp = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
  
  const demoTypeLabel = data.demoMode === 'business' ? 'Business Owner Demo' : 'Client Experience Demo';
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a1a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center; border-bottom: 1px solid rgba(139, 92, 246, 0.3);">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                🎙️ Voicely Agent
              </h1>
              <p style="margin: 10px 0 0 0; color: #a5b4fc; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">
                AI Voice Workforce Platform
              </p>
            </td>
          </tr>
          
          <!-- Demo Badge -->
          <tr>
            <td style="padding: 30px 40px 20px 40px; text-align: center;">
              <span style="display: inline-block; padding: 8px 20px; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); border-radius: 20px; color: white; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                ${demoTypeLabel}
              </span>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 20px 40px;">
              <h2 style="margin: 0 0 20px 0; color: #f1f5f9; font-size: 24px; font-weight: 600;">
                New Demo Lead from ${data.industry}
              </h2>
              <p style="margin: 0 0 30px 0; color: #94a3b8; font-size: 16px; line-height: 1.6;">
                A prospect just completed a voice demo with <strong style="color: #8b5cf6;">${data.agentName}</strong> and provided their contact information.
              </p>
            </td>
          </tr>
          
          <!-- Contact Info Card -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(139, 92, 246, 0.1); border-radius: 12px; border: 1px solid rgba(139, 92, 246, 0.2);">
                <tr>
                  <td style="padding: 25px;">
                    <h3 style="margin: 0 0 20px 0; color: #8b5cf6; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                      Contact Information
                    </h3>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; color: #94a3b8; font-size: 14px; width: 100px;">Name:</td>
                        <td style="padding: 8px 0; color: #f1f5f9; font-size: 16px; font-weight: 500;">${data.prospectName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">Phone:</td>
                        <td style="padding: 8px 0; color: #f1f5f9; font-size: 16px; font-weight: 500;">${data.prospectPhone}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">Email:</td>
                        <td style="padding: 8px 0; color: #06b6d4; font-size: 16px; font-weight: 500;">${data.prospectEmail}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Details Card -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(6, 182, 212, 0.1); border-radius: 12px; border: 1px solid rgba(6, 182, 212, 0.2);">
                <tr>
                  <td style="padding: 25px;">
                    <h3 style="margin: 0 0 20px 0; color: #06b6d4; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                      Demo Details
                    </h3>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; color: #94a3b8; font-size: 14px; width: 120px;">Industry:</td>
                        <td style="padding: 8px 0; color: #f1f5f9; font-size: 16px;">${data.industry}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">Agent:</td>
                        <td style="padding: 8px 0; color: #f1f5f9; font-size: 16px;">${data.agentName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">Demo Type:</td>
                        <td style="padding: 8px 0; color: #f1f5f9; font-size: 16px;">${demoTypeLabel}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">Timestamp:</td>
                        <td style="padding: 8px 0; color: #f1f5f9; font-size: 14px;">${timestamp}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          ${data.conversationSummary ? `
          <!-- Conversation Summary -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(34, 197, 94, 0.1); border-radius: 12px; border: 1px solid rgba(34, 197, 94, 0.2);">
                <tr>
                  <td style="padding: 25px;">
                    <h3 style="margin: 0 0 15px 0; color: #22c55e; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                      Conversation Notes
                    </h3>
                    <p style="margin: 0; color: #d1d5db; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${data.conversationSummary}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ''}
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; text-align: center; border-top: 1px solid rgba(139, 92, 246, 0.2);">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 12px;">
                This lead was captured via Voicely Agent's interactive voice demo
              </p>
              <p style="margin: 0; color: #8b5cf6; font-size: 12px; font-weight: 500;">
                voicelyagent.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  const result = await client.emails.send({
    from: fromEmail || 'Voicely Agent <noreply@resend.dev>',
    to: 'voicelyagent@gmail.com',
    subject: `🎙️ New ${data.industry} Demo Lead: ${data.prospectName}`,
    html: htmlContent,
    replyTo: data.prospectEmail
  });
  
  console.log(`[RESEND] Demo confirmation email sent for ${data.prospectName} (${data.industry})`);
  return result;
}
