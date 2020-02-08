import Order from '../models/Order';
import Recipient from '../models/Recipient';
import DeliveryMan from '../models/DeliveryMan';
import File from '../models/File';

class DeliveryController {
  async index(req, res) {
    const deliveries = await Order.findAll({
      where: {
        deliveryman_id: req.params.id,
        canceled_at: null,
        end_date: null,
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
}

export default new DeliveryController();

/**
 *
 * Permita também que ele liste apenas as encomendas que já foram entregues por ele, com base em seu ID de cadastro;
 */
