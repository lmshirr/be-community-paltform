/**
 * @swagger
 * /communities/{communityId}/posts/{postId}/comments:
 *   description: Post comment
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
 *   post:
 *     tags:
 *       - Comment
 *     security:
 *       - jwtToken: []
 *     description: Post comment
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               body:
 *                 type: string
 *               comment_pict:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: success create comment
 *       404:
 *         description: Community or Post not found
 *       500:
 *         description: Internal server error
 *
 */
