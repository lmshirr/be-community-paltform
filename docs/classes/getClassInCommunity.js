/**
 * @swagger
 * /communities/{communityId}/classes:
 *   parameters:
 *     - name: communityId
 *       in: path
 *       description: community id
 *       required: true
 *       schema:
 *         type: string
 *   get:
 *     tags:
 *       - Class
 *     security:
 *       - jwtToken: []
 *     description: Get class in community
 *     responses:
 *       200:
 *         description: Success get class
 *       500:
 *         description: Internal server error
 *
 */
