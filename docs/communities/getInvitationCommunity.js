/**
 * @swagger
 * /communities/{communityId}/invitations:
 *   parameters:
 *     - name: communityId
 *       in: path
 *       description: community id
 *       required: true
 *       schema:
 *         type: string
 *   get:
 *     tags:
 *       - Community Invitation
 *     security:
 *       - jwtToken: []
 *     description: Get all community invitation
 *     responses:
 *       200:
 *         description: Success get all community invitation
 *       500:
 *         description: Internal server error
 *
 */
