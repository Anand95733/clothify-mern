const orderConfirmationTemplate = (order) => {
    const itemsHtml = order.orderItems
        .map(
            (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name} (${item.size})</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${item.price.toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `
        )
        .join('');

    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Order Confirmation</h2>
      <p>Thank you for your order!</p>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
            <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Qty</th>
            <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Price</th>
            <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding: 8px; text-align: right; font-weight: bold;">Total:</td>
            <td style="padding: 8px; font-weight: bold;">$${order.totalPrice.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      
      <p style="margin-top: 20px;">We will process your order shortly.</p>
    </div>
  `;
};

module.exports = { orderConfirmationTemplate };
