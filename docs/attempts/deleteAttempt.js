/**
 * @swagger
 * /classes/{classId}/assessments/{assessmentId}/attempts/{attemptId}:
 *   parameters:
 *    - name: communityId
 *      in: path
 *      description: The id of the community
 *      required: true
 *      schema:
 *        type: string
 *    - name: classId
 *      in: path
 *      description: The id of the class
 *      required: true
 *      schema:
 *        type: string
 *    - name: assessmentId
 *      in: path
 *      description: The id of the assessment
 *      required: true
 *      schema:
 *        type: string
 *    - name: attemptId
 *      in: path
 *      description: The id of the attempt
 *      required: true
 *      schema:
 *        type: string
 *   delete:
 *     tags:
 *       - Assessment Attempt
 *     security:
 *       - jwtToken: []
 *     description: Delete assessment attempt
 *     responses:
 *       200:
 *         description: Success delete attempt
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 *
 */
