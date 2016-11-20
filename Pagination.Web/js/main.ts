interface IPaginationViewModel {
    pages: KnockoutObservableArray<number>,
    visiblePages: KnockoutObservableArray<number>,
    currentPage: KnockoutObservable<number>,
    maxVisiblePages: KnockoutObservable<number>,
    initIndex: KnockoutObservable<number>,
    endIndex: KnockoutObservable<number>,
    totalPages: KnockoutComputed<number>,

    // actions
    changePage: (p: number) => void,
    nextPage: () => void,
    previousPage: () => void,
    nextBatch: () => void,
    previousBatch: () => void,

    // for testing only
    calculatePage: (isNext: boolean) => number
}

class PaginationViewModel implements IPaginationViewModel {
    "use strict";

    constructor() {
        var maxVisiblePages = 10;

        // start: mocks data
        var pages = [];
        for (var i = 1; i <= 53; i++) {
            pages.push(i);
        }
        // end: mocks data

        this.pages = ko.observableArray(pages);
        this.visiblePages = ko.observableArray([]);
        this.currentPage = ko.observable(1);
        this.maxVisiblePages = ko.observable(maxVisiblePages);
        this.initIndex = ko.observable(0);
        this.endIndex = ko.observable(maxVisiblePages - 1);
        this.totalPages = ko.computed(function () {
            var self = this;
            return self.pages().length;
        }, this);
        this.changePage = (p: number): void => {
            console.log("^changePage clicked" + p, this);
            this.currentPage(p);

            var end = Math.ceil(p / this.maxVisiblePages()) * this.maxVisiblePages();
            var start = end > this.maxVisiblePages()
                ? end - this.maxVisiblePages()
                : 0;

            this.initIndex(start);
            this.endIndex(end);
            this.visiblePages(this.pages.slice(start, end));
        };

        this.nextPage = (): void => {
            var currPage = this.currentPage() + 1;
            if (currPage > this.totalPages()) {
                currPage = this.totalPages();
            }

            this.changePage(currPage);
        };

        this.previousPage = (): void => {
            var currPage = this.currentPage() - 1;
            if (currPage <= 0) {
                currPage = 1;
            }

            this.changePage(currPage);
        };

        this.nextBatch = (): void => {
            var currPage = this.calculatePage(true);
            this.changePage(currPage);
        };

        this.previousBatch = (): void => {
            var currPage = this.calculatePage(false);
            this.changePage(currPage);
        };

        this.calculatePage = (isNext: boolean): number => {
            return isNext
                ? this.initIndex() + this.maxVisiblePages() + 1
                : this.endIndex() - this.maxVisiblePages();
        };

        this.changePage(1);
    }

    pages: KnockoutObservableArray<number>;
    visiblePages: KnockoutObservableArray<number>;
    currentPage: KnockoutObservable<number>;
    maxVisiblePages: KnockoutObservable<number>;
    initIndex: KnockoutObservable<number>;
    endIndex: KnockoutObservable<number>;
    totalPages: KnockoutComputed<number>;
    changePage: (p: number) => void;
    nextPage: () => void;
    previousPage: () => void;
    nextBatch: () =>void;
    previousBatch: () => void;
    calculatePage: (isNext: boolean) => number;
}

$.get("/templates/ko-templates.html", response => {
    console.log("templates loaded");
    $("body").append(response);
    ko.applyBindings(new PaginationViewModel());
});