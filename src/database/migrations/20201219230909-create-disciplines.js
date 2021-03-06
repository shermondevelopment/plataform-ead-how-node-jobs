module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('disciplines', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: { notEmpty: { msg: 'insert a title' } },
            },
            slug: { type: Sequelize.STRING, allowNull: false },
            image: { type: Sequelize.STRING },
            qt_modules: { type: Sequelize.INTEGER(2), allowNull: false },
            id_course: {
                type: Sequelize.UUID,
                references: {
                    model: 'courses',
                    key: 'id',
                    as: 'disciplines',
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
        await queryInterface.dropTable('disciplines');
    },
};
