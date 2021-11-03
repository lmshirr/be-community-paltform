/**
 * @swagger
 * /communities:
 *   description: Get communities
 *   get:
 *     tags:
 *       - Community
 *     security:
 *       - jwtToken: []
 *     parameters:
 *       - name: filter
 *         in: query
 *         required: false
 *         description: filtering
 *         schema:
 *           type: string
 *       - name: value
 *         in: query
 *         required: false
 *         description: filter value
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: success get all community
 *       500:
 *         description: Internal server error
 *
 */
