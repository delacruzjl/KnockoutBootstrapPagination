((): void => {
    "use strict";

    var $element = $("#clinsDiv");
    ko.cleanNode($element[0]);
    var clinSvc = new App.ClinService();
    ko.applyBindings(new App.ClinViewModel(clinSvc, 125000), $element[0]);
})();
