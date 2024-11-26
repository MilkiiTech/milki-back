const nodemailer = require('nodemailer');
const config = require('../config/config');

// Create email transporter
const createTransporter = () => {
    // For production
    if (config.get('env') === 'production') {
        return nodemailer.createTransport({
            service: config.get('email.service'), // e.g., 'Gmail', 'SendGrid'
            auth: {
                user: config.get('email.user'),
                pass: config.get('email.password')
            }
        });
    }
    
    // For development/testing (using Mailtrap)
    return nodemailer.createTransport({
        host: config.get('email.host'),
        port: config.get('email.port'),
        auth: {
            user: config.get('email.user'),
            pass: config.get('email.password')
        }
    });
};

/**
 * Send email using nodemailer
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Email message (text)
 * @param {string} [options.html] - Email message (HTML)
 * @returns {Promise}
 */
exports.sendEmail = async (options) => {
    try {
        const transporter = createTransporter();

        // Define email options
        const mailOptions = {
            from: `${config.get('email.fromName')} <${config.get('email.fromAddress')}>`,
            to: options.email,
            subject: options.subject,
            text: options.message
        };

        // Add HTML if provided
        if (options.html) {
            mailOptions.html = options.html;
        }

        // Send email
        const info = await transporter.sendMail(mailOptions);
        
        if (config.get('env') === 'development') {
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }

        return info;
    } catch (error) {
        console.error('Email sending failed:', error);
        throw new Error('Failed to send email');
    }
};

/**
 * Send password reset email
 * @param {string} email - User's email
 * @param {string} resetUrl - Password reset URL
 * @returns {Promise}
 */
exports.sendPasswordResetEmail = async (email, resetUrl) => {
    const subject = 'Password Reset Request';
    const message = `
        You requested a password reset. Please click the link below to reset your password:
        
        ${resetUrl}
        
        If you didn't request this, please ignore this email.
        
        This link will expire in 30 minutes.
    `;

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Password Reset Request</h2>
            <p>You requested a password reset. Please click the link below to reset your password:</p>
            <p>
                <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
                    Reset Password
                </a>
            </p>
            <p>If you didn't request this, please ignore this email.</p>
            <p><strong>This link will expire in 30 minutes.</strong></p>
            <hr>
            <p style="color: #666; font-size: 12px;">
                If the button above doesn't work, copy and paste this URL into your browser:
                <br>
                ${resetUrl}
            </p>
        </div>
    `;

    return exports.sendEmail({
        email,
        subject,
        message,
        html
    });
};

/**
 * Send welcome email to new user
 * @param {string} email - User's email
 * @param {string} username - User's username
 * @returns {Promise}
 */
exports.sendWelcomeEmail = async (email, username) => {
    const subject = 'Welcome to Our Platform';
    const message = `
        Welcome ${username}!
        
        We're excited to have you on board. If you need any help getting started, 
        please don't hesitate to reach out to our support team.
        
        Best regards,
        Your Team
    `;

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to Our Platform!</h2>
            <p>Hello ${username},</p>
            <p>We're excited to have you on board. If you need any help getting started, 
               please don't hesitate to reach out to our support team.</p>
            <p>Best regards,<br>Your Team</p>
        </div>
    `;

    return exports.sendEmail({
        email,
        subject,
        message,
        html
    });
}; 