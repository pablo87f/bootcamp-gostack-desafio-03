module.exports = {
    // id (id da entrega)
    // product (nome do produto a ser entregue);
    // canceled_at (data de cancelamento, se cancelada);
    // start_date (data de retirada do produto);
    // end_date (data final da entrega);
    // created_at;
    // updated_at;

    // recipient_id (referência ao destinatário);
    // deliveryman_id (referência ao entregador);
    // signature_id (referência à uma assinatura do destinatário, que será uma imagem);
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('orders', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            product: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            start_date: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            end_date: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            canceled_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    down: queryInterface => {
        return queryInterface.dropTable('orders');
    },
};
