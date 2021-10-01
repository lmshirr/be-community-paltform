/**
 * @swagger
 * /communities/{communityId}/posts/{postId}/comments:
 *   description: Get comment
 *   parameters:
 *     - name: communityId
 *       in: path
 *       description: community id
 *       required: true
 *       schema:
 *         type: string
 *     - name: postId
 *       in: path
 *       description: post id
 *       required: true
 *       schema:
 *         type: string
 *   get:
 *     tags:
 *       - Comment
 *     security:
 *       - jwtToken: []
 *     description: Post comment
 *     responses:
 *       200:
 *         description: success get comment in post
 *       404:
 *         description: Community or Post not found
 *       500:
 *         description: Internal server error
 *
 */
