import * as Yup from 'yup';

import Recipient from '../models/recipient.model';

class RecipientController {
    async index(req, res) {
        try {
            const recipients = await Recipient.findAll({
                attributes: [
                    'id',
                    'name',
                    'number',
                    'complement',
                    'state',
                    'city',
                    'zip_code',
                ],
            });

            return res.send(recipients);
        } catch (ex) {
            return res.status(500).send();
        }
    }

    async store(req, res) {
        try {
            const schema = Yup.object().shape({
                name: Yup.string().required(),
                number: Yup.number().required(),
                complement: Yup.string().required(),
                state: Yup.string().required(),
                city: Yup.string().required(),
                zip_code: Yup.string().required(),
            });

            if (!(await schema.isValid(req.body))) {
                return res.status(401).json({ error: 'Validation fails' });
            }

            const { name } = req.body;

            const recipientExists = await Recipient.findOne({
                where: { name },
            });

            if (recipientExists)
                return res.status(401).json({ error: 'User already exists' });

            const {
                id,
                number,
                complement,
                state,
                city,
                zip_code,
            } = await Recipient.create(req.body);

            return res.json({
                id,
                name,
                number,
                complement,
                state,
                city,
                zip_code,
            });
        } catch (ex) {
            return res.status(500).send();
        }
    }

    async show(req, res) {
        const { id } = req.params;

        try {
            const recipient = await Recipient.findOne({
                where: { id },
                attributes: [
                    'id',
                    'name',
                    'number',
                    'complement',
                    'state',
                    'city',
                    'zip_code',
                ],
            });

            if (!recipient)
                return res.status(401).json({ error: 'Recipient not found' });

            return res.send(recipient);
        } catch (ex) {
            return res.status(500).send();
        }
    }

    async update(req, res) {
        try {
            const schema = Yup.object().shape({
                name: Yup.string().required(),
                number: Yup.number().required(),
                complement: Yup.string().required(),
                state: Yup.string().required(),
                city: Yup.string().required(),
                zip_code: Yup.string().required(),
            });

            if (!(await schema.isValid(req.body))) {
                return res.status(401).json({ error: 'Validation fails' });
            }

            const {
                name,
                number,
                complement,
                state,
                city,
                zip_code,
            } = req.body;

            const { id } = req.params;

            const recipient = await Recipient.findOne({
                where: { id },
            });

            if (!recipient)
                return res
                    .status(401)
                    .json({ error: 'Recipient does not exists' });

            if (recipient.name !== name) {
                const recipientNameExists = await Recipient.findOne({
                    where: { name },
                });

                if (recipientNameExists)
                    return res
                        .status(401)
                        .json({ error: 'Recipient name already exists' });
            }

            await recipient.update(req.body);

            return res.json({
                id,
                name,
                number,
                complement,
                state,
                city,
                zip_code,
            });
        } catch (ex) {
            return res.status(500).send();
        }
    }

    async delete(req, res) {
        try {
            const recipient = await Recipient.findByPk(req.params.id);

            if (!recipient)
                return res
                    .status(401)
                    .json({ error: 'Recipient does not exists' });

            const result = await recipient.destroy();

            return res.json(result);
        } catch (ex) {
            return res.status(500).send();
        }
    }
}

export default new RecipientController();
