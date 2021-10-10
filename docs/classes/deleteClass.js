/**
 * @swagger
 * /communities/{communityId}/classes/{classId}:
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
