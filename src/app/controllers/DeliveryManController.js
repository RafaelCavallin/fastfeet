import * as Yup from 'yup';
import DeliveryMan from '../models/DeliveryMan';
import File from '../models/File';

class DeliveryManController {
  async index(req, res) {
    const deliverymans = await DeliveryMan.findAll({
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'url', 'path'],
        },
      ],
    });

    return res.status(200).json(deliverymans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const deliveryManExists = await DeliveryMan.findOne({
      where: { email: req.body.email },
    });

    if (deliveryManExists) {
      return res.status(400).json({ error: 'Deliveryman already exists' });
    }

    const { id, name, avatar_id, email } = await DeliveryMan.create(req.body);

    return res.status(200).json({ id, name, avatar_id, email });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const deliveryman = await DeliveryMan.findByPk(req.params.id);
    const { email } = req.body;

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman does not exists' });
    }

    if (email && email !== deliveryman.email) {
      const userExists = await DeliveryMan.findOne({ where: { email } });
      if (userExists) {
        return res
          .status(400)
          .json({ error: 'Deliveryman email already exists' });
      }
    }

    await deliveryman.update(req.body);

    return res.status(200).json(deliveryman);
  }

  async delete(req, res) {
    const deliveryman = await DeliveryMan.findByPk(req.params.id);

    await deliveryman.destroy();
    return res.status(200).json({ ok: true });
  }
}

export default new DeliveryManController();
