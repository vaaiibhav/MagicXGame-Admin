const { GudGudiModel, GudGudiWinningsModel, UserModel } = require("../models");
const { dangerConsole, successConsole } = require("../utils/colorConsoler");
const {
  TYPE_SUBADMIN,
  TYPE_ADMIN,
  TYPE_RETAILER,
  TYPE_MASTER,
} = require("../constants");
const getJhandiMundaBets = async (userObject) => {
  const { userLoginID, userType } = userObject;
  console.log({ userLoginID, userType });
  if (userType === TYPE_ADMIN) {
    const result = await GudGudiModel.findAll({
      order: [["gudGudiBetID", "DESC"]],
      include: [
        {
          model: GudGudiWinningsModel,
          attributes: ["winningNumberID", "slot0TotalBets", "slot1TotalBets"],
          where: {
            /* any conditions you want to apply to the included model */
          },
        },
      ],
    });
    // const rowsData = result.map((instance) => instance.get());

    return result;
  }
  if (userType === TYPE_SUBADMIN) {
    const subAdminUsers = UserModel.findAll({ where: userLoginID });
    console.log("subAdminUsers:", subAdminUsers);
    return GudGudiModel.findAll();
  }
  if (userType === TYPE_MASTER) {
    return GudGudiModel.findAll();
  }
};
module.exports = {
  getJhandiMundaBets,
};
