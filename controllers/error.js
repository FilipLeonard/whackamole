exports.get404 = (req, res, next) => {
  res.status(404).render('404');
};

exports.get500 = (req, res, next) => {
  res.status(500).render('500');
};

exports.masterErrorHandler = (error, req, res, next) => {
  console.log('mainErrorHandler middleware, handled error:', { error });
  const { status, message, data } = error;
  res.status(status || 500).json({ message, data });
};
