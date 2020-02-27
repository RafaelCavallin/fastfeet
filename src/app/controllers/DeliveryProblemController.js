import DeliveryProblem from '../models/DeliveryProblem';
import Order from '../models/Order';
import DeliveryMan from '../models/DeliveryMan';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class DeliveryProblemController {
  async store(req, res) {
    const delivery_id = req.params.id;
    const { description } = req.body;

    const problem = await DeliveryProblem.create({
      delivery_id,
      description,
    });

    return res.status(200).json(problem);
  }

  async delete(req, res) {
    const id = req.params.id_problem;

    const problem = await DeliveryProblem.findByPk(id);

    if (!problem) {
      return res
        .status(401)
        .json({ error: 'There is no problem with this ID' });
    }

    const order = await Order.findByPk(problem.delivery_id);

    if (order.end_date !== null) {
      return res.status(400).json({ error: 'Order already delivered.' });
    }

    if (order.canceled_at !== null) {
      return res.status(400).json({ error: 'Order already canceled.' });
    }

    order.canceled_at = new Date();

    await order.save();

    const deliveryman = await DeliveryMan.findByPk(order.deliveryman_id);

    // Sending a cancellation email.
    await Queue.add(CancellationMail.key, {
      deliveryman,
      order,
    });

    return res.status(200).json(order);
  }
}

export default new DeliveryProblemController();
