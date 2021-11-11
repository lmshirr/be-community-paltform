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
 *      description: assessment id
 *      required: true
 *      schema:
 *        type: string
 *    - name: attemptId
 *      in: path
 *      description: The id of the attempt
 *      required: true
 *      schema:
 *        type: string
 *   put:
 *    tags:
 *    - Assessment Attempt
 *    security:
 *    - jwtToken: []
 *    description: Complete assessment attempt
 *    requestBody:
 *       required: true
 *       content:
 *           application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  finishTime:
 *                    type: string
 *                  questions:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string\
 *                        choosedAnswer:
 *                          type: string
 *                          enum: [A, B, C, D]
 *                      required:
 *                       - description
 *                       - choosedAnswer
 *                required:
 *                 - finishTime
 *                 - questions
 *    responses:
 *      '201':
 *         description: Created
 *      '404':
 *         description: Not found
 *      '500':
 *         description: Internal server error
 *
 */
