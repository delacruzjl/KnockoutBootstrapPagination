module App {
    "use strict";

    export class ClinViewModel {
        totalAwardedAmountAndReimbursed: KnockoutObservable<number>;
        $slinModal: JQuery;
        clin: KnockoutObservable<Clin>;
        clinRemaining: KnockoutComputed<number>;
        clinValid: KnockoutComputed<boolean>;
        clins: KnockoutObservableArray<any>;
        slin: KnockoutObservable<Slin>;
        editedClin: KnockoutObservable<Clin>;
        updateClinAmount: (clin: Clin) => void;
        updateClinPercent: (clin: Clin) => void;
        addClin: () => void;
        removeClin: (clin: Clin) => void;
        updateClin: (clin: Clin) => void;
        cancelEditClin: (clin: Clin) => void;
        addSlinToClin: (clin: Clin) => void;
        openEditModal: (clin: Clin) => void;
        updateSlinAmount: () => void;
        updateSlinPercent: () => void;
        availableCategories: KnockoutObservableArray<Category>;
        validSlin: (slin: Slin) => boolean;
        addSlinVisible: (clin: Clin) => boolean;
        
        constructor(private svc: ClinService, fakeTotalAmount: number) {
            var self = this;

            self.$slinModal = $("#slinModal");
            self.totalAwardedAmountAndReimbursed = ko.observable(fakeTotalAmount);
            self.clin = ko.observable(new Clin());
            self.clins = ko.observableArray([]);
            self.slin = ko.observable(new Slin());
            self.editedClin = ko.observable(new Clin());
            self.clinRemaining = ko.computed(calculateRemaining, self);
            self.updateClinAmount = updateClinAmount;
            self.updateClinPercent = updateClinPercent;
            self.clinValid = ko.computed(clinValid, self);
            self.addClin = addClin;
            self.removeClin = removeClin;
            self.updateClin = updateClin;
            self.cancelEditClin = cancelEditClin;
            self.addSlinToClin = addSlinToClin;
            self.openEditModal = openEditModal;
            self.updateSlinAmount = updateSlinAmount;
            self.updateSlinPercent = updateSlinPercent;
            self.availableCategories = ko.observableArray([]);
            self.validSlin = validSlin;
            self.addSlinVisible = addSlinVisible;
            var editIndex = -1;
            
            function calculateRemaining(): number {
                var self: ClinViewModel = this;
                if (self.clins().length === 0) {
                    return self.totalAwardedAmountAndReimbursed();
                }
                var amounts = 0;
                $.each(self.clins(), (idx: number, elm: Clin): void => {
                    if (elm !== self.clin()) {
                        amounts += parseFloat(elm.clinAmount().toString());
                    }
                });

                return self.totalAwardedAmountAndReimbursed() - amounts;
            }

            function updateClinAmount(vm: any): void {
                var clin = vm;
                if (typeof vm.clin === "function") {
                    clin = vm.clin();
                }

                var amount = self.totalAwardedAmountAndReimbursed() * (clin.clinPercentage() / 100);
                clin.clinAmount(amount);
            }

            function updateClinPercent(vm: any): void {
                var clin = vm;
                if (typeof vm.clin === "function") {
                    clin = vm.clin();
                }

                var percent = (clin.clinAmount() * 100) / self.totalAwardedAmountAndReimbursed();
                clin.clinPercentage(percent);
            }

            function clinValid(): boolean {
                return !!self.clin().clinId && self.clin().clinId().length > 0 &&
                    !!self.clin().clinAmount &&
                    parseFloat(self.clin().clinAmount().toString()) > 0 &&
                    (self.clinRemaining() - parseFloat(self.clin().clinAmount().toString())) >= 0;
            }

            function addClin(): void {
                var clinItem = ko.mapping.toJS(self.clin);
                saveClinItem(clinItem);
            }

            function saveClinItem(clinItem: IClin) {
                var request = self.svc.addSingleEntry(clinItem);
                request.done(refreshList);
                request.fail(errorHandler);

                function refreshList(clin: IClin): void {
                    self.clins.push(ko.mapping.fromJS(clin));
                    self.clin(new Clin());
                    toastr.info("Done inserting", "AddClin");
                }
            }

            function removeClin(clin: Clin): void {
                self.clins.remove(clin);
            }

            function updateClin(clin: Clin): void {
                self.editedClin(clin);
                var currMode = !clin.editMode();
                clin.editMode(currMode);
            }

            function cancelEditClin(clin: Clin): void {
                clin.clinId(self.editedClin().clinId());
                clin.clinAmount(self.editedClin().clinAmount());

                var percent = (self.editedClin().clinAmount() * 100) / self.totalAwardedAmountAndReimbursed();
                clin.clinPercentage(percent);
                clin.editMode(false);
            }

            
            function addSlinToClin(): void {
                self.editedClin().slins.push(self.slin());
                updateClinItem(ko.mapping.toJS(self.editedClin));
            }

            function removeSlinToClin(slin): void {
                console.log(slin, self.editedClin().slins);

                self.editedClin().slins.remove(slin);
                updateClinItem(ko.mapping.toJS(self.editedClin));
            }

            function updateClinItem(clinItem: IClin): void {
                var request = svc.updateSingleEntry(clinItem);
                request.done(refreshList);
                request.fail(errorHandler);

                function refreshList(clin: IClin): void {
                    var arr = self.clins();

                    arr[editIndex] = ko.mapping.fromJS(clin);
                    self.clins(arr);
                    self.slin(new Slin(arr[editIndex]));
                    self.$slinModal.modal("hide");
                    toastr.info("Done updating, new SLIN added", "AddSlin");
                }
            }

            function openEditModal(clin: Clin): void {
                var request = svc.getAvailableCategories();

                request.done(populateModal);                
                request.fail(errorHandler);

                function populateModal(categories: Category[]): void {
                    toastr.info("Done refreshing categories", "openEditModal");
                    $.each(categories, (idx: number, elm: Category): void => {
                        self.availableCategories.push(ko.mapping.fromJS(elm));
                    });
                
                    editIndex = self.clins.indexOf(clin);
                    self.editedClin(clin);
                    self.$slinModal.modal("show");
                }
            }

            function updateSlinAmount(): void {
                var slin = self.slin();
                var amount = self.editedClin().clinAmount() * (slin.slinPercent() / 100);
                slin.slinAmount(amount);
            }

            function updateSlinPercent(): void {
                var slin = self.slin();
                var percent = (slin.slinAmount() * 100) / self.editedClin().clinAmount();
                slin.slinPercent(percent);
            }

            function validSlin(): boolean {
                var clin = self.editedClin();

                var amount = clin.clinAmount() -
                    self.slin().slinAmount();
                $.each(clin.slins(), (idx: number, elm: Slin): void => {
                    amount -= parseFloat(elm.slinAmount().toString());
                });

                return !!self.slin() &&
                    !!self.slin().category() &&
                    self.slin().category().id() > 0 &&
                    self.slin().slinAmount() > 0 &&
                    amount >= 0;
            }

            function addSlinVisible(clin: Clin): boolean {
                var amount = clin.clinAmount();
                $.each(clin.slins(), (idx: number, elm: Slin): void => {
                    amount -= parseFloat(elm.slinAmount().toString());
                });

                return amount > 0;
            }

            function errorHandler(): void {
                toastr.error("Could not insert CLIN item");
            }
        }
    }
}
