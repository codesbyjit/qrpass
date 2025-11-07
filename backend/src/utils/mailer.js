import nodemailer from "nodemailer";

export const sendMail = async (email, qrDataUrl, details = {}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const base64Image = qrDataUrl.split(";base64,").pop();
  const qrBuffer = Buffer.from(base64Image, "base64");

  const { name, eventName, location, date, time } = {
    eventName: "TechNova 2025",
    location: "Techno India University, Kolkata",
    date: "Nov 15, 2025",
    time: "10:00 AM – 4:00 PM",
    ...details,
  };

  const orgName = "Sustainovate";

  const mailOptions = {
    from: `"${orgName}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `🎟️ Invitation to ${eventName}`,
    html: `
      <div style="margin:0;padding:0;background:#f4f7fb;font-family:'Segoe UI',Arial,sans-serif;">
        <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 25px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#007BFF,#00C4FF);color:#fff;padding:25px;text-align:center;">
            <h1 style="margin:0;font-size:26px;">You're Invited!</h1>
            <p style="margin:8px 0 0;font-size:18px;font-weight:500;">${eventName}</p>
          </div>

          <!-- Content -->
          <div style="padding:25px;text-align:center;">
            <p style="font-size:18px;margin-bottom:10px;">Hello <strong>${name}</strong>,</p>
            <p style="color:#555;font-size:15px;line-height:1.6;">
              We're thrilled to have you join us for <b>${eventName}</b>!  
              Below are your event details and your personalized entry QR.
            </p>

            <!-- Event Details -->
            <div style="margin:25px auto;border-radius:12px;background:#f9fbff;border:1px solid #e0e7ff;padding:15px;width:90%;max-width:400px;">
              <table style="width:100%;font-size:15px;color:#333;">
                <tr>
                  <td style="text-align:left;font-weight:600;">📍 Location:</td>
                  <td style="text-align:right;">${location}</td>
                </tr>
                <tr>
                  <td style="text-align:left;font-weight:600;">📅 Date:</td>
                  <td style="text-align:right;">${date}</td>
                </tr>
                <tr>
                  <td style="text-align:left;font-weight:600;">🕒 Time:</td>
                  <td style="text-align:right;">${time}</td>
                </tr>
              </table>
            </div>

            <!-- QR Code -->
            <p style="margin-top:20px;margin-bottom:10px;font-size:16px;">🎫 Your Entry Pass</p>
            <img src="cid:qrimage" alt="QR Code" 
                 style="width:180px;height:180px;border-radius:12px;margin:10px auto;display:block;border:3px solid #007BFF;" />

            <p style="font-size:13px;color:#777;margin-top:15px;">
              Please present this QR code at the entrance for entry verification.
            </p>

            <!-- Footer -->
            <div style="margin-top:30px;padding-top:15px;border-top:1px solid #eee;">
              <p style="color:#555;font-size:14px;margin:5px 0;">We can’t wait to see you there!</p>
              <p style="color:#777;font-size:13px;margin:0;">— The <strong>${orgName}</strong> Team</p>
            </div>
          </div>
        </div>

        <!-- Mobile Responsiveness -->
        <div style="text-align:center;font-size:12px;color:#999;margin-top:15px;">
          This invitation was sent to <b>${email}</b><br/>
          <span style="font-size:11px;">Best viewed on mobile or desktop.</span>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: "ticket-qr.png",
        content: qrBuffer,
        cid: "qrimage",
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};
