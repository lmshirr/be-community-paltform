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
 *   patch:
 *     description: Respond invitation
 *     tags:
 *       - Community Invitation
 *     security:
 *       - jwtToken: []
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                respond:
 *                  type: string
 *              required:
 *                - respond
 *     responses:
 *       200:
 *         description: Success respond invitation
 *       403:
 *         description: User not allowed to do this action
 *       404:
 *         description: Community or member not found
 *       500:
 *         description: Internal server error
 *
 */
