module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('courses', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: { notEmpty: { msg: 'insira um título' } },
            },
            description: { type: Sequelize.STRING, allowNull: true },
            image: { type: Sequelize.STRING },
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
        await queryInterface.dropTable('courses');
    },
};
