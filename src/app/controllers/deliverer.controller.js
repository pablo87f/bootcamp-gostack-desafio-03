import * as Yup from 'yup';
import Deliverer from '../models/deliverer.model';
import File from '../models/file.model';

class DelivererController {
    async index(req, res) {
        try {
            const deliverers = await Deliverer.findAll({
                attributes: ['id', 'name', 'email', 'avatar_id'],
                include: [
                    {
                        model: File,
                        as: 'avatar',
                        attributes: ['name', 'path', 'url'],
                    },
                ],
            });

            return res.json(deliverers);
        } catch (ex) {
            return res.status(500).send();
        }
    }

    async store(req, res) {
        try {
            const schema = Yup.object().shape({
                name: Yup.string().required(),
                email: Yup.string()
                    .email()
                    .required(),
                avatar_id: Yup.number(),
            });

            if (!(await schema.isValid(req.body))) {
                return res.status(401).json({ error: 'Validation fails' });
            }

            const userExists = await Deliverer.findOne({
                where: { email: req.body.email },
            });

            if (userExists) {
                return res
                    .status(400)
                    .json({ error: 'Deliverer email already exists.' });
            }

            const { id } = await Deliverer.create(req.body);

            const createdDeliverer = await Deliverer.findByPk(id, {
                attributes: ['id', 'name', 'email', 'avatar_id'],
                include: [
                    {
                        model: File,
                        as: 'avatar',
                        attributes: ['name', 'path', 'url'],
                    },
                ],
            });

            return res.json(createdDeliverer);
        } catch (ex) {
            return res.status(500).send();
        }
    }

    async show(req, res) {
        try {
            const { id } = req.params;

            const deliverer = await Deliverer.findByPk(id, {
                attributes: ['id', 'name', 'email', 'avatar_id'],
                include: [
                    {
                        model: File,
                        as: 'avatar',
                        attributes: ['name', 'path', 'url'],
                    },
                ],
            });

            if (!deliverer)
                return res.status(401).json({ error: 'Deliverer not found' });

            return res.json(deliverer);
        } catch (ex) {
            return res.status(500).send();
        }
    }

    async update(req, res) {
        try {
            const schema = Yup.object().shape({
                name: Yup.string(),
                email: Yup.string().email(),
                avatar_id: Yup.number(),
            });

            if (!(await schema.isValid(req.body))) {
                return res.status(401).json({ error: 'Validation fails' });
            }

            const { email } = req.body;
            const { id: passedId } = req.params;

            const deliverer = await Deliverer.findByPk(passedId);

            if (!deliverer)
                return res.status(401).json({ error: 'Deliverer not found' });

            if (email && email !== deliverer.email) {
                const delivererExists = await Deliverer.findOne({
                    where: { email },
                });

                if (delivererExists) {
                    return res
                        .status(401)
                        .json({ error: 'User email already exists' });
                }
            }

            const { id } = await deliverer.update(req.body);

            const updatedDeliverer = await Deliverer.findByPk(id, {
                attributes: ['id', 'name', 'email', 'avatar_id'],
                include: [
                    {
                        model: File,
                        as: 'avatar',
                        attributes: ['name', 'path', 'url'],
                    },
                ],
            });

            return res.json(updatedDeliverer);
        } catch (ex) {
            return res.status(500).send();
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            const deliverer = await Deliverer.findByPk(id);

            if (!deliverer)
                return res.status(401).json({ error: 'Deliverer not found' });

            await deliverer.destroy();

            return res.send();
        } catch (ex) {
            return res.status(500).send();
        }
    }
}

export default new DelivererController();
