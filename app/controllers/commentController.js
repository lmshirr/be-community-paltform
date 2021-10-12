const commentService = require('../services/commentServices');

module.exports.postComment = async (req, res, next) => {
  const { postId: post_id } = req.params;
  const { body } = req.body;
  const { id: member_id } = req.member;
  const { file } = req;

  let comment;
  try {
    comment = await commentService.postComment(
      { post_id, member_id, body },
      file
    );

    const commentId = comment.dataValues.id;

    comment = await commentService.getCommentDetail(commentId);
  } catch (error) {
    return next(error);
  }

  return res.status(201).json({ message: 'Comment created', data: comment });
};

module.exports.getComments = async (req, res, next) => {
  const { postId: post_id } = req.params;

  let comments;

  try {
    comments = await commentService.getComments({ post_id });
  } catch (error) {
    return next(error);
  }

  return res.json({ data: comments });
};

module.exports.deleteComment = async (req, res, next) => {
  const { commentId } = req.params;

  let comment;
  try {
    comment = await commentService.deleteComment(commentId);
  } catch (error) {
    return next(error);
  }

  return res.json({ message: 'Comment deleted', data: comment });
};
