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
 *   delete:
 *     tags:
 *       - Community
 *     security:
 *       - jwtToken: []
 *     description: Delete community
 *     responses:
 *       200:
 *         description: Success delete community
 *       404:
 *         description: Community or Post not found
 *       500:
 *         description: Internal server error
 *
 */
