module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('payments', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true,
                unique: true,
            },
            payment_reference: { type: Sequelize.UUID, allowNull: false },
            id_payment_user: { type: Sequelize.UUID, allowNull: false },
            email_payment_user: { type: Sequelize.STRING, allowNull: false },
            status: {
                type: Sequelize.STRING,
                defaultValue: 'undefined',
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('payments');
    },
};
