module App {
    interface ISlin {
        categoryId: number;
        categoryName: string;
        slinAmount: number;
        slinPercent: number;
    }

    interface IClin {
        clinId: string;
        clinAmount: number;
        clinPercent: number;
        slins: ISlin[];
    }

    export class ClinService {
        constructor() {

        }

        addSingleEntry(clin: IClin): JQueryPromise<IClin> {
            let dfd = $.Deferred<IClin>();
            dfd.resolve(clin);
            return dfd.promise();
        }

        updateSingleEntry(clin: IClin): JQueryPromise<IClin> {
            let dfd = $.Deferred<IClin>();
            dfd.resolve(clin);
            return dfd.promise();
        }

        removeSingleEntry(clin: IClin): JQueryPromise<void> {
            let dfd = $.Deferred<void>();
            dfd.resolve();
            return dfd.promise();
        }

        addBulkEntries(clins: IClin[]): JQueryPromise<IClin[]> {
            let dfd = $.Deferred<IClin[]>();
            dfd.resolve(clins);
            return dfd.promise();
        }

        updateBulkEntries(clins: IClin[]): JQueryPromise<IClin[]> {
            let dfd = $.Deferred<IClin[]>();
            dfd.resolve(clins);
            return dfd.promise();
        }

        removeBulkEntries(clins: IClin[]): JQueryPromise<void> {
            let dfd = $.Deferred<void>();
            dfd.resolve();
            return dfd.promise();
        }
    }

    class Slin {
        categoryId: KnockoutObservable<number>;
        categoryName: KnockoutObservable<string>;
        slinAmount: KnockoutObservable<number>;
        slinPercent: KnockoutObservable<number>;

        constructor(id?: number, catName?: string, amount?: number, percentage?: number) {
            this.categoryId = ko.observable(id || 0);
            this.categoryName = ko.observable(catName || "");
            this.slinPercent = ko.observable(percentage || 0);
            this.slinAmount = ko.observable(amount || 0);
        }
    }

    class Clin {
        clinId: KnockoutObservable<string>;
        clinPercentage: KnockoutObservable<number>;
        clinAmount: KnockoutObservable<number>;
        editMode: KnockoutObservable<boolean>;
        slins: KnockoutObservableArray<Slin>;

        constructor(private id?: string, private amount?: number, private percentage?: number, slins?: Slin[]) {
            this.clinId = ko.observable(id || "");
            this.clinAmount = ko.observable(amount || 0);
            this.clinPercentage = ko.observable(percentage || 0);
            this.slins = ko.observableArray(slins || []);
            this.editMode = ko.observable(false);
        }
    }

    export class ClinViewModel {
        totalAwardedAmountAndReimbursed: KnockoutObservable<number>;
        $slinModal: JQuery;
        clin: KnockoutObservable<Clin>;
        clinRemaining: KnockoutComputed<number>;
        clinValid: KnockoutComputed<boolean>;
        clins: KnockoutObservableArray<any>;
        slin: KnockoutObservable<Slin>;
        editedClin: IClin;
        updateClinAmount: (clin: Clin) => void;
        updateClinPercent: (clin: Clin) => void;
        addClin: () => void;
        removeClin: (clin: Clin) => void;
        updateClin: (clin: Clin) => void;
        cancelEditClin: (clin: Clin) => void;
        addSlinToClin: (clin: Clin) => void;
        openEditModal: (clin: Clin) => void;

        constructor(private svc: ClinService, fakeTotalAmount: number) {
            var self = this;

            self.$slinModal = $("#slinModal");
            self.totalAwardedAmountAndReimbursed = ko.observable(fakeTotalAmount);
            self.clin = ko.observable(new Clin());
            self.clins = ko.observableArray([]);
            self.slin = ko.observable(new Slin());
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

                var amount = self.clinRemaining() * (clin.clinPercentage() / 100);
                clin.clinAmount(amount);
            }

            function updateClinPercent(vm: any): void {
                var clin = vm;
                if (typeof vm.clin === "function") {
                    clin = vm.clin();
                }

                var percent = (clin.clinAmount() * 100) / self.clinRemaining();
                clin.clinPercentage(percent);
            }

            function clinValid(): boolean {
                return !!self.clin().clinId && self.clin().clinId().length > 0 &&
                    !!self.clin().clinAmount && self.clin().clinAmount() > 0;
            }

            function addClin(): void {
                var clinItem = ko.mapping.toJS(self.clin);
                saveClinItem(clinItem);
            }

            function saveClinItem(clinItem: IClin) {
                var request = self.svc.addSingleEntry(clinItem);
                request.done((clin: IClin): void => {
                    self.clins.push(ko.mapping.fromJS(clin));
                    self.clin(new Clin());
                    toastr.info("Done inserting", "AddClin");
                });

                request.fail((): void => {
                    toastr.error("Could not insert CLIN item");
                });
            }

            function removeClin(clin: Clin): void {
                self.clins.remove(clin);
            }

            function updateClin(clin: Clin): void {
                self.editedClin = ko.mapping.toJS(clin);
                var currMode = !clin.editMode();
                clin.editMode(currMode);
            }

            function cancelEditClin(clin: Clin): void {
                //console.log(clin, self.editedClin());
                clin.clinId(self.editedClin.clinId);
                clin.clinAmount(self.editedClin.clinAmount);

                var percent = (self.editedClin.clinAmount * 100) / self.totalAwardedAmountAndReimbursed();
                clin.clinPercentage(percent);
                clin.editMode(false);
            }

            function addSlinToClin(): void {
                console.log("entered", self.editedClin);
                var slinItem = ko.mapping.toJS(self.slin());
                self.editedClin.slins.push(slinItem);
                
                updateClinItem(self.editedClin);
            }

            function updateClinItem(clinItem: IClin): void {
                var request = svc.updateSingleEntry(clinItem);
                request.done((clin: IClin): void => {
                    self.slin(new Slin());
                    self.$slinModal.modal("hide");
                    toastr.info("Done updating, new SLIN added", "AddSlin");
                });

                request.fail((): void => {
                    toastr.error("Could not insert CLIN item");
                });

            }

            function openEditModal(clin: Clin): void {
                self.editedClin = ko.mapping.toJS(clin);
                self.$slinModal.modal("show");
            }
        }
    }
}

((): void => {
    var $element = $("#clinsDiv");
    ko.cleanNode($element[0]);
    var clinSvc = new App.ClinService();
    ko.applyBindings(new App.ClinViewModel(clinSvc, 125000), $element[0]);
})();
