exports.render = function (req, res) {
  if (process.env.NODE_ENV === 'development') {
    title = 'Agora - Dev'
  } else {
    title = 'Agora'
  }

  res.render('index', {
    title: title
  });
};
