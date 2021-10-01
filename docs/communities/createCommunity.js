/**
 * @swagger
 * /communities:
 *   description: Create community
 *   post:
 *     tags:
 *       - Community
 *     security:
 *       - jwtToken: []
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
 *               privacy:
 *                 type: string
 *               type:
 *                 type: string
 *               community_pict:
 *                 type: string
 *                 format: binary
 *             required:
 *               - name
 *               - description
 *               - privacy
 *               - type
 *     responses:
 *       201:
 *         description: success create community
 *       500:
 *         description: Internal server error
 *
 */
