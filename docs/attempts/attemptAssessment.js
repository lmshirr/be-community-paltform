/**
 * @swagger
 * /communities/{communityId}/classes/{classId}/assessments/{assessmentId}/attempts:
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
 *   post:
 *    tags:
 *    - Assessment Attempt
 *    security:
 *    - jwtToken: []
 *    description: Create a new assessment attempt
 *    requestBody:
 *       required: true
 *       content:
 *           application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  startTime:
 *                    type: string
 *                required:
 *                 - startTime
 *    responses:
 *      '201':
 *         description: Created
 *      '404':
 *         description: Not found
 *      '500':
 *         description: Internal server error
 *
 */
