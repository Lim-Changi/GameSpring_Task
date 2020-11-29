module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Room',
        {
            users: {
                type: DataTypes.INTEGER,
                default: 0

            }
        },
        {
            freezeTableName: true,
            timestamps: false
        }
    );
};