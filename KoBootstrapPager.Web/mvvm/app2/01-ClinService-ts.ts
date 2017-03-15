module App {
    "use strict";

    export interface IClin {
        clinId: string;
        clinAmount: number;
        clinPercent: number;
        slins: Slin[];
    }

    export interface IClinService {
        getAvailableCategories: () => JQueryPromise<any[]>;
        addSingleEntry: (clin: IClin) => JQueryPromise<IClin>;
        updateSingleEntry: (clin: IClin) => JQueryPromise<IClin>;
        removeSingleEntry: (clin: IClin) => JQueryPromise<void>;
    }

    export class ClinService implements IClinService {
        constructor() {

        }

        //TODO: to be removed
        generateFakeData(): any[] {
            var data: any[] = [];
            for (var i = 0; i < 10; i++) {
                var cat = {
                    id: i,
                    categoryName: "category + " + i
                };

                data.push(cat);
            }
            return data;
        }

        getAvailableCategories(): JQueryPromise<any[]> {
            let dfd = $.Deferred<any[]>();

            //TODO: to be removed
            var data = this.generateFakeData();

            //TODO: pending backend
            dfd.resolve(data);
            return dfd.promise();
        }

        addSingleEntry(clin: IClin): JQueryPromise<IClin> {
            let dfd = $.Deferred<IClin>();

            //TODO: pending backend
            dfd.resolve(clin);
            return dfd.promise();
        }

        updateSingleEntry(clin: IClin): JQueryPromise<IClin> {
            let dfd = $.Deferred<IClin>();

            //TODO: pending backend
            dfd.resolve(clin);
            return dfd.promise();
        }

        removeSingleEntry(clin: IClin): JQueryPromise<void> {
            let dfd = $.Deferred<void>();

            //TODO: pending backend
            dfd.resolve();
            return dfd.promise();
        }       
    }
}