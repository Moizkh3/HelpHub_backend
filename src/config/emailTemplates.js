
export const EMAIL_VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Verify Your Email</title>
    <style>
        body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f8fafc; }
        .container { max-width: 600px; margin: 40px auto; background-color: #1e293b; padding: 40px; border-radius: 12px; border: 1px solid #334155; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #818cf8; margin: 0; font-size: 28px; font-weight: 700; }
        .message { font-size: 16px; line-height: 1.6; color: #cbd5e1; margin-bottom: 30px; }
        .otp-container { background: linear-gradient(to right, #6366f1, #8b5cf6); padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0; }
        .otp-code { font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: 12px; margin-left: 12px; }
        .footer { font-size: 14px; color: #64748b; text-align: center; margin-top: 40px; border-top: 1px solid #334155; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Email Verification</h1>
        </div>
        <div class="message">
            <p>Hello,</p>
            <p>Thank you for signing up! To verify your email address, please use the following one-time password (OTP):</p>
        </div>
        <div class="otp-container">
            <span class="otp-code">{{otp}}</span>
        </div>
        <div class="message">
            <p>This code will expire in 24 hours. If you did not request this, please ignore this email.</p>
        </div>
        <div class="footer">
            &copy; 2025 Moiz Khatri. All rights reserved.
        </div>
    </div>
</body>
</html>
`;

export const PASSWORD_RESET_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Password Reset</title>
    <style>
        body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f8fafc; }
        .container { max-width: 600px; margin: 40px auto; background-color: #1e293b; padding: 40px; border-radius: 12px; border: 1px solid #334155; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #f87171; margin: 0; font-size: 28px; font-weight: 700; }
        .message { font-size: 16px; line-height: 1.6; color: #cbd5e1; margin-bottom: 30px; }
        .otp-container { background: linear-gradient(to right, #ef4444, #f87171); padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0; }
        .otp-code { font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: 12px; margin-left: 12px; }
        .footer { font-size: 14px; color: #64748b; text-align: center; margin-top: 40px; border-top: 1px solid #334155; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset</h1>
        </div>
        <div class="message">
            <p>Hello,</p>
            <p>We received a request to reset your password. Use the code below to complete the process:</p>
        </div>
        <div class="otp-container">
            <span class="otp-code">{{otp}}</span>
        </div>
        <div class="message">
            <p>This code will expire in 15 minutes. If you did not request a password reset, please ignore this email.</p>
        </div>
        <div class="footer">
            &copy; 2025 Moiz Khatri. All rights reserved.
        </div>
    </div>
</body>
</html>
`;

export const WELCOME_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Welcome to Our App</title>
    <style>
        body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f8fafc; }
        .container { max-width: 600px; margin: 40px auto; background-color: #1e293b; padding: 40px; border-radius: 12px; border: 1px solid #334155; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #818cf8; margin: 0; font-size: 28px; font-weight: 700; }
        .message { font-size: 16px; line-height: 1.6; color: #cbd5e1; margin-bottom: 30px; }
        .button-container { text-align: center; margin: 30px 0; }
        .button { background: linear-gradient(to right, #6366f1, #8b5cf6); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; }
        .footer { font-size: 14px; color: #64748b; text-align: center; margin-top: 40px; border-top: 1px solid #334155; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome To Moiz Khatri App</h1>
        </div>
        <div class="message">
            <p>Hello <strong>{{name}}</strong>,</p>
            <p>We're excited to have you on board! Your account has been successfully created with email: <strong>{{email}}</strong>.</p>
            <p>Start exploring our app by clicking the button below:</p>
        </div>
        <div class="button-container">
            <a href="${process.env.CLIENT_URL}" class="button">Get Started</a>
        </div>
        <div class="footer">
            &copy; 2025 Moiz Khatri. All rights reserved.
        </div>
    </div>
</body>
</html>
`;
