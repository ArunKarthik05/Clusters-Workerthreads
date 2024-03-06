const { DataTypes } = require('sequelize');
const {sequelize} = require('./database');

const electronic = sequelize.define('electronic', {
    // Define the attributes (columns) of the model
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    otpExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  });
  
  // Sync the defined models with the database
  sequelize.sync()
    .then(() => {
      console.log('Database synced successfully');
    })
    .catch((error) => {
      console.error('Error syncing database:', error);
    });
  
  module.exports = electronic;
  