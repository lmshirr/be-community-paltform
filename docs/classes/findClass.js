/**
 * @swagger
 * /communities/{communityId}/classes/search:
 *   parameters:
 *     - name: communityId
 *       in: path
 *       description: community id
 *       required: true
 *       schema:
 *         type: string
 *     - name: key
 *       in: query
 *       description: class name
 *       required: true
 *       schema:
 *         type: string
 *   get:
 *     tags:
 *       - Class
 *     security:
 *       - jwtToken: []
 *     description: Search a class in community
 *     responses:
 *       200:
 *         description: Success get class
 *       500:
 *         description: Internal server error
 *
 */
