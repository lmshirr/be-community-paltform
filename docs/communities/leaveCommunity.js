/**
 * @swagger
 * /communities/{communityId}/memberships/{memberId}:
 *   parameters:
 *     - name: communityId
 *       in: path
 *       description: community id
 *       required: true
 *       schema:
 *         type: string
 *     - name: memberId
 *       in: path
 *       description: member id
 *       required: true
 *       schema:
 *         type: string
 *   delete:
 *     description: Delete invitation, if user role owner must change ownership first
 *     tags:
 *       - Community
 *     security:
 *       - jwtToken: []
 *     responses:
 *       200:
 *         description: Success leave community
 *       403:
 *         description: User not allowed to do this action
 *       404:
 *         description: Member not found
 *       500:
 *         description: Internal server error
 *
 */
