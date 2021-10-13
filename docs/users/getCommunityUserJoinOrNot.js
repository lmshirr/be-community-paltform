/**
 * @swagger
 * /users/{userId}/communities:
 *   parameters:
 *     - name: userId
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *     - name: status
 *       in: query
 *       required: true
 *       schema:
 *         type:
 *           object
 *         properties:
 *           status:
 *             type: string
 *         enum: [join, notJoin]
 *   get:
 *     description: Get Community that user join
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Success get google url
 *       500:
 *         description: Internal server error
 *
 */
