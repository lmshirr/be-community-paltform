/**
 * @swagger
 * /classes/{classId}/assessments/{assessmentId}:
 *   parameters:
 *    - name: communityId
 *      in: path
 *      description: community id
 *      required: true
 *      schema:
 *        type: string
 *    - name: classId
 *      in: path
 *      description: class id
 *      required: true
 *      schema:
 *        type: string
 *    - name: assessmentId
 *      in: path
 *      description: assessment id
 *      required: true
 *      schema:
 *        type: string
 *   delete:
 *     tags:
 *       - Assessment
 *     security:
 *       - jwtToken: []
 *     description: Delete assessment from class
 *     responses:
 *       200:
 *         description: Success delete assessment
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 *
 */
