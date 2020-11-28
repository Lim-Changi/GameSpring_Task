module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User',
        {
            //모델의 Attributes (Column)을 정의하는곳
            userId: {
                type: DataTypes.STRING(30),
                // allowNull: false,
            },
            password: {
                type: DataTypes.STRING(200),
                // allowNull: false,
            },

        },
        {
            freezeTableName: true,
            createdAt: true
        }
    );
};