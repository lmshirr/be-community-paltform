/**
 * @swagger
 * /communities/{communityId}/classes/{classId}/assessments/{assessmentId}:
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
 *   put:
 *    tags:
 *    - Assessment
 *    security:
 *    - jwtToken: []
 *    description: Update assessment
 *    requestBody:
 *       required: true
 *       content:
 *           application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  title:
 *                    type: string
 *                  description:
 *                    type: string
 *                  duration:
 *                    type: integer
 *                  questions:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                        description:
 *                          type: string
 *                        choiceA:
 *                          type: string
 *                        choiceB:
 *                          type: string
 *                        choiceC:
 *                          type: string
 *                        choiceD:
 *                          type: string
 *                        correctAnswer:
 *                          type: string
 *                          enum: [A, B, C, D]
 *                      required:
 *                       - description
 *                       - choiceA
 *                       - choiceB
 *                       - choiceC
 *                       - choiceD
 *                       - correctAnswer
 *                required:
 *                 - title
 *                 - description
 *                 - duration
 *                 - questions
 *    responses:
 *      '201':
 *         description: Created
 *      '404':
 *         description: Community not found / Class not found
 *      '500':
 *         description: Internal server error
 *
 */
