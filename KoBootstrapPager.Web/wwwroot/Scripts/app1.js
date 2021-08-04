var App;
(function (App) {
    var PageStatus;
    (function (PageStatus) {
        PageStatus[PageStatus["done"] = 0] = "done";
        PageStatus[PageStatus["loading"] = 1] = "loading";
        PageStatus[PageStatus["errors"] = 2] = "errors";
        PageStatus[PageStatus["warning"] = 3] = "warning";
        PageStatus[PageStatus["info"] = 4] = "info";
    })(PageStatus = App.PageStatus || (App.PageStatus = {}));
})(App || (App = {}));
var App;
(function (App) {
    "use strict";
    var PaginationViewModel = /** @class */ (function () {
        function PaginationViewModel(callback) {
            var _this = this;
            this.callback = callback;
            var maxVisiblePages = 10;
            this.totalPages = ko.observable(0);
            this.currentPage = ko.observable(1);
            this.maxVisiblePages = ko.observable(maxVisiblePages);
            //start: computed
            this.endIndex = ko.computed(function () {
                var self = this;
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
                var totalPages = parseInt(_this.totalPages());
                return _this.currentPage() < (_this.endIndex() + 1) &&
                    p === _this.endIndex() &&
                    _this.endIndex() < totalPages &&
                    totalPages > _this.maxVisiblePages();
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
                _this.currentPage(p);
                if (!!_this.callback) {
                    _this.callback(p);
                }
            };
            this.nextPage = function () {
                var currPage = _this.currentPage() + 1;
                var totalPages = parseInt(_this.totalPages());
                if (currPage > totalPages) {
                    currPage = totalPages;
                }
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
})(App || (App = {}));
var App;
(function (App) {
    "use strict";
    var DemoViewModel = /** @class */ (function () {
        function DemoViewModel() {
            this.pageStatus = ko.observable(App.PageStatus.done);
            this.source = ko.observableArray([]);
            this.pagination = new App.PaginationViewModel(refreshData);
            // defaults to 10, but can be customized.
            this.pagination.maxVisiblePages(15);
        }
        return DemoViewModel;
    }());
    var vm = new DemoViewModel();
    // load templates first
    $.get("/templates/ko-pagination-template.html", function (response) {
        $("body").append(response);
        // start knockoutJS
        ko.applyBindings(vm);
        // initialize page
        refreshData();
    });
    //////////
    function refreshData(p) {
        vm.pageStatus(App.PageStatus.loading);
        var url = "/app/data/?page=" + p;
        url += "&size=" + vm.pagination.maxVisiblePages();
        $.get(url, populate);
    }
    function populate(response) {
        // data to display
        vm.source(response.Rows);
        // pagination info
        var totalPages = Math.ceil(response.Total / vm.pagination.maxVisiblePages());
        vm.pagination.totalPages(totalPages);
        vm.pageStatus(App.PageStatus.done);
    }
})(App || (App = {}));
//# sourceMappingURL=app1.js.map