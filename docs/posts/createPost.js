/**
 * @swagger
 * /communities/{communityId}/posts:
 *   description: Create post
 *   parameters:
 *     - name: communityId
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *   post:
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
 *     responses:
 *       201:
 *         description: Success create post
 *       500:
 *         description: Internal server error
 *
 */
