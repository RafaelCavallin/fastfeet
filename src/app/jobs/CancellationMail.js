import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'NotificationMail';
  }

  async handle({ data }) {
    const { deliveryman, order } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Encomenda cancelada',
      template: 'cancelation',
      context: {
        deliveryman: deliveryman.name,
        order: order.id,
      },
    });
  }
}

export default new CancellationMail();
