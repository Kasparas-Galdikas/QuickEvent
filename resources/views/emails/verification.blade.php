<!DOCTYPE html>
<html>
<head>
    <title>Email Verification</title>
    <style>
        /* General Styling */
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            color: #333;
            margin: 0;
            padding: 0;
        }

        /* Email Container */
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #eaeaea;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        }

        /* Header */
        .header {
            background-color: #0044cc;
            color: #ffffff;
            text-align: center;
            padding: 20px;
            font-size: 22px;
            font-weight: bold;
        }

        /* Content */
        .content {
            padding: 20px;
            font-size: 16px;
            line-height: 1.6;
            color: #333333;
        }

        /* Verification Code */
        .verification-code {
            display: block;
            background-color: #f1f5ff;
            border: 1px solid #0044cc;
            color: #0044cc;
            padding: 12px 20px;
            margin: 20px 0;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            border-radius: 5px;
        }

        /* Footer */
        .footer {
            background-color: #f8f8f8;
            text-align: center;
            padding: 15px;
            font-size: 14px;
            color: #888888;
            border-top: 1px solid #eaeaea;
        }

        /* Links */
        a {
            color: #0044cc;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <!-- Email Container -->
    <div class="email-container">
      
        <!-- Header -->
        <div class="header">
            Verify Your Email
        </div>

        <!-- Content -->
        <div class="content">
            <p>Hello,</p>
            <p>
                Thank you for registering! Please use the code below to verify your email address:
            </p>
            <div class="verification-code">
                {{ $code }}
            </div>
            <p>
                If you did not request this email, you can safely ignore it. If you have any
                questions, please <a href="mailto:support@yourwebsite.com">contact us</a>.
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            Thank you for using our application!
           
        </div>
    </div>
</body>
</html>
