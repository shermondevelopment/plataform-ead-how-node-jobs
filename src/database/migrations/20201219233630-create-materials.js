module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('materials', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            url: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            id_module: {
                type: Sequelize.UUID,
                references: {
                    model: 'modules',
                    key: 'id',
                    as: 'materials',
                },
                onDelete: 'CASCADE',
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
        await queryInterface.dropTable('materials');
    },
};
