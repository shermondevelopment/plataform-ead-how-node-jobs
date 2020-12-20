module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('modules', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            slug: { type: Sequelize.STRING, allowNull: false },
            qt_class: { type: Sequelize.INTEGER, allowNull: false },
            qt_concluded: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            order: { type: Sequelize.INTEGER(10), allowNull: false },
            id_discipline: {
                type: Sequelize.UUID,
                references: {
                    model: 'disciplines',
                    key: 'id',
                    as: 'modules',
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
        await queryInterface.dropTable('modules');
    },
};
