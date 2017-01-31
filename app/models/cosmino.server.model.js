var bookshelf = require('../../config/bookshelf.js');

bookshelf.plugin('virtuals');

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
    tableName: "lack5_export",
    virtuals: {
      farbcode: function() {
        return this.get('artikelcode').toString().slice(-3);
      },
      typcode: function() {
        return this.get('artikelcode').toString().slice(1, -3);
      },
      verwendung: function() {
        if (this.get('io_notouch') == 1 ) {
          return 'OK';
        } else if (this.get('io_poliert') == 1) {
          return 'OK poliert';
        } else if (this.get('nacharbeit') == 1) {
          return 'NA';
        } else if (this.get('ausschuss') == 1) {
          return 'Ausschuss';
        } else {
          return 'n/a';
        }
      },
      fahrweg: function() {
        switch (this.get('Fahrweg')) {
          case 340:
            return 'Grossteil';
            break;
          case 360:
            return 'Kleinteil';
            break;
          case 331:
            return 'ET';
            break;
          default:
            return 'n/a';
        }
      },
      basis: function() {
        switch (this.get('artikelart')) {
          case '0':
            return 'Rohteil';
            break;
          case '1':
            return 'NA';
            break;
          default:
            return 'n/a';
        }
      }
    }
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
