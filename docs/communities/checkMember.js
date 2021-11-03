/**
 * @swagger
 * /communities/{communityId}/checkmember/{userId}:
 *   description: Check member
 *   parameters:
 *     - name: communityId
 *       required: true
 *       in: path
 *       description: Community id
 *       schema:
 *         type: string
 *     - name: userId
 *       required: true
 *       in: path
 *       description: User id
 *       schema:
 *         type: string
 *   get:
 *     tags:
 *       - Community
 *     security:
 *       - jwtToken: []
 *     responses:
 *       200:
 *         description: success check member
 *       404:
 *         description: User are not member in community
 *       500:
 *         description: Internal server error
 *
 */
