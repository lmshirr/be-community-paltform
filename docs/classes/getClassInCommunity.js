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
 *     parameters:
 *       - name: sort
 *         in: query
 *         description: class sort by recommended|newest|latest
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success get class
 *       500:
 *         description: Internal server error
 *
 */
