module.exports = {
    // id (id do entregador)
    // name (nome do entregador);
    // avatar_id (foto do entregador);
    // email (email do entregador)
    // created_at;
    // updated_at;
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('deliverers', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
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
        return queryInterface.dropTable('deliverers');
    },
};
