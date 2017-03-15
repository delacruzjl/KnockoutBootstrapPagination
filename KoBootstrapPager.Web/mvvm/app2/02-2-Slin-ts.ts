module App {
    "use strict";

    export class Slin {
        category: KnockoutObservable<Category>;
        slinAmount: KnockoutObservable<number>;
        slinPercent: KnockoutObservable<number>;

        constructor(category?: Category, amount?: number, percentage?: number) {
            var self = this;
            self.category = ko.observable(category);
            self.slinPercent = ko.observable(percentage || 0);
            self.slinAmount = ko.observable(amount || 0);
        }
    }
}