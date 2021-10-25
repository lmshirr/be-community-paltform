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
 *   delete:
 *     tags:
 *       - Class
 *     security:
 *       - jwtToken: []
 *     description: Get class in community
 *     responses:
 *       200:
 *         description: Success delete class
 *       404:
 *         description: Class not found
 *       500:
 *         description: Internal server error
 *
 */
