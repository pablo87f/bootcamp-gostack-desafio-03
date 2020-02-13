import * as Yup from 'yup';
import Order from '../models/order.model';
import File from '../models/file.model';
import Recipient from '../models/recipient.model';
import Deliverer from '../models/deliverer.model';

class OrderController {
    async index(req, res) {
        try {
            const orders = await Order.findAll({
                attributes: ['id', 'product', 'start_date', 'end_date'],
                include: [
                    {
                        model: File,
                        as: 'signature',
                        attributes: ['name', 'path', 'url'],
                    },
                    {
                        model: Deliverer,
                        as: 'deliverer',
                        attributes: ['id', 'email', 'name'],
                    },
                    {
                        model: Recipient,
                        as: 'recipient',
                        attributes: ['id', 'name'],
                    },
                ],
            });

            return res.json(orders);
        } catch (ex) {
            return res.status(500).send();
        }
    }

    async store(req, res) {
        try {
            const schema = Yup.object().shape({
                product: Yup.string().required(),
                deliverer_id: Yup.number().required(),
                recipient_id: Yup.number().required(),
            });

            if (!(await schema.isValid(req.body))) {
                return res.status(401).json({ error: 'Validation fails' });
            }

            const { product, deliverer_id, recipient_id } = req.body;

            const recipientExists = await Recipient.findByPk(recipient_id);
            if (!recipientExists)
                return res.status(401).json({ error: 'Recipient not found' });

            const delivererExists = await Deliverer.findByPk(deliverer_id);
            if (!delivererExists)
                return res.status(401).json({ error: 'Deliverer not found' });

            const { id } = await Order.create(req.body);

            return res.json({ id, product, deliverer_id, recipient_id });
        } catch (ex) {
            return res.status(500).send();
        }
    }

    async show(req, res) {
        try {
            const { id } = req.params;

            const order = await Order.findByPk(id, {
                attributes: ['id', 'product', 'start_date', 'end_date'],
                include: [
                    {
                        model: File,
                        as: 'signature',
                        attributes: ['name', 'path', 'url'],
                    },
                    {
                        model: Deliverer,
                        as: 'deliverer',
                        attributes: ['id', 'email', 'name'],
                    },
                    {
                        model: Recipient,
                        as: 'recipient',
                        attributes: ['id', 'name'],
                    },
                ],
            });

            if (!order)
                return res.status(401).json({ error: 'Order not found' });

            return res.json(order);
        } catch (ex) {
            return res.status(500).send();
        }
    }

    async update(req, res) {
        try {
            const schema = Yup.object().shape({
                product: Yup.string(),
                deliverer_id: Yup.number().required(),
                recipient_id: Yup.number().required(),
            });

            if (!(await schema.isValid(req.body))) {
                return res.status(401).json({ error: 'Validation fails' });
            }

            const { id: passedId } = req.params;

            const orderExists = await Order.findByPk(passedId);

            if (!orderExists)
                return res.status(401).json({ error: 'Order not found' });

            const { deliverer_id, recipient_id } = req.body;

            const recipientExists = await Recipient.findByPk(recipient_id);
            if (!recipientExists)
                return res.status(401).json({ error: 'Recipient not found' });

            const delivererExists = await Deliverer.findByPk(deliverer_id);
            if (!delivererExists)
                return res.status(401).json({ error: 'Deliverer not found' });

            const { id } = await orderExists.update(req.body);

            const order = await Order.findByPk(id, {
                attributes: ['id', 'product', 'start_date', 'end_date'],
                include: [
                    {
                        model: File,
                        as: 'signature',
                        attributes: ['name', 'path', 'url'],
                    },
                    {
                        model: Deliverer,
                        as: 'deliverer',
                        attributes: ['id', 'email', 'name'],
                    },
                    {
                        model: Recipient,
                        as: 'recipient',
                        attributes: ['id', 'name'],
                    },
                ],
            });

            return res.json(order);
        } catch (ex) {
            return res.status(500).send();
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            const order = await Order.findByPk(id);

            if (!order)
                return res.status(401).json({ error: 'Order not found' });

            await order.destroy();

            return res.send();
        } catch (ex) {
            return res.status(500).send();
        }
    }
}

export default new OrderController();
