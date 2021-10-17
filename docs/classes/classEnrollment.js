/**
 * @swagger
 * /communities/{communityId}/classes/{classId}/enroll:
 *   parameters:
 *     - name: communityId
 *       in: path
 *       description: community id
 *       required: true
 *       schema:
 *         type: string
 *     - name: classId
 *       in: path
 *       description: class id
 *       required: true
 *       schema:
 *         type: string
 *   post:
 *     tags:
 *       - Class
 *     security:
 *       - jwtToken: []
 *     description: Create class enrollment
 *     responses:
 *       201:
 *         description: success create class enrollment
 *       400:
 *         description: You are already join class or not join community
 *       500:
 *         description: Internal server error
 *
 */
