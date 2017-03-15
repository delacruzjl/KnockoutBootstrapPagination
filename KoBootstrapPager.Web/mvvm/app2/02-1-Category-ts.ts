module App {
    "use strict";

    export class Category {
        id: KnockoutObservable<number>;
        categoryName: KnockoutObservable<string>;

        constructor(id: number, name: string) {
            this.id = ko.observable(id);
            this.categoryName = ko.observable(name);
        }
    }
}