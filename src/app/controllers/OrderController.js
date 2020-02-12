import * as Yup from 'yup';
import { parseISO, getHours } from 'date-fns';

import Order from '../models/Order';
import Recipient from '../models/Recipient';
import DeliveryMan from '../models/DeliveryMan';
import File from '../models/File';

import Mail from '../../lib/Mail';

class OrderController {
  async show(req, res) {
    const order = await Order.findByPk(req.params.id, {
      attributes: ['id', 'product', 'canceled_at', 'start_date', 'end_date'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name'],
        },
        {
          model: DeliveryMan,
          as: 'deliveryman',
          attributes: ['id', 'name'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'url', 'path'],
        },
      ],
    });

    if (!order) {
      return res.status(400).json({ error: 'Order does not exists.' });
    }

    return res.status(200).json(order);
  }

  async index(req, res) {
    const orders = await Order.findAll({
      attributes: ['id', 'product', 'canceled_at', 'start_date', 'end_date'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name'],
        },
        {
          model: DeliveryMan,
          as: 'deliveryman',
          attributes: ['id', 'name'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'url', 'path'],
        },
      ],
    });
    // fazer paginação.
    return res.status(200).json(orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const order = await Order.create(req.body);

    const deliveryman = await DeliveryMan.findByPk(req.body.deliveryman_id);

    const recipient = await DeliveryMan.findByPk(req.body.recipient_id);

    // implementar jobs
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

    return res.status(200).json(order);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      product: Yup.string(),
      start_date: Yup.date(),
      end_date: Yup.date(),
      canceled_at: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(400).json({ error: 'Order does not exists.' });
    }

    // Validar se end_date é < que start_date

    const { start_date } = req.body;
    const parseStartDate = getHours(parseISO(start_date));

    if (parseStartDate && !(parseStartDate >= 8 && parseStartDate <= 18)) {
      return res.status(400).json({
        error: 'Deliveryman can only get a order between 8AM and 6PM',
      });
    }

    await order.update(req.body);

    return res.status(200).json(order);
  }

  async delete(req, res) {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(400).json({ error: 'Order does not exists.' });
    }

    await order.destroy();

    return res.status(200).json({ success: true });
  }
}

export default new OrderController();
