/**
 * @swagger
 * /communities/{communityId}:
 *   parameters:
 *     - name: communityId
 *       in: path
 *       description: community id
 *       required: true
 *       schema:
 *         type: string
 *   get:
 *     description: Get community details
 *     tags:
 *       - Community
 *     security:
 *       - jwtToken: []
 *     responses:
 *       200:
 *         description: success get community detail
 *       404:
 *         description: community not found
 *       500:
 *         description: Internal server error
 *
 */
