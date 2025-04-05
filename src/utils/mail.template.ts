const sendMailTemplate = (email: string, verificationLink: string) => {
  return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
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
                    background: #1877f2;
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
                .countdown {
                    background-color: #fff8e1;
                    border-left: 4px solid #ffc107;
                    padding: 15px;
                    margin: 20px 0;
                    text-align: left;
                    border-radius: 5px;
                    font-weight: bold;
                    color: #b45309;
                }
                .verify-btn { 
                    display: inline-block; 
                    padding: 14px 30px; 
                    font-size: 16px; 
                    text-decoration: none; 
                    border-radius: 6px; 
                    font-weight: bold; 
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .verify-btn:hover { 
                    background:rgb(192, 211, 235);
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
                    color: #1877f2; 
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
                    color: #1877f2;
                    background-color: #f0f2f5;
                    padding: 8px 15px;
                    border-radius: 6px;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    border: 1px solid #dddfe2;
                }
                .social-links a:hover {
                    background-color: #e4e6eb;
                    color: #1877f2;
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
                        <path d="M15 25L22 32L35 18" stroke="#1877f2" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="container">
                    <div class="logo">
                        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="50" height="50" rx="10" fill="#1877f2"/>
                            <path d="M15 25L22 32L35 18" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="header">Verify Your Email</div>
                    <div class="content">
                        Hello <b>${email}</b>,<br><br>
                        Thank you for signing up! To complete your registration and access all features, please confirm your email address by clicking the button below.
                    </div>
                    <div class="countdown">
                        ⏱️ Important: This verification link will expire in 3 minutes. Please verify your email now to avoid having to request a new link.
                    </div>
                    <a class="verify-btn" href="${verificationLink}">Verify Email</a>
                    <div class="footer">
                        If you didn't request this, please ignore this email or contact us for assistance.<br><br>
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

export default sendMailTemplate
