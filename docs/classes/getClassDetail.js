/**
 * @swagger
 * /classes/{classId}:
 *   parameters:
 *     - name: classId
 *       in: path
 *       description: Class id
 *       required: true
 *       schema:
 *         type: string
 *   get:
 *     tags:
 *       - Class
 *     security:
 *       - jwtToken: []
 *     description: Get class detail
 *     parameters:
 *       - name: meta
 *         in: query
 *         description: Meta (check_enrollment)
 *         required: false
 *         schema:
 *           type: string
 *       - name: user_id
 *         in: query
 *         description: User id
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success get class
 *       403:
 *         description: Forbidden not member in community
 *       500:
 *         description: Internal server error
 *
 */
