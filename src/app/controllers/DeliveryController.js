import { Op } from 'sequelize';
import * as Yup from 'yup';
import { getHours, parseISO, startOfDay, endOfDay } from 'date-fns';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import DeliveryMan from '../models/DeliveryMan';
import File from '../models/File';

class DeliveryController {
  async index(req, res) {
    const { orderStatus } = req.query;

    let whereStatement = {};

    if (orderStatus === 'delivered') {
      whereStatement = {
        [Op.ne]: null,
      };
    } else {
      whereStatement = null;
    }

    const deliveries = await Order.findAll({
      where: {
        deliveryman_id: req.params.id,
        canceled_at: null,
        end_date: whereStatement,
      },
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

    return res.status(200).json(deliveries);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      order_id: Yup.number().required(),
      start_date: Yup.date(),
      end_date: Yup.date(),
      signature_id: Yup.number().when('end_date', (end_date, field) =>
        end_date ? field.required() : field
      ),
    });
    // Validar se end_date é < que start_date

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const order = await Order.findByPk(req.body.order_id);

    if (!order) {
      return res.status(400).json({ error: 'Order does not exists.' });
    }

    // eslint-disable-next-line eqeqeq
    if (order.deliveryman_id != req.params.id) {
      return res.status(400).json({
        error: 'This order does not belong you',
      });
    }

    const { start_date } = req.body;
    const parseStartDate = getHours(parseISO(start_date));

    if (parseStartDate && !(parseStartDate >= 8 && parseStartDate <= 18)) {
      return res.status(400).json({
        error: 'Deliveryman can only get a order between 8AM and 6PM',
      });
    }

    if (start_date) {
      const amoutDeliveries = await Order.findAndCountAll({
        where: {
          deliveryman_id: req.params.id,
          canceled_at: null,
          start_date: {
            [Op.ne]: null,
            [Op.between]: [
              startOfDay(parseISO(req.body.start_date)),
              endOfDay(parseISO(req.body.start_date)),
            ],
          },
        },
      });

      if (amoutDeliveries.count === 5) {
        return res.status(400).json({
          error: 'Deliveryman can only do 5 deliveries per day',
        });
      }
    }

    await order.update(req.body);

    return res.status(200).json(order);
  }
}

export default new DeliveryController();
