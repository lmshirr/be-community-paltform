/**
 * @swagger
 * /classes/{classId}/assessments/{assessmentId}/attempts:
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
 *   get:
 *    tags:
 *      - Assessment Attempt
 *    security:
 *      - jwtToken: []
 *    description: Get all assessment attempt data
 *    responses:
 *      '200':
 *         description: Success
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *           properties:
 *            success:
 *             type: boolean
 *            data:
 *             type: object
 *             properties:
 *              title:
 *                type: string
 *              description:
 *                type: string
 *              duration:
 *                type: integer
 *              questions:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    description:
 *                      type: string
 *                    choiceA:
 *                      type: string
 *                    choiceB:
 *                      type: string
 *                    choiceC:
 *                      type: string
 *                    choiceD:
 *                      type: string
 *                    correctAnswer:
 *                      type: string
 *                      enum: [A, B, C, D]
 *      '404':
 *         description: Not found
 *      '500':
 *         description: Internal server error
 *
 */
