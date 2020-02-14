import DeliveryProblem from '../models/DeliveryProblem';

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
}

export default new DeliveryProblemController();
