/**
 * Brevo (formerly Sendinblue) Transactional Email Service
 * Uses native fetch to call https://api.brevo.com/v3/smtp/email
 */

const formatINR = (price) => {
  const val = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(val) || val === null || val === undefined) return 'Rs. 0';
  return 'Rs. ' + new Intl.NumberFormat('en-IN').format(val);
};

const sendBrevoEmail = async ({ toEmail, toName, subject, htmlContent }) => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.log('[Brevo Email] BREVO_API_KEY not configured in .env. Skipping email to:', toEmail);
    return false;
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'support@phvault.in';
  const senderName = process.env.BREVO_SENDER_NAME || 'phVault India';

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: toEmail, name: toName || 'Valued Customer' }],
        subject,
        htmlContent,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('[Brevo Email Error]', data);
      return false;
    }

    console.log(`[Brevo Email Sent] To: ${toEmail} | MessageId: ${data.messageId}`);
    return true;
  } catch (err) {
    console.error('[Brevo Email Request Failed]', err.message);
    return false;
  }
};

/**
 * 1. Welcome Email on Registration
 */
const sendWelcomeEmail = async (user) => {
  const subject = `Welcome to phVault India, ${user.username}!`;
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b;">
      <div style="background: linear-gradient(135deg, #0284c7 0%, #4f46e5 100%); padding: 32px 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">phVault India</h1>
        <p style="margin: 8px 0 0; color: #e0f2fe; font-size: 14px;">Curated Automotive Inventory Vault</p>
      </div>
      <div style="padding: 32px 24px;">
        <h2 style="color: #38bdf8; margin-top: 0;">Welcome aboard, ${user.username}!</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">
          Your phVault account has been created successfully with <strong>${user.role === 'ROLE_ADMIN' ? 'Dealership Administrator' : 'Customer'}</strong> access.
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #94a3b8;">
          You can now browse our showroom catalog of Mahindra, Tata, Toyota, and luxury vehicles, reserve cars in INR, and track purchase requests in real-time.
        </p>
        <div style="margin: 28px 0; text-align: center;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" style="background: linear-gradient(to right, #0284c7, #4f46e5); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: bold; font-size: 14px; display: inline-block;">
            Visit Showroom Catalog
          </a>
        </div>
      </div>
      <div style="background: #090d16; padding: 16px 24px; text-align: center; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b;">
        &copy; 2026 phVault Automotive India. All rights reserved.
      </div>
    </div>
  `;

  return sendBrevoEmail({
    toEmail: user.email,
    toName: user.username,
    subject,
    htmlContent,
  });
};

/**
 * 2. Order Confirmation Email to Customer
 */
const sendOrderConfirmationEmail = async ({ order, user, vehicle }) => {
  const subject = `Order Placed: ${vehicle.make} ${vehicle.model} (#${order._id.toString().slice(-6)})`;
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b;">
      <div style="background: linear-gradient(135deg, #0284c7 0%, #4f46e5 100%); padding: 32px 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #ffffff;">Order Reservation Confirmed</h1>
        <p style="margin: 6px 0 0; color: #e0f2fe; font-size: 13px;">Order #${order._id.toString().slice(-6)}</p>
      </div>
      <div style="padding: 28px 24px;">
        <p style="font-size: 15px; color: #cbd5e1; margin-top: 0;">
          Hi <strong>${user.username}</strong>, thank you for choosing phVault! Your vehicle reservation request has been submitted to the dealership for review.
        </p>

        <div style="background: #1e293b; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #334155;">
          <h3 style="color: #38bdf8; margin: 0 0 14px 0; font-size: 16px;">Reservation Details</h3>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #94a3b8;">Vehicle:</td><td style="padding: 6px 0; color: #ffffff; font-weight: bold; text-align: right;">${vehicle.make} ${vehicle.model}</td></tr>
            <tr><td style="padding: 6px 0; color: #94a3b8;">Category / Year:</td><td style="padding: 6px 0; color: #ffffff; text-align: right;">${vehicle.category} (${vehicle.year || 2024})</td></tr>
            <tr><td style="padding: 6px 0; color: #94a3b8;">VIN:</td><td style="padding: 6px 0; color: #ffffff; font-family: monospace; text-align: right;">${vehicle.vin || 'N/A'}</td></tr>
            <tr><td style="padding: 6px 0; color: #94a3b8;">Quantity:</td><td style="padding: 6px 0; color: #ffffff; text-align: right;">${order.quantity} unit(s)</td></tr>
            ${order.deliveryCity ? `<tr><td style="padding: 6px 0; color: #94a3b8;">Delivery City:</td><td style="padding: 6px 0; color: #ffffff; text-align: right;">${order.deliveryCity}</td></tr>` : ''}
            <tr style="border-top: 1px solid #334155;"><td style="padding: 10px 0 0; color: #38bdf8; font-weight: bold;">Total Amount:</td><td style="padding: 10px 0 0; color: #38bdf8; font-weight: bold; font-size: 16px; text-align: right;">${formatINR(order.totalPrice)}</td></tr>
          </table>
        </div>

        <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">
          Current Status: <span style="background: #78350f; color: #fde68a; padding: 4px 10px; border-radius: 9999px; font-weight: bold; font-size: 11px;">PENDING ADMIN REVIEW</span>
        </p>
        <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">
          You will receive an automated email notification once our sales team reviews and approves your reservation.
        </p>
      </div>
      <div style="background: #090d16; padding: 16px 24px; text-align: center; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b;">
        phVault Automotive India &bull; Questions? Reply to this email
      </div>
    </div>
  `;

  return sendBrevoEmail({
    toEmail: user.email,
    toName: user.username,
    subject,
    htmlContent,
  });
};

/**
 * 3. Order Status Update Email (Approved / Rejected)
 */
const sendOrderStatusEmail = async ({ order, user, vehicle, status }) => {
  const isApproved = status === 'APPROVED';
  const subject = `Order ${isApproved ? 'Approved' : 'Cancelled'}: ${vehicle.make} ${vehicle.model} (#${order._id.toString().slice(-6)})`;
  const statusColor = isApproved ? '#10b981' : '#f43f5e';
  const statusBg = isApproved ? '#064e3b' : '#881337';
  const statusText = isApproved ? '#a7f3d0' : '#fecdd3';

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b;">
      <div style="background: linear-gradient(135deg, #0284c7 0%, #4f46e5 100%); padding: 32px 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #ffffff;">Order Status Update</h1>
        <p style="margin: 6px 0 0; color: #e0f2fe; font-size: 13px;">Order #${order._id.toString().slice(-6)}</p>
      </div>
      <div style="padding: 28px 24px;">
        <p style="font-size: 15px; color: #cbd5e1; margin-top: 0;">
          Hi <strong>${user.username}</strong>, your purchase reservation for <strong>${vehicle.make} ${vehicle.model}</strong> has been updated.
        </p>

        <div style="text-align: center; margin: 24px 0;">
          <span style="background: ${statusBg}; color: ${statusText}; border: 1px solid ${statusColor}; padding: 10px 24px; border-radius: 12px; font-weight: 800; font-size: 16px; display: inline-block;">
            ${isApproved ? 'ORDER APPROVED' : 'ORDER CANCELLED'}
          </span>
        </div>

        <div style="background: #1e293b; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #334155;">
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #94a3b8;">Vehicle:</td><td style="padding: 6px 0; color: #ffffff; font-weight: bold; text-align: right;">${vehicle.make} ${vehicle.model}</td></tr>
            <tr><td style="padding: 6px 0; color: #94a3b8;">Total Price:</td><td style="padding: 6px 0; color: #ffffff; font-weight: bold; text-align: right;">${formatINR(order.totalPrice)}</td></tr>
            <tr><td style="padding: 6px 0; color: #94a3b8;">Quantity:</td><td style="padding: 6px 0; color: #ffffff; text-align: right;">${order.quantity} unit(s)</td></tr>
          </table>
        </div>

        <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
          ${isApproved 
            ? 'Congratulations! Your vehicle reservation has been authorized by our dealership team. Our representative will contact you shortly regarding delivery schedule and documentation.'
            : 'Your vehicle reservation could not be completed at this time. Reserved units have been returned to showroom stock. Please contact our support if you have any questions.'}
        </p>
      </div>
      <div style="background: #090d16; padding: 16px 24px; text-align: center; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b;">
        phVault Automotive India &bull; Premium Vehicle Vault
      </div>
    </div>
  `;

  return sendBrevoEmail({
    toEmail: user.email,
    toName: user.username,
    subject,
    htmlContent,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
};
