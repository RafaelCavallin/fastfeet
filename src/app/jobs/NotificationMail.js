import Mail from '../../lib/Mail';

class NotificationMail {
  get key() {
    return 'NotificationMail';
  }

  async handle({ data }) {
    const { deliveryman, order, recipient } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Nova encomenda disponível.',
      template: 'notification',
      context: {
        deliveryman: deliveryman.name,
        order: order.id,
        recipient: recipient.name,
        product: order.product,
      },
    });
  }
}

export default new NotificationMail();
