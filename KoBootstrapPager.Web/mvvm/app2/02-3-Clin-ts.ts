module App {
    "use strict";

    export class Clin {
        clinId: KnockoutObservable<string>;
        clinPercentage: KnockoutObservable<number>;
        clinAmount: KnockoutObservable<number>;
        editMode: KnockoutObservable<boolean>;
        slins: KnockoutObservableArray<Slin>;

        constructor(private id?: string, private amount?: number, private percentage?: number, slins?: Slin[]) {
            var self = this;

            self.clinId = ko.observable(id || "");
            self.clinAmount = ko.observable(amount || 0);
            self.clinPercentage = ko.observable(percentage || 0);
            self.slins = ko.observableArray(slins || []);
            self.editMode = ko.observable(false);       

            
        }
    }
}