import Order from '../models/Order';

class OrderProblemController {
  async index(req, res) {
    const orders = await Order.findAll({
      include: { association: 'problems' },
    });

    return res.status(200).json(orders);
  }
}

export default new OrderProblemController();
