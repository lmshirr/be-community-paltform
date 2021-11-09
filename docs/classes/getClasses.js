/**
 * @swagger
 * /classes:
 *   get:
 *     tags:
 *       - Class
 *     security:
 *       - jwtToken: []
 *     description: Get class by sort
 *     parameters:
 *       - name: sort
 *         in: query
 *         description: class sort by upload_date | category
 *         required: true
 *         schema:
 *           type: string
 *       - name: value
 *         in: query
 *         description: class sort by newest | latest | <categoryType>
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success get class
 *       500:
 *         description: Internal server error
 *
 */
