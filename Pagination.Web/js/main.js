var App;
(function (App) {
    var PaginationViewModel = (function () {
        function PaginationViewModel() {
            var _this = this;
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
            this.changePage = function (p) {
                console.debug("TODO: pagination Clicked" + p, _this);
                _this.currentPage(p);
                var end = Math.ceil(p / _this.maxVisiblePages()) * _this.maxVisiblePages();
                var start = end > _this.maxVisiblePages()
                    ? end - _this.maxVisiblePages()
                    : 0;
                _this.initIndex(start);
                _this.endIndex(end);
                _this.visiblePages(_this.pages.slice(start, end));
            };
            this.nextPage = function () {
                var currPage = _this.currentPage() + 1;
                if (currPage > _this.totalPages()) {
                    currPage = _this.totalPages();
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
            this.changePage(1);
        }
        return PaginationViewModel;
    }());
    App.PaginationViewModel = PaginationViewModel;
    $.get("/templates/ko-templates.html", function (response) {
        $("body").append(response);
        ko.applyBindings(new PaginationViewModel());
    });
})(App || (App = {}));
//# sourceMappingURL=main.js.map