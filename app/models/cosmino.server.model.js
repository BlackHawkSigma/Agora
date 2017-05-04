var bookshelf = require('../../config/bookshelf.js')()
var codes = require('../../config/global/const.js')

var Artikel = bookshelf.Model.extend({
  tableName: 'artikel'
})
exports.Artikel = function () {
  return Artikel
}

var ArtikelDaten = bookshelf.Model.extend({
  tableName: 'artikeldaten'
})
exports.ArtikelDaten = function () {
  return ArtikelDaten
}

var Farbton = bookshelf.Model.extend({
  tableName: 'farbton'
})
exports.Farbton = function () {
  return Farbton
}

var Export = bookshelf.Model.extend({
  tableName: 'lack5_export',
  virtuals: {
    farbcode: function () {
      if (this.get('artikelcode') !== undefined) {
        return this.get('artikelcode').toString().slice(-3)
      } else {
        return null
      }
    },
    typcode: function () {
      if (this.get('artikelcode') !== undefined) {
        return this.get('artikelcode').toString().slice(1, -3)
      } else {
        return null
      }
    },
    verwendung: function () {
      if (this.get('io_notouch') === 1) {
        return 'OK'
      } else if (this.get('io_poliert') === 1) {
        return 'OK poliert'
      } else if (this.get('nacharbeit') === 1) {
        return 'NA'
      } else if (this.get('ausschuss') === 1) {
        return 'Ausschuss'
      } else {
        return 'n/a'
      }
    },
    fahrweg: function () {
      switch (this.get('Fahrweg')) {
        case 340:
        case 360:
          return 'Normal'
        case 331:
          return 'ET'
        default:
          return 'n/a'
      }
    },
    basis: function () {
      switch (this.get('artikelart')) {
        case '0':
          return 'Rohteil'
        case '1':
          return 'NA'
        default:
          return 'n/a'
      }
    },
    artikelart: function () {
      switch (this.get('Fahrweg')) {
        case 340:
        case 331:
          return 'Großteil'
        case 360:
          return 'Kleinteil'
        default:
          return 'n/a'
      }
    }
  },
  fehlerart: function () {
    return this.hasOne(FehlerArt, 'fehlerart_code', 'fehlerart_code')
  },
  fehlerort: function () {
    return this.belongsTo(FehlerOrt, 'fehlerort_code', 'fehlerort_code')
  },
  artikeldaten: function () {
    return this.hasOne(ArtikelDaten, 'materialnummer', 'artikelcode')
  }
})
exports.Export = function () {
  return Export
}

var FehlerArt = bookshelf.Model.extend({
  tableName: 'lack5_fehlerart',
  fehlerart: function () {
    return this.belongsToMany(Export, 'fehlerart_code', 'fehlerart_code')
  }
})
exports.FehlerArt = function () {
  return FehlerArt
}

var FehlerOrt = bookshelf.Model.extend({
  tableName: 'lack5_fehlerort'
})
exports.FehlerOrt = function () {
  return FehlerOrt
}

var VersuchsObjekte = bookshelf.Model.extend({
  tableName: 'vo'
})
exports.VersuchsObjekte = function () {
  return VersuchsObjekte
}

var Rejections = bookshelf.Model.extend({
  tableName: 'nachkontrolle',
  virtuals: {
    verwendung: function () {
      return codes.rejections.decisionCodes[this.get('bewertung') - 1]
    }
  },
  artikel: function () {
    return this.belongsTo(Export, 'barcode', 'barcode')
  },
  fehlerart: function () {
    return this.hasOne(FehlerArt, 'fehlerart_code', 'fehlerart_code')
  }
})
exports.Rejections = function () {
  return Rejections
}
