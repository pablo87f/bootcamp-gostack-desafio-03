import * as Yup from 'yup';
import File from '../models/file.model';
import Deliverer from '../models/deliverer.model';
import Recipient from '../models/recipient.model';
import Order from '../models/order.model';
import OrderProblem from '../models/order-problem.model';
import queue from '../../lib/queue';
import OrderCancellationMailJob from '../jobs/order-cancelation-mail.job';

class OrderProblemsController {
    async index(req, res) {
        try {
            const { id: order_id } = req.params;
            const orderProblems = await OrderProblem.findAll({
                include: [
                    {
                        model: Order,
                        as: 'order',
                        attributes: [
                            'product',
                            'start_date',
                            'end_date',
                            'canceled_at',
                        ],
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
                                attributes: [
                                    'id',
                                    'name',
                                    'number',
                                    'street',
                                    'complement',
                                    'state',
                                    'city',
                                    'zip_code',
                                ],
                            },
                        ],
                        where: {
                            id: order_id,
                        },
                    },
                ],
            });

            return res.json(orderProblems);
        } catch (ex) {
            return res.status(500).send();
        }
    }

    async store(req, res) {
        try {
            const schema = Yup.object().shape({
                description: Yup.string().required(),
            });

            if (!(await schema.isValid(req.body))) {
                return res.status(401).json({ error: 'Validation fails' });
            }

            const { id: order_id } = req.params;

            const order = await Order.findByPk(order_id, {
                attributes: ['product', 'start_date', 'end_date'],
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
                        attributes: [
                            'id',
                            'name',
                            'number',
                            'street',
                            'complement',
                            'state',
                            'city',
                            'zip_code',
                        ],
                    },
                ],
            });

            if (!order)
                return res.status(401).json({ error: 'Order not found' });

            const { description } = req.body;
            const { id, created_at, updated_at } = await OrderProblem.create({
                description,
                order_id,
            });

            return res.json({ id, description, created_at, updated_at, order });
        } catch (ex) {
            return res.status(500).send();
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            const orderProblem = await OrderProblem.findByPk(id);

            if (!orderProblem)
                return res.status(401).json({ error: 'Problem not found' });

            const order = await Order.findByPk(orderProblem.order_id, {
                attributes: [
                    'id',
                    'product',
                    'start_date',
                    'end_date',
                    'canceled_at',
                ],
                include: [
                    {
                        model: Deliverer,
                        as: 'deliverer',
                        attributes: ['id', 'email', 'name'],
                    },
                ],
            });

            if (order.canceled_at)
                return res
                    .status(401)
                    .json({ error: 'The order has already been canceled' });

            order.canceled_at = new Date();
            order.save();

            await queue.add(OrderCancellationMailJob.key, {
                order,
            });

            return res.send();
        } catch (ex) {
            return res.status(500).send();
        }
    }
}

export default new OrderProblemsController();
