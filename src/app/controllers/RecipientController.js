import * as Yup from 'yup';

import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string(),
      city: Yup.string().required(),
      state: Yup.string().required(),
      zip_code: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const {
      name,
      street,
      number,
      complement,
      city,
      state,
      zip_code,
    } = await Recipient.create(req.body);

    return res
      .status(200)
      .json({ name, street, number, complement, city, state, zip_code });
  }

  async index(req, res) {
    const recipients = await Recipient.findAll({
      attributes: [
        'name',
        'street',
        'number',
        'complement',
        'city',
        'state',
        'zip_code',
      ],
    });

    return res.status(200).json(recipients);
  }

  async show(req, res) {
    const recipient = await Recipient.findByPk(req.params.id, {
      attributes: [
        'name',
        'street',
        'number',
        'complement',
        'city',
        'state',
        'zip_code',
      ],
    });

    return res.status(200).json(recipient);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      number: Yup.number(),
      complement: Yup.string(),
      city: Yup.string(),
      state: Yup.string().max(2),
      zip_code: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const recipient = await Recipient.findByPk(req.params.id);

    const {
      name,
      street,
      number,
      complement,
      city,
      state,
      zip_code,
    } = await recipient.update(req.body);

    return res
      .status(200)
      .json({ name, street, number, complement, city, state, zip_code });
  }

  async delete(req, res) {
    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(401).json({
        error: 'There is not recipient with this ID.',
      });
    }

    recipient.destroy();

    return res.status(200).json({ message: 'Recipient deleted.' });
  }
}

export default new RecipientController();
