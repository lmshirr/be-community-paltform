/**
 * @swagger
 * /communities/{communityId}/requests:
 *   parameters:
 *     - name: communityId
 *       in: path
 *       description: community id
 *       required: true
 *       schema:
 *         type: string
 *   get:
 *     tags:
 *       - Community
 *     security:
 *       - jwtToken: []
 *     description: Get all member request
 *     responses:
 *       200:
 *         description: Success get all member request
 *       500:
 *         description: Internal server error
 *
 */
