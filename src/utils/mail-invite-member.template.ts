const sendMailInviteTemplate = (email: string, workspaceName: string, inviterName: string, invitationLink: string) => {
  return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invitation to Join ${workspaceName}</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f0f2f5;
                    margin: 0;
                    padding: 20px;
                    color: #333;
                }
                .email-wrapper {
                    max-width: 650px;
                    margin: 0 auto;
                    border: 1px solid #dddfe2;
                    border-radius: 15px;
                    overflow: hidden;
                    background-color: #f8f9fa;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
                }
                .email-header {
                    background: #3f51b5; /* A more professional blue */
                    padding: 15px;
                    text-align: center;
                }
                .email-header img {
                    max-height: 50px;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    padding: 30px;
                    border-radius: 12px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
                    text-align: center;
                }
                .logo {
                    margin-bottom: 20px;
                }
                .header {
                    font-size: 28px;
                    font-weight: bold;
                    color: #1c1e21;
                    margin-bottom: 20px;
                    border-bottom: 2px solid #f0f2f5;
                    padding-bottom: 15px;
                }
                .content {
                    font-size: 16px;
                    line-height: 1.6;
                    color: #4b4f56;
                    margin-bottom: 25px;
                    text-align: left;
                    padding: 0 10px;
                }
                .invitation-info {
                    background-color: #e3f2fd; /* Light blue background */
                    border-left: 4px solid #2196f3; /* Blue accent */
                    padding: 15px;
                    margin: 20px 0;
                    text-align: left;
                    border-radius: 5px;
                    color: #1976d2; /* Darker blue text */
                }
                .invite-btn {
                    display: inline-block;
                    padding: 14px 30px;
                    font-size: 16px;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: bold;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    background-color: #4caf50; /* Green invite button */
                    color: #ffffff;
                }
                .invite-btn:hover {
                    background: #43a047; /* Darker green on hover */
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }
                .footer {
                    font-size: 14px;
                    color: #8d949e;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #dddfe2;
                }
                .footer a {
                    color: #3f51b5;
                    text-decoration: none;
                    font-weight: bold;
                }
                .footer a:hover {
                    text-decoration: underline;
                }
                .social-links {
                    margin-top: 20px;
                }
                .social-links a {
                    display: inline-block;
                    margin: 0 8px;
                    color: #3f51b5;
                    background-color: #e8eaf6;
                    padding: 8px 15px;
                    border-radius: 6px;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    border: 1px solid #c5cae9;
                }
                .social-links a:hover {
                    background-color: #d1d8e6;
                    color: #3f51b5;
                    text-decoration: none;
                }
                .email-footer {
                    background-color: #f5f6f7;
                    color: #8d949e;
                    text-align: center;
                    padding: 15px;
                    font-size: 12px;
                    border-top: 1px solid #dddfe2;
                }
            </style>
        </head>
        <body>
            <div class="email-wrapper">
                <div class="email-header">
                    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="50" height="50" rx="10" fill="#ffffff"/>
                        <path d="M12 28L21 37L38 20" stroke="#3f51b5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="container">
                    <div class="logo">
                        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="50" height="50" rx="10" fill="#3f51b5"/>
                            <path d="M12 28L21 37L38 20" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="header">Join ${workspaceName}</div>
                    <div class="content">
                        Hello <b>${email}</b>,<br><br>
                        You have been invited by <b>${inviterName}</b> to join the <b>${workspaceName}</b> workspace!
                        Click the button below to accept the invitation and start collaborating with your team.
                    </div>
                    <div class="invitation-info">
                        You're one step closer to being part of <b>${workspaceName}</b>. Accept this invitation to unlock all the channels and features.
                    </div>
                    <a class="invite-btn" href="${invitationLink}">Accept Invitation</a>
                    <div class="footer">
                        If you were not expecting this invitation, you can safely ignore this email. No action is required.<br><br>
                        Need help? <a href="mailto:khanhdang3152@gmail.com">Contact our support team</a>.<br>
                        <div class="social-links">
                            <a href="https://www.facebook.com/WhiteDXK" title="Facebook">Facebook</a>
                            <a href="https://www.facebook.com/WhiteDXK" title="Twitter">Twitter</a>
                            <a href="https://www.facebook.com/WhiteDXK" title="Instagram">Instagram</a>
                        </div>
                    </div>
                </div>
                <div class="email-footer">
                    © 2025 Your Company. All rights reserved.
                </div>
            </div>
        </body>
        </html>
    `
}

export default sendMailInviteTemplate
