/**
 * @swagger
 * /communities/{communityId}/posts/{postId}:
 *   description: Delete post
 *   parameters:
 *     - name: communityId
 *       required: true
 *       in: path
 *       schema:
 *         type: string
 *     - name: postId
 *       required: true
 *       in: path
 *       schema:
 *         type: string
 *   delete:
 *     tags:
 *       - Post
 *     security:
 *       - jwtToken: []
 *     responses:
 *       200:
 *         description: Success delete post
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 *
 */
