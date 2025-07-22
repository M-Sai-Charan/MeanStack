function generateInvoiceTemplate(enquiry) {
  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return `₹ ${Number(amount).toLocaleString()}`;
  };

  return `
    <div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 700px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
        
        <div style="background: linear-gradient(to right, #6a11cb, #2575fc); padding: 20px; color: #fff; text-align: center;">
          <h1 style="margin: 0;">${enquiry.Bride} ❤️ ${enquiry.Groom}</h1>
          <p style="margin: 5px 0 0;">Wedding Invoice</p>
        </div>

        <div style="padding: 20px;">
          <h3 style="color: #333;">📍 Contact Info</h3>
          <p><strong>Location:</strong> ${enquiry.Location}</p>
          <p><strong>Phone:</strong> ${enquiry.ContactNumber}</p>
          <p><strong>Email:</strong> ${enquiry.Email}</p>
          <p><strong>OLPID:</strong> ${enquiry.OLPID}</p>

          <hr style="margin: 20px 0;" />

          <h3 style="color: #333;">📸 Events</h3>
          ${enquiry.Events.map(event => `
            <div style="background: #fafafa; padding: 10px 15px; margin-bottom: 10px; border-radius: 6px; border-left: 4px solid #6a11cb;">
              <strong>${event.EventName}</strong><br />
              📅 ${new Date(event.EventDate).toDateString()}<br />
              ⏰ ${event.EventTime}<br />
              📍 ${event.EventLocation}<br />
              👥 ${event.EventGuests} Guests<br />
              💰 ${formatCurrency(event.FinalApprovedAmount)}
            </div>
          `).join('')}

          <hr style="margin: 20px 0;" />

          <h2 style="text-align:center; color: #2575fc;">Total Estimate: ${formatCurrency(enquiry.InvoiceMeta?.TotalApprovedAmount)}</h2>

          <h3 style="margin-top: 30px;">📝 Terms & Conditions</h3>
          <ul style="line-height: 1.6;">
            <li>50% advance payment required</li>
            <li>Final payment before delivery</li>
            <li>Travel & stay not included (if outstation)</li>
            <li>This estimate is valid for 48 hours only</li>
          </ul>

          <p style="text-align: center; margin-top: 30px;">Thank you for choosing <strong>OneLook Photography</strong> 📸</p>
        </div>

        <div style="background: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eee;">
          <p>Follow us on:</p>
          <a href="https://www.instagram.com/onelookphotography_/?hl=en" target="_blank" style="margin: 0 8px;">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" width="24" alt="Instagram" />
          </a>
          <a href="https://www.facebook.com/onelookphotography" target="_blank" style="margin: 0 8px;">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" width="24" alt="Facebook" />
          </a>
          <a href="mailto:${enquiry.Email}" style="margin: 0 8px;">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png" width="24" alt="Email" />
          </a>

          <div style="margin-top: 15px;">
            <a href="https://www.instagram.com/onelookphotography_/?hl=en" target="_blank" style="
              display: inline-block;
              padding: 10px 20px;
              background: #6a11cb;
              color: #fff;
              border-radius: 6px;
              text-decoration: none;
              font-weight: 500;
              box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            ">Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

module.exports = generateInvoiceTemplate;
