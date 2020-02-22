import Mail from '../../lib/mail';

class OrderCancellationMail {
    get key() {
        return 'OrderCancellationMail';
    }

    async handle({ data }) {
        const { order } = data;

        await Mail.sendMail({
            to: `${order.deliverer.name} <${order.deliverer.email}>`,
            subject: 'Encomenda cancelada',
            template: 'order-cancellation',
            context: {
                product: order.product,
                deliverer: order.deliverer.name,
                id: order.id,
            },
        });
    }
}

export default new OrderCancellationMail();
