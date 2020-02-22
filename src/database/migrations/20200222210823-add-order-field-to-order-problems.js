module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('order_problems', 'order_id', {
            type: Sequelize.INTEGER,
            references: { model: 'orders', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: false,
        });
    },

    down: queryInterface => {
        return queryInterface.removeColumn('order_problems', 'order_id');
    },
};
