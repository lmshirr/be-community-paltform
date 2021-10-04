/**
 * @swagger
 * /communities/{communityId}/posts/{postId}:
 *   description: Get post detail
 *   parameters:
 *     - name: communityId
 *       in: path
 *       required: true
 *       description: community id
 *       schema:
 *         type: string
 *     - name: postId
 *       in: path
 *       required: true
 *       description: post id
 *       schema:
 *         type: string
 *   get:
 *     tags:
 *       - Post
 *     security:
 *       - jwtToken: []
 *     responses:
 *       200:
 *         description: Success get community post detail
 *       500:
 *         description: Internal server error
 *
 */
