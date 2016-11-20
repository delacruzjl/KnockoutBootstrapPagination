interface IPaginationViewModel {
    currentPage: KnockoutObservable<number>,
    maxVisiblePages: KnockoutObservable<number>,
    initIndex: KnockoutComputed<number>,
    endIndex: KnockoutComputed<number>,
    totalPages: KnockoutObservable<any>,

    //computed
    pages: KnockoutComputed<number[]>,
    visiblePages: KnockoutComputed<number[]>,

    // actions
    changePage: (p: number) => void,
    nextPage: () => void,
    previousPage: () => void,
    nextBatch: () => void,
    previousBatch: () => void,
    showPrevArrow: (p: number) => boolean,
    enablePrevArrow: (p: number) => boolean,
    onPrevClick: (p: number) => void,
    showPrevEllipsis: (p: number) => boolean,
    showNextEllipsis: (p: number) => boolean,
    enableNextArrow: (p: number) => boolean,
    showNextArrow: (p: number) => boolean,
    onNextClick: (p: number) => void,
    // exposed for testing purposes only
    calculatePage: (isNext: boolean) => number
}

module App {
    "use strict";

    export class PaginationViewModel implements IPaginationViewModel {
        constructor(private size?: number) {
            const maxVisiblePages = 10;

            //todo: calculate size based upon JSON data or whatever list it's being displayed.

            this.totalPages = ko.observable(size || 0);
            this.currentPage = ko.observable(1);
            this.maxVisiblePages = ko.observable(maxVisiblePages);

            //start: computed
            this.endIndex = ko.computed(function (): any {
                var self = this;

                var end = Math.ceil(self.currentPage() / self.maxVisiblePages()) * self.maxVisiblePages();
                return end;
            }, this);

            this.initIndex = ko.computed(function (): any {
                var self = this;

                var start = self.endIndex() > self.maxVisiblePages()
                    ? self.endIndex() - self.maxVisiblePages()
                    : 0;

                return start;

            }, this);

            this.pages = ko.computed(function(): any {
                var self = this;
                var pages = [];

                for (var i = 1; i <= parseInt(self.totalPages()); i++) {
                    pages.push(i);
                }
                console.debug("recalculating pages");
                return pages;
            }, this);

            this.visiblePages = ko.computed(function(): any {
                var self = this;
                return self
                        .pages()
                        .slice(self.initIndex(), self.endIndex());
                },
                this);
            //end: computed

            //start: methods
            this.showPrevArrow = (p: number): boolean => {
                return p === (this.initIndex() + 1);
            };
            this.enablePrevArrow = (p: number): boolean => {
                return this.currentPage() > 1;
            };
            this.onPrevClick = (p: number): void => {
                return this.enablePrevArrow(p)
                    ? this.previousPage()
                    : null;
            };
            this.showPrevEllipsis = (p: number): boolean => {
                return this.currentPage() > this.maxVisiblePages() &&
                    p === (this.initIndex() + 1);
            };
            this.showNextEllipsis = (p: number): boolean => {
                var totalPages = parseInt(this.totalPages());

                return this.currentPage() < (this.endIndex() + 1) &&
                    p === this.endIndex() &&
                    this.endIndex() < totalPages &&
                    totalPages > this.maxVisiblePages();
            };
            this.showNextArrow = (p: number): boolean => {
                var totalPages = parseInt(this.totalPages());
                var endIndex = this.endIndex() > totalPages
                    ? totalPages
                    : this.endIndex();

                return p === endIndex;
            };

            this.onNextClick = (p: number): void => {
                return this.enableNextArrow(p)
                    ? this.nextPage()
                    : null;
            };

            this.enableNextArrow = (p: number): boolean => {
                return this.currentPage() < parseInt(this.totalPages());
            };

            this.changePage = (p: number): void => {
                if (p === this.currentPage()) {
                    //do nothing
                    return;
                }
                console.debug("//todo: pagination Clicked, (refresh list?) with page: " + p);

                this.currentPage(p);
            };

            this.nextPage = (): void => {
                var currPage = this.currentPage() + 1;
                var totalPages = parseInt(this.totalPages());

                if (currPage > totalPages) {
                    currPage = totalPages;
                }
                console.debug("next page triggered, this.currentPage:" + this.currentPage()  + ", currPage: " + currPage);

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
            //end: methods

            // startup
            this.initialize(1);
        }

        currentPage: KnockoutObservable<number>;
        maxVisiblePages: KnockoutObservable<number>;
        totalPages: KnockoutObservable<any>;
        initIndex: KnockoutComputed<number>;
        endIndex: KnockoutComputed<number>;
        pages: KnockoutComputed<number[]>;
        visiblePages: KnockoutComputed<number[]>;
        showPrevArrow: (p: number) => boolean;
        enablePrevArrow: (p: number) => boolean;
        onPrevClick: (p: number) => void;
        showPrevEllipsis: (p: number) => boolean;
        showNextEllipsis: (p: number) => boolean;
        changePage: (p: number) => void;
        nextPage: () => void;
        previousPage: () => void;
        nextBatch: () => void;
        previousBatch: () => void;
        calculatePage: (isNext: boolean) => number;
        showNextArrow: (p: number) => boolean;
        enableNextArrow: (p: number) => boolean;
        onNextClick: (p: number) => void ;

        private initialize(p: number): void {
            this.changePage(p);
        }
    }

    $.get("/templates/ko-pagination-template.html",
        response => {
 $("body").append(response);
            ko.applyBindings(new PaginationViewModel());
        });
}