var bookshelf = require('../../config/bookshelf.js');

exports.Artikel = function() {
  return bookshelf.Model.extend({
    tableName: "artikel"
  });
};

exports.ArtikelDaten = function() {
  return bookshelf.Model.extend({
    tableName: "artikeldaten"
  });
};

exports.Farbton = function() {
  return bookshelf.Model.extend({
      tableName: "farbton"
    });
};

exports.Export = function() {
  return bookshelf.Model.extend({
      tableName: "lack5_export"
    });
};

exports.FehlerArt = function() {
  return bookshelf.Model.extend({
      tableName: "lack5_fehlerart"
    });
};

exports.FehlerOrt = function() {
  bookshelf.Model.extend({
      tableName: "lack5_fehlerort"
    });
};

exports.FehlerOrt = function() {
  bookshelf.Model.extend({
      tableName: "lack5_fehlerort"
    });
};

exports.VersuchsObjekte = function() {
  bookshelf.Model.extend({
      tableName: "vo"
    });
};
