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
 *     - name: user_id
 *       in: query
 *       description: User id want to invite to community
 *       required: true
 *       schema:
 *         type: string
 *   post:
 *     description: Invite new member to community
 *     tags:
 *       - Community Invitation
 *     security:
 *       - jwtToken: []
 *     responses:
 *       201:
 *         description: Success invite user
 *       403:
 *         description: Forbidden, you already invite this user on this community
 *       409:
 *         description: User already member
 *       500:
 *         description: Internal server error
 *
 */
