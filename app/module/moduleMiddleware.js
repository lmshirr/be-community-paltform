const { Community_Member, Class } = require('../shared/db/models');
const { Op } = require('sequelize');
const {
    ForbiddenException,
  } = require('../shared/utils/httpExceptions');

module.exports = {
    checkAdmin: async (req, res, next) => {
        const { id: user_id } = req.user;

        try {
            const admin = await Class.findOne({
                include: [{
                  model: Community_Member,
                  where: {
                    [Op.and]: [
                      {user_id},
                      {[Op.or]: [{ role: 'owner' }, { role: 'administrator' }]},
                    ]
                  },
                }],
            });

            if (!admin) {
                throw new ForbiddenException('You dont have permission to this action!');
            }

        } catch (error) {
            return next(error);
        }

        next();
    }
};