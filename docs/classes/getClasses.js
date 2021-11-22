/**
 * @swagger
 * /classes:
 *   get:
 *     tags:
 *       - Class
 *     security:
 *       - jwtToken: []
 *     description: Get classes by sort
 *     parameters:
 *       - name: sort
 *         in: query
 *         description: classes sort by newest | recommended
 *         required: true
 *         schema:
 *           type: string
 *       - name: type
 *         in: query
 *         description: classes sort by community type
 *         required: true
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success get classes
 *       500:
 *         description: Internal server error
 *
 */
