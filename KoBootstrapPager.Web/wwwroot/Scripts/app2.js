(function (koFn) {
    koFn.subscribeChanged = function (callback) {
        var previousValue;
        this.subscribe(function (_previousValue) {
            previousValue = _previousValue;
        }, undefined, 'beforeChange');
        this.subscribe(function (latestValue) {
            callback(latestValue, previousValue);
        });
    };
})(ko.subscribable.fn);
var App;
(function (App) {
    "use strict";
    var ClinService = /** @class */ (function () {
        function ClinService() {
        }
        //TODO: to be removed
        ClinService.prototype.generateFakeData = function () {
            var data = [];
            for (var i = 0; i < 10; i++) {
                var cat = {
                    id: i,
                    categoryName: "category + " + i
                };
                data.push(cat);
            }
            return data;
        };
        ClinService.prototype.getAvailableCategories = function () {
            var dfd = $.Deferred();
            //TODO: to be removed
            var data = this.generateFakeData();
            //TODO: pending backend
            dfd.resolve(data);
            return dfd.promise();
        };
        ClinService.prototype.addSingleEntry = function (clin) {
            var dfd = $.Deferred();
            //TODO: pending backend
            dfd.resolve(clin);
            return dfd.promise();
        };
        ClinService.prototype.updateSingleEntry = function (clin) {
            var dfd = $.Deferred();
            //TODO: pending backend
            dfd.resolve(clin);
            return dfd.promise();
        };
        ClinService.prototype.removeSingleEntry = function (clin) {
            var dfd = $.Deferred();
            //TODO: pending backend
            dfd.resolve();
            return dfd.promise();
        };
        return ClinService;
    }());
    App.ClinService = ClinService;
})(App || (App = {}));
var App;
(function (App) {
    "use strict";
    var Category = /** @class */ (function () {
        function Category(id, name) {
            this.id = ko.observable(id);
            this.categoryName = ko.observable(name);
        }
        return Category;
    }());
    App.Category = Category;
})(App || (App = {}));
var App;
(function (App) {
    "use strict";
    var Slin = /** @class */ (function () {
        function Slin(category, amount, percentage) {
            var self = this;
            self.category = ko.observable(category);
            self.slinPercent = ko.observable(percentage || 0);
            self.slinAmount = ko.observable(amount || 0);
        }
        return Slin;
    }());
    App.Slin = Slin;
})(App || (App = {}));
var App;
(function (App) {
    "use strict";
    var Clin = /** @class */ (function () {
        function Clin(id, amount, percentage, slins) {
            this.id = id;
            this.amount = amount;
            this.percentage = percentage;
            var self = this;
            self.clinId = ko.observable(id || "");
            self.clinAmount = ko.observable(amount || 0);
            self.clinPercentage = ko.observable(percentage || 0);
            self.slins = ko.observableArray(slins || []);
            self.editMode = ko.observable(false);
        }
        return Clin;
    }());
    App.Clin = Clin;
})(App || (App = {}));
var App;
(function (App) {
    "use strict";
    var ClinViewModel = /** @class */ (function () {
        function ClinViewModel(svc, fakeTotalAmount) {
            this.svc = svc;
            var self = this;
            self.$slinModal = $("#slinModal");
            self.totalAwardedAmountAndReimbursed = ko.observable(fakeTotalAmount);
            self.clin = ko.observable(new App.Clin());
            self.clins = ko.observableArray([]);
            self.slin = ko.observable(new App.Slin());
            self.editedClin = ko.observable(new App.Clin());
            self.clinRemaining = ko.computed(calculateRemaining, self);
            self.updateClinAmount = updateClinAmount;
            self.updateClinPercent = updateClinPercent;
            self.validClin = ko.computed(validClin, self);
            self.addClin = addClin;
            self.removeClin = removeClin;
            self.updateClin = updateClin;
            self.toggleClinEditMode = toggleClinEditMode;
            self.undoClinChanges = undoClinChanges;
            self.addSlinToClin = addSlinToClin;
            self.openSlinEditorModal = openSlinEditorModal;
            self.updateSlinAmount = updateSlinAmount;
            self.updateSlinPercent = updateSlinPercent;
            self.availableCategories = ko.observableArray([]);
            self.validSlin = validSlin;
            self.validUpdateClin = validUpdateClin;
            self.visibleAddSlin = visibleAddSlin;
            self.removeSlinToClin = removeSlinToClin;
            var editIndex = -1;
            var previousAmount = 0;
            function calculateRemaining() {
                var self = this;
                if (self.clins().length === 0) {
                    return self.totalAwardedAmountAndReimbursed();
                }
                var amounts = 0;
                $.each(self.clins(), function (idx, elm) {
                    if (elm !== self.clin()) {
                        amounts += parseFloat(elm.clinAmount().toString());
                    }
                });
                var remaining = self.totalAwardedAmountAndReimbursed() - amounts;
                return remaining >= 0 ? remaining : 0;
            }
            function updateClinAmount(vm) {
                var clin = vm;
                if (typeof vm.clin === "function") {
                    clin = vm.clin();
                }
                watchChanges(clin);
                var amount = self.totalAwardedAmountAndReimbursed() * (clin.clinPercentage() / 100);
                clin.clinAmount(amount);
            }
            function updateClinPercent(vm) {
                var clin = vm;
                if (typeof vm.clin === "function") {
                    clin = vm.clin();
                }
                watchChanges(clin);
                var percent = (clin.clinAmount() * 100) / self.totalAwardedAmountAndReimbursed();
                clin.clinPercentage(percent);
            }
            function watchChanges(clin) {
                clin.clinAmount.subscribeChanged(function (latestValue, previousValue) {
                    previousAmount = previousValue;
                });
            }
            function validClin() {
                return validUpdateClin(self.clin());
            }
            function addClin() {
                var clinItem = JSON.parse(ko.toJSON(self.clin()));
                saveClinItem(clinItem);
                function saveClinItem(clinItem) {
                    var request = self.svc.addSingleEntry(clinItem);
                    request.done(refreshList);
                    request.fail(errorHandler);
                    function refreshList(clin) {
                        self.clins.push(ko.mapping.fromJS(clin));
                        self.clin(new App.Clin());
                        toastr.success("Done inserting", "AddClin");
                    }
                }
            }
            function removeClin(clin) {
                var clinItem = JSON.parse(ko.toJSON(clin));
                var request = self.svc.removeSingleEntry(clinItem);
                request.done(refreshList);
                request.fail(errorHandler);
                function refreshList() {
                    self.clins.remove(clin);
                    self.clin(new App.Clin());
                    toastr.success("Done removing", "removeClin");
                }
            }
            function updateClin(clin) {
                var clinItem = JSON.parse(ko.toJSON(clin));
                var request = self.svc.updateSingleEntry(clinItem);
                request.done(refreshList);
                request.fail(errorHandler);
                function refreshList() {
                    toggleClinEditMode(clin);
                    self.clin(new App.Clin());
                    toastr.success("Done updating", "removeClin");
                }
            }
            function toggleClinEditMode(clin) {
                self.editedClin(clin);
                var currMode = !clin.editMode();
                clin.editMode(currMode);
            }
            function undoClinChanges(clin) {
                clin.clinId(self.editedClin().clinId());
                clin.clinAmount(previousAmount);
                var percent = (self.editedClin().clinAmount() * 100) / self.totalAwardedAmountAndReimbursed();
                clin.clinPercentage(percent);
                clin.editMode(false);
            }
            function addSlinToClin() {
                self.editedClin().slins.push(self.slin());
                var clinItem = JSON.parse(ko.toJSON(self.editedClin));
                updateClinItem(clinItem);
            }
            function removeSlinToClin(clin, slin) {
                clin.slins.remove(slin);
                updateClinItem(ko.mapping.toJS(clin));
            }
            function updateClinItem(clinItem) {
                var request = svc.updateSingleEntry(clinItem);
                request.done(refreshList);
                request.fail(errorHandler);
                function refreshList(clin) {
                    var arr = self.clins();
                    arr[editIndex] = ko.mapping.fromJS(clin);
                    self.clins(arr);
                    self.slin(new App.Slin(arr[editIndex]));
                    self.$slinModal.modal("hide");
                    toastr.info("Done updating, new SLIN added", "updateClinItem");
                }
            }
            function openSlinEditorModal(clin) {
                var request = svc.getAvailableCategories();
                request.done(populateModal);
                request.fail(errorHandler);
                function populateModal(categories) {
                    self.availableCategories([]);
                    $.each(categories, function (idx, elm) {
                        var cat = JSON.parse(ko.toJSON(elm));
                        self.availableCategories.push(cat);
                    });
                    toastr.info("Done refreshing categories", "openSlinEditorModal");
                    editIndex = self.clins.indexOf(clin);
                    self.editedClin(clin);
                    self.$slinModal.modal("show");
                }
            }
            function updateSlinAmount() {
                var slin = self.slin();
                var amount = self.editedClin().clinAmount() * (slin.slinPercent() / 100);
                slin.slinAmount(amount);
            }
            function updateSlinPercent() {
                var slin = self.slin();
                var percent = (slin.slinAmount() * 100) / self.editedClin().clinAmount();
                slin.slinPercent(percent);
            }
            function validUpdateClin(clin) {
                return !!clin.clinId && clin.clinId().length > 0 &&
                    !!clin.clinAmount &&
                    parseFloat(clin.clinAmount().toString()) > 0 &&
                    (self.clinRemaining() - parseFloat(clin.clinAmount().toString())) >= 0;
            }
            function validSlin() {
                var clin = self.editedClin();
                var amount = clin.clinAmount() -
                    self.slin().slinAmount();
                $.each(clin.slins(), function (idx, elm) {
                    amount -= parseFloat(elm.slinAmount().toString());
                });
                return !!self.slin() &&
                    !!self.slin().category() &&
                    self.slin().category().id() > 0 &&
                    self.slin().slinAmount() > 0 &&
                    amount >= 0;
            }
            function visibleAddSlin(clin) {
                var amount = clin.clinAmount();
                $.each(clin.slins(), function (idx, elm) {
                    amount -= parseFloat(elm.slinAmount().toString());
                });
                return amount > 0;
            }
            function errorHandler() {
                toastr.error("Could not insert CLIN item");
            }
        }
        return ClinViewModel;
    }());
    App.ClinViewModel = ClinViewModel;
})(App || (App = {}));
(function () {
    "use strict";
    var $element = $("#clinsDiv");
    ko.cleanNode($element[0]);
    var clinSvc = new App.ClinService();
    ko.applyBindings(new App.ClinViewModel(clinSvc, 125000), $element[0]);
})();
//# sourceMappingURL=app2.js.map