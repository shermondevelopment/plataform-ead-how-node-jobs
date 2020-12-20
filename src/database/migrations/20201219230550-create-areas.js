module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('areas', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
                validade: { notEmpty: { msg: 'Insira um título' } },
            },
            id_curso: {
                type: Sequelize.UUID,
                references: {
                    model: 'courses',
                    key: 'id',
                    as: 'areas',
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
        await queryInterface.dropTable('areas');
    },
};
