/**
 * @swagger
 * /communities/{communityId}:
 *   parameters:
 *     - name: communityId
 *       in: path
 *       description: community id
 *       required: true
 *       schema:
 *         type: string
 *   patch:
 *     description: Update or edit community
 *     tags:
 *       - Community
 *     security:
 *       - jwtToken: []
 *     requestBody:
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
 *               community_banner:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: success update community
 *       404:
 *         description: Community not found
 *       500:
 *         description: Internal server error
 *
 */
