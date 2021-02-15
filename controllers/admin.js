exports.getIndex = (req, res, next) => {
  res.status(200).render('admin-index');
};
