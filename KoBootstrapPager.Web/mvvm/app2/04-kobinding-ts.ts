(<any>ko.subscribable.fn).subscribeChanged = function (callback) {
    var previousValue;
    this.subscribe(function (_previousValue) {
        previousValue = _previousValue;
    }, undefined, 'beforeChange');
    this.subscribe(function (latestValue) {
        callback(latestValue, previousValue);
    });
};

((): void => {
    "use strict";

    var $element = $("#clinsDiv");
    ko.cleanNode($element[0]);
    var clinSvc = new App.ClinService();
    ko.applyBindings(new App.ClinViewModel(clinSvc, 125000), $element[0]);
})();
