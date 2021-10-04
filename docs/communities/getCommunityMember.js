/**
 * @swagger
 * /communities/{communityId}/memberships:
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
 *     description: Get all member in community
 *     responses:
 *       200:
 *         description: Success get all member in community
 *       500:
 *         description: Internal server error
 *
 */
