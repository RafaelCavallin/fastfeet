import DeliveryMan from '../models/DeliveryMan';

class DeliveryManController {
  async store(req, res) {
    const deliveryman = await DeliveryMan.create(req.body);

    return res.status(200).json(deliveryman);
  }
}

export default new DeliveryManController();
