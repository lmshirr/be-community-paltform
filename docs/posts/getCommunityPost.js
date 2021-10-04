/**
 * @swagger
 * /communities/{communityId}/posts:
 *   description: Get community post
 *   parameters:
 *     - name: communityId
 *       in: path
 *       required: true
 *       description: community id
 *       schema:
 *         type: string
 *   get:
 *     tags:
 *       - Post
 *     security:
 *       - jwtToken: []
 *     responses:
 *       200:
 *         description: Success get community post
 *       500:
 *         description: Internal server error
 *
 */
