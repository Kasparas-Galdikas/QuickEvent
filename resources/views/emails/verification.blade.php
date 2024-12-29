<!DOCTYPE html>
<html>
<head>
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            color: #333;
            padding: 20px;
        }
        .header {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .content {
            font-size: 16px;
            line-height: 1.5;
        }
        .verification-code {
            display: inline-block;
            background-color: #f0f0f0;
            padding: 10px 20px;
            margin: 20px 0;
            font-size: 20px;
            font-weight: bold;
            border-radius: 5px;
        }
        .footer {
            font-size: 14px;
            color: #888;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="header">Email Verification</div>
    <div class="content">
        <p>Hello,</p>
        <p>Thank you for registering! Please use the code below to verify your email address:</p>
        <div class="verification-code">{{ $code }}</div>
        <p>If you did not request this email, you can safely ignore it.</p>
    </div>
    <div class="footer">
        <p>Thank you for using our application!</p>
    </div>
</body>
</html>
