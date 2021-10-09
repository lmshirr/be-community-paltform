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
 *   post:
 *     tags:
 *       - Class
 *     security:
 *       - jwtToken: []
 *     description: Create class comment
 *     responses:
 *       201:
 *         description: success create class
 *       404:
 *         description: Community not found
 *       500:
 *         description: Internal server error
 *
 */
