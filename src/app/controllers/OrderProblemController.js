import Order from '../models/Order';

class OrderProblemController {
  async index(req, res) {
    const orders = await Order.findAll({
      include: { association: 'problems' },
    });

    const ordersWithProblems = orders.filter(order => order.problems.length);

    return res.status(200).json(ordersWithProblems);
  }
}

export default new OrderProblemController();
