// Assessment routes
communityRouter.get(
    '/:id/classes/:classId/assessments',
    classMiddleware.checkMembership,
    assessmentController.getAssessments
);
communityRouter.get(
    '/:id/classes/:classId/assessments/:assessmentId',
    classMiddleware.checkMembership,
    assessmentController.getAssessmentDetail
);
communityRouter.post(
    '/:id/classes/:classId/assessments',
    authorizationMiddleware.checkLogin,
    classMiddleware.checkAdmin_video_module,
    assessmentController.addAssessment
);
communityRouter.put(
    '/:id/classes/:classId/assessments/:assessmentId',
    authorizationMiddleware.checkLogin,
    classMiddleware.checkAdmin_video_module,
    assessmentController.editAssessment
);
communityRouter.delete(
    '/:id/classes/:classId/assessments/:assessmentId',
    authorizationMiddleware.checkLogin,
    classMiddleware.checkAdmin_video_module,
    assessmentController.deleteAssessment
);

// Assessment Attempt
communityRouter.get(
    '/:id/classes/:classId/assessments/:assessmentId/attempts',
    authorizationMiddleware.checkLogin,
    classMiddleware.checkAdmin_video_module,
    attemptController.getAttempts
);
communityRouter.get(
    '/:id/classes/:classId/assessments/:assessmentId/attempts/:attemptId',
    authorizationMiddleware.checkLogin,
    classMiddleware.checkAdmin_video_module,
    attemptController.getAttemptDetail
);
// communityRouter.get(
//   '/:id/classes/:classId/assessments/:assessmentId/attempts/my',
//   classMiddleware.checkMembership,
//   attemptController.getMyAttempt
// );
communityRouter.post(
    '/:id/classes/:classId/assessments/:assessmentId/attempts',
    classMiddleware.checkMembership,
    attemptController.addAttempt
);
communityRouter.put(
    '/:id/classes/:classId/assessments/:assessmentId/attempts/:attemptId',
    classMiddleware.checkMembership,
    attemptController.completeAttempt
);
communityRouter.delete(
    '/:id/classes/:classId/assessments/:assessmentId/attempts/:attemptId',
    authorizationMiddleware.checkLogin,
    classMiddleware.checkAdmin_video_module,
    attemptController.deleteAttempt
);