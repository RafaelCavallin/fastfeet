import DeliveryProblem from '../models/DeliveryProblem';

class ProblemPerOrder {
  async index(req, res) {
    const delivery_id = req.params.id;

    const problems = await DeliveryProblem.findAndCountAll({
      where: { delivery_id },
    });

    return res.status(200).json(problems);
  }
}

export default new ProblemPerOrder();
