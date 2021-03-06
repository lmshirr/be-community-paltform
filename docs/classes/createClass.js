/**
 * @swagger
 * /communities/{communityId}/classes:
 *   parameters:
 *     - name: communityId
 *       in: path
 *       description: community id
 *       required: true
 *       schema:
 *         type: string
 *   post:
 *     tags:
 *       - Class
 *     security:
 *       - jwtToken: []
 *     description: Create class comment
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               summary:
 *                 type: string
 *               about:
 *                 type: string
 *               class_banner:
 *                 type: string
 *                 format: binary
 *             required:
 *               - name
 *               - summary
 *               - about
 *               - description
 *     responses:
 *       201:
 *         description: success create class
 *       404:
 *         description: Community not found
 *       500:
 *         description: Internal server error
 *
 */
