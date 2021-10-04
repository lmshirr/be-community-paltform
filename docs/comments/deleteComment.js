/**
 * @swagger
 * /communities/{communityId}/posts/{postId}/comments/{commentId}:
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
 *     - name: commentId
 *       in: path
 *       description: comment id
 *       required: true
 *       schema:
 *         type: string
 *   delete:
 *     tags:
 *       - Comment
 *     security:
 *       - jwtToken: []
 *     description: Delete comment
 *     responses:
 *       200:
 *         description: success delete comment
 *       404:
 *         description: Community or Post not found
 *       500:
 *         description: Internal server error
 *
 */
