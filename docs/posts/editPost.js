/**
 * @swagger
 * /communities/{communityId}/posts/{postId}:
 *   description: Edit post
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
 *   patch:
 *     tags:
 *       - Post
 *     security:
 *       - jwtToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               attachments:
 *                 type: string
 *                 format: binary
 *             required:
 *               - content
 *               - attachments
 *     responses:
 *       200:
 *         description: Success update post
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 *
 */
