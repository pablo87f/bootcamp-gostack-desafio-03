import Order from '../models/order.model';
import File from '../models/file.model';
import Recipient from '../models/recipient.model';
import Deliverer from '../models/deliverer.model';

class AssignedOrdersController {
    async index(req, res) {
        const { id: deliverer_id } = req.params;

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
                    deliverer_id,
                    canceled_at: null,
                    end_date: null,
                },
            });

            return res.json(orders);
        } catch (ex) {
            return res.status(500).send();
        }
    }
}

export default new AssignedOrdersController();
