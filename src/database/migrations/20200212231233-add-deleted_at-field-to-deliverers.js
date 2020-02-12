module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('deliverers', 'deleted_at', {
            type: Sequelize.DATE,
            allowNull: true,
        });
    },

    down: queryInterface => {
        return queryInterface.removeColumn('deliverers', 'deleted_at');
    },
};
