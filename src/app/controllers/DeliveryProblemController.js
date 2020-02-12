class DeliveryProblemController {
  async store(req, res) {
    return res.status(200).json(req.params.id);
  }
}

export default new DeliveryProblemController();
