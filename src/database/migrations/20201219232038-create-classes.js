module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('classes', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            title: {
                type: Sequelize.STRING,
                notNull: false,
                validate: { notEmpty: { msg: 'Preencha um titulo' } },
            },
            slug: { type: Sequelize.STRING, allowNull: false },
            url: {
                type: Sequelize.STRING,
                notNull: false,
                validae: { notEmpty: { msg: 'Preencha um video' } },
            },
            order: { type: Sequelize.INTEGER(10), notNull: false },
            id_module: {
                type: Sequelize.UUID,
                references: {
                    model: 'modules',
                    key: 'id',
                    as: 'classes',
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
        await queryInterface.dropTable('classes');
    },
};
