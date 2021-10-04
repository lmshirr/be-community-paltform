/**
 * @swagger
 * /communities/{communityId}/join:
 *   parameters:
 *     - name: communityId
 *       in: path
 *       description: community id
 *       required: true
 *       schema:
 *         type: string
 *   post:
 *     tags:
 *       - Community
 *     security:
 *       - jwtToken: []
 *     description: Join community, if community private is open, user tobe member, if private is closed send request join to community admin
 *     responses:
 *       200:
 *         description: Success request/join community
 *       403:
 *         description: User already request join
 *       404:
 *         description: Community not found
 *       409:
 *         description: User already member on this community
 *       500:
 *         description: Internal server error
 *
 */
