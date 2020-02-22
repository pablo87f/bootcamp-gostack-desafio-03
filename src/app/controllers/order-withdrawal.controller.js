import { Op } from 'sequelize';
import {
    setSeconds,
    setMinutes,
    setHours,
    format,
    startOfDay,
    endOfDay,
} from 'date-fns';
import Order from '../models/order.model';
import File from '../models/file.model';
import Deliverer from '../models/deliverer.model';
import Recipient from '../models/recipient.model';

const maxWithdrawalsPerDay = 5;

class OrderWithdrawalController {
    async store(req, res) {
        try {
            // const now = setSeconds(setMinutes(setHours(new Date(), 14), 0), 0);
            const now = new Date();
            const startLimitDate = setSeconds(
                setMinutes(setHours(new Date(), 8), 0),
                0
            );
            const endLimitDate = setSeconds(
                setMinutes(setHours(new Date(), 18), 0),
                0
            );
            if (now < startLimitDate || now > endLimitDate)
                return res.status(401).json({
                    error: `Withdrawals are only allowed between ${format(
                        startLimitDate,
                        'HH:mm'
                    )} and ${format(endLimitDate, 'HH:mm')}`,
                });

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

            if (order.start_date)
                return res
                    .status(401)
                    .json({ error: 'The order has already been withdrawn' });

            const orderWithdrawnCount = await Order.count({
                include: [
                    {
                        model: Deliverer,
                        as: 'deliverer',
                        attributes: ['id', 'email', 'name'],
                        where: { id: order.deliverer.id },
                    },
                ],
                where: {
                    start_date: {
                        [Op.between]: [startOfDay(now), endOfDay(now)],
                    },
                },
            });

            if (orderWithdrawnCount >= maxWithdrawalsPerDay) {
                return res.status(401).json({
                    error: `the maximum amount of withdrawals per day is ${maxWithdrawalsPerDay}`,
                });
            }

            order.start_date = now;

            order.save();

            return res.json(order);
        } catch (ex) {
            return res.status(500).send();
        }
    }
}

export default new OrderWithdrawalController();
