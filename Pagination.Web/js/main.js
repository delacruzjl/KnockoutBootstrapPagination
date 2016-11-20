var App;
(function (App) {
    "use strict";
    var PaginationViewModel = (function () {
        function PaginationViewModel(size) {
            var _this = this;
            this.size = size;
            var maxVisiblePages = 10;
            //todo: calculate size based upon JSON data or whatever list it's being displayed.
            this.totalPages = ko.observable(size || 0);
            this.currentPage = ko.observable(1);
            this.maxVisiblePages = ko.observable(maxVisiblePages);
            //start: computed
            this.endIndex = ko.computed(function () {
                var self = this;
                if (self.currentPage() > parseInt(self.totalPages())) {
                    self.currentPage(1);
                }
                var end = Math.ceil(self.currentPage() / self.maxVisiblePages()) * self.maxVisiblePages();
                return end;
            }, this);
            this.initIndex = ko.computed(function () {
                var self = this;
                var start = self.endIndex() > self.maxVisiblePages()
                    ? self.endIndex() - self.maxVisiblePages()
                    : 0;
                return start;
            }, this);
            this.pages = ko.computed(function () {
                var self = this;
                var pages = [];
                for (var i = 1; i <= parseInt(self.totalPages()); i++) {
                    pages.push(i);
                }
                console.debug("recalculating pages");
                return pages;
            }, this);
            this.visiblePages = ko.computed(function () {
                var self = this;
                return self
                    .pages()
                    .slice(self.initIndex(), self.endIndex());
            }, this);
            //end: computed
            //start: methods
            this.showPrevArrow = function (p) {
                return p === (_this.initIndex() + 1);
            };
            this.enablePrevArrow = function (p) {
                return _this.currentPage() > 1;
            };
            this.onPrevClick = function (p) {
                return _this.enablePrevArrow(p)
                    ? _this.previousPage()
                    : null;
            };
            this.showPrevEllipsis = function (p) {
                return _this.currentPage() > _this.maxVisiblePages() &&
                    p === (_this.initIndex() + 1);
            };
            this.showNextEllipsis = function (p) {
                return _this.currentPage() < (_this.endIndex() + 1) &&
                    p === _this.endIndex() &&
                    parseInt(_this.totalPages()) > _this.maxVisiblePages();
            };
            this.showNextArrow = function (p) {
                var totalPages = parseInt(_this.totalPages());
                var endIndex = _this.endIndex() > totalPages
                    ? totalPages
                    : _this.endIndex();
                return p === endIndex;
            };
            this.onNextClick = function (p) {
                return _this.enableNextArrow(p)
                    ? _this.nextPage()
                    : null;
            };
            this.enableNextArrow = function (p) {
                return _this.currentPage() < parseInt(_this.totalPages());
            };
            this.changePage = function (p) {
                if (p === _this.currentPage()) {
                    //do nothing
                    return;
                }
                console.debug("//todo: pagination Clicked, (refresh list?) with page: " + p);
                _this.currentPage(p);
            };
            this.nextPage = function () {
                var currPage = _this.currentPage() + 1;
                var totalPages = parseInt(_this.totalPages());
                if (currPage > totalPages) {
                    currPage = totalPages;
                }
                console.debug("next page triggered, this.currentPage:" + _this.currentPage() + ", currPage: " + currPage);
                _this.changePage(currPage);
            };
            this.previousPage = function () {
                var currPage = _this.currentPage() - 1;
                if (currPage <= 0) {
                    currPage = 1;
                }
                _this.changePage(currPage);
            };
            this.nextBatch = function () {
                var currPage = _this.calculatePage(true);
                _this.changePage(currPage);
            };
            this.previousBatch = function () {
                var currPage = _this.calculatePage(false);
                _this.changePage(currPage);
            };
            this.calculatePage = function (isNext) {
                return isNext
                    ? _this.initIndex() + _this.maxVisiblePages() + 1
                    : _this.endIndex() - _this.maxVisiblePages();
            };
            //end: methods
            // startup
            this.initialize(1);
        }
        PaginationViewModel.prototype.initialize = function (p) {
            this.changePage(p);
        };
        return PaginationViewModel;
    }());
    App.PaginationViewModel = PaginationViewModel;
    $.get("/templates/ko-pagination-template.html", function (response) {
        $("body").append(response);
        ko.applyBindings(new PaginationViewModel());
    });
})(App || (App = {}));
