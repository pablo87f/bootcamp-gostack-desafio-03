import * as Yup from 'yup';
import Order from '../models/order.model';
import File from '../models/file.model';
import Deliverer from '../models/deliverer.model';
import Recipient from '../models/recipient.model';

class OrderDeliverController {
    async store(req, res) {
        try {
            const schema = Yup.object().shape({
                signature_id: Yup.number().required(),
            });

            if (!(await schema.isValid(req.body))) {
                return res.status(401).json({ error: 'Validation fails' });
            }

            const { signature_id } = req.body;

            const file = await File.findByPk(signature_id);

            if (!file)
                return res
                    .status(401)
                    .json({ error: 'Signature file not found' });

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

            if (!order.start_date)
                return res
                    .status(401)
                    .json({ error: 'The order has not yet been withdrawn' });

            order.end_date = new Date();
            order.signature_id = signature_id;

            order.save();

            return res.json(order);
        } catch (ex) {
            return res.status(500).send();
        }
    }
}

export default new OrderDeliverController();
