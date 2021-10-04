/**
 * @swagger
 * /communities/{communityId}/invitations/{invitationId}:
 *   parameters:
 *     - name: communityId
 *       in: path
 *       description: community id
 *       required: true
 *       schema:
 *         type: string
 *     - name: invitationId
 *       in: path
 *       description: invitation id
 *       required: true
 *       schema:
 *         type: string
 *   delete:
 *     tags:
 *       - Community Invitation
 *     security:
 *       - jwtToken: []
 *     description: Delete invitation
 *     responses:
 *       200:
 *         description: Success delete invitation
 *       404:
 *         description: Community or Invitation not found
 *       500:
 *         description: Internal server error
 *
 */
