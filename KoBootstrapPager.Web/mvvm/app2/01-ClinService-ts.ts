module App {
    "use strict";

    export interface IClin {
        clinId: string;
        clinAmount: number;
        clinPercent: number;
        slins: Slin[];
    }

    export class ClinService {
        constructor() {

        }

        getAvailableCategories(): JQueryPromise<any[]> {
            let dfd = $.Deferred<any[]>();
            var data: any[] = [];
            for (var i = 0; i < 10; i++) {
                var cat = {
                    id: i,
                    categoryName: "category + " + i
                };

                data.push(cat);
            }

            dfd.resolve(data);
            return dfd.promise();
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
}