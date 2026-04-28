const NotificationRead = require('../models/NotificationRead');
const { Op } = require('sequelize');

const getReadMapForUser = async (userId, notificationKeys = []) => {
  if (!notificationKeys || notificationKeys.length === 0) return {};

  const rows = await NotificationRead.findAll({
    where: {
      User_ID: userId,
      NotificationKey: { [Op.in]: notificationKeys },
    },
  });

  return rows.reduce((map, row) => {
    map[row.NotificationKey] = !!row.Read;
    return map;
  }, {});
};

const markNotificationKeyAsRead = async (userId, notificationKey) => {
  if (!notificationKey) return;

  await NotificationRead.upsert({
    User_ID: userId,
    NotificationKey: notificationKey,
    Read: true,
    Read_At: new Date(),
  });
};

const markNotificationKeysAsRead = async (userId, notificationKeys = []) => {
  if (!notificationKeys || notificationKeys.length === 0) return 0;

  await Promise.all(
    notificationKeys.map((NotificationKey) =>
      NotificationRead.upsert({
        User_ID: userId,
        NotificationKey,
        Read: true,
        Read_At: new Date(),
      })
    )
  );

  return notificationKeys.length;
};

module.exports = {
  getReadMapForUser,
  markNotificationKeyAsRead,
  markNotificationKeysAsRead,
};
