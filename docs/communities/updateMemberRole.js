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
 *   patch:
 *     description: Update member role
 *     tags:
 *       - Community
 *     security:
 *       - jwtToken: []
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                role:
 *                  type: string
 *              required:
 *                - role
 *     responses:
 *       200:
 *         description: Success respond request
 *       400:
 *         description: Bad request error
 *       403:
 *         description: User not allowed to do this action
 *       404:
 *         description: Member not found
 *       500:
 *         description: Internal server error
 *
 */
