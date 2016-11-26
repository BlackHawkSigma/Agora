exports.render = function (req, res) {
  res.render('index', {
    title: 'Paintshop 5 App',
    content: 'this content is served from express.'
  });
};
