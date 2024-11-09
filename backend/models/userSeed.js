const UserModel = require("./userModel");

const seedData = [
  {
    userName: "Pandurang",
    userPassHash:
      "$2b$10$HQ2kpn0D2O4rPEFkraUNneiY3PwbLeqpNjV0waOUSKQtAwOUvRqVS",
    userCity: "Dubai",
    userType: "Admin",
    userPinHash: "$2b$10$HQ2kpn0D2O4rPEFkraUNneiY3PwbLeqpNjV0waOUSKQtAwOUvRqVS",
    // ... other fields
  },
];

const seedDatabase = async () => {
  try {
    await UserModel.sync({ force: true }); // This will drop the table and recreate it

    for (const userData of seedData) {
      await UserModel.create(userData);
    }

    console.log("Seed data inserted successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await UserModel.sequelize.close();
  }
};

seedDatabase();
