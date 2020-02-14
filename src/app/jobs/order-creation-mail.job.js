import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/mail';

class OrderCreationMail {
    get key() {
        return 'OrderCreationMail';
    }

    async handle({ data }) {
        const { order } = data;

        const {
            name: recipientName,
            number,
            street,
            complement,
            state,
            city,
            zip_code,
        } = order.recipient;

        const address = `${street}, n ${number}, ${complement} `;
        const place = `${city}, ${state} `;
        const zip = `CEP: ${zip_code} `;

        await Mail.sendMail({
            to: `${order.deliverer.name} <${order.deliverer.email}>`,
            subject: 'Nova Encomenda',
            template: 'order-creation',
            context: {
                product: order.product,
                deliverer: order.deliverer.name,
                recipient: recipientName,
                address,
                place,
                zip,
                date: format(
                    parseISO(order.created_at),
                    "dd 'de' MMM', às' H:mm'h'",
                    {
                        locale: pt,
                    }
                ),
            },
        });
    }
}

export default new OrderCreationMail();
