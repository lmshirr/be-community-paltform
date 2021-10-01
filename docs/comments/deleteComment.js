/**
 * @swagger
 * /communities/{communityId}/posts/{postId}/comments:
 *   description: Delete comment
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
