/**
 * @swagger
 * /communities/{communityId}/classes/{classId}/assessments:
 *   parameters:
 *    - name: communityId
 *      in: path
 *      description: The id of the community
 *      required: true
 *      type: string
 *    - name: classId
 *      in: path
 *      description: The id of the class
 *      required: true
 *      type: string
 *
 *  post:
 *   tags:
 *   - Assessment
 *   security:
 *   - jwtToken: []
 *   description: Create a new class assessment
 *   requestBody:
 *      required: true
 *      content:
 *          application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 duration:
 *                   type: integer
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       description:
 *                         type: string
 *                       choiceA:
 *                         type: string
 *                       choiceB:
 *                         type: string
 *                       choiceC:
 *                         type: string
 *                       choiceD:
 *                         type: string
 *                       correctAnswer:
 *                         type: string
 *                         enum: [A, B, C, D]
 *                     required:
 *                      - description
 *                      - choiceA
 *                      - choiceB
 *                      - choiceC
 *                      - choiceD
 *                      - correctAnswer
 *               required:
 *                - title
 *                - description
 *                - duration
 *                - questions
 *   responses:
 *     '201':
 *        description: Created
 *     '404':
 *        description: Community not found / Class not found
 *     '500':
 *        description: Internal server error
 *
 */
