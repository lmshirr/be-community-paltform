/**
 * @swagger
 * /communities/{communityId}/requests/{requestId}:
 *   parameters:
 *     - name: communityId
 *       in: path
 *       description: community id
 *       required: true
 *       schema:
 *         type: string
 *     - name: requestId
 *       in: path
 *       description: request id
 *       required: true
 *       schema:
 *         type: string
 *   patch:
 *     description: Respond request
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
 *                respond:
 *                  type: string
 *              required:
 *                - respond
 *     responses:
 *       200:
 *         description: Success respond request
 *       403:
 *         description: User not allowed to do this action
 *       404:
 *         description: Request not found
 *       500:
 *         description: Internal server error
 *
 */
