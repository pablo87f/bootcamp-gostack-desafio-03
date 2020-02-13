module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('orders', 'deliverer_id', {
            type: Sequelize.INTEGER,
            references: { model: 'deliverers', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: false,
        });
    },

    down: queryInterface => {
        return queryInterface.removeColumn('orders', 'deliverer_id');
    },
};
