/* global angular */

angular.module('paintlineApp').directive('ngPrint', [function () {
  var printSection = document.getElementById('printSection')

  // If there is no printing section, create one
  if (!printSection) {
    printSection = document.createElement('div')
    printSection.id = 'printSection'
    document.body.appendChild(printSection)
  }

  function link (scope, element, attrs) {
    element.on('click', function () {
      // Clear print section
      printSection.innerHTML = ''
      var elementToPrint = document.getElementById(attrs.printElementId)
      if (elementToPrint) {
        printElement(elementToPrint)
        window.print()
      }
    })

    window.onafterprint = function () {
      //  Clean the print section
      printSection.innerHTML = ''
    }
  }

  function printElement (element) {
    // Clone the printable element
    var domClone = element.cloneNode(true)
    printSection.appendChild(domClone)
  }

  return {
    link: link,
    restrict: 'A'
  }
}])
