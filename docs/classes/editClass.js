/**
 * @swagger
 * /classes/{classId}:
 *   parameters:
 *     - name: classId
 *       in: path
 *       description: class id
 *       required: true
 *       schema:
 *         type: string
 *   patch:
 *     tags:
 *       - Class
 *     security:
 *       - jwtToken: []
 *     description: Get class in community
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
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
 *               banner_pict:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Success edit/update class
 *       404:
 *         description: Class not found
 *       500:
 *         description: Internal server error
 *
 */
