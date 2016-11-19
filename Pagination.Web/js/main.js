/// <reference path="libs/jquery-3.1.0.min.js" />
/// <reference path="libs/knockout-3.4.1.js" />

var vm;
(function ($, ko, $body) {
    "use strict";

    var pages = [];
    var maxVisiblePages = 10;

    // start: mocks
    for (var i = 1; i <= 53; i ++) {
        pages.push(i);
    }
    // end: mocks

    vm = {
        pages: ko.observableArray(pages),
        visiblePages: ko.observableArray([]),
        currentPage: ko.observable(1),
        maxVisiblePages: ko.observable(maxVisiblePages),
        initIndex: ko.observable(0),
        endIndex: ko.observable(maxVisiblePages - 1),

        // actions
        changePage: changePage,
        nextPage: nextPage,
        previousPage: previousPage,
        nextBatch: nextBatch,
        previousBatch: previousBatch
    };

    // computed
    vm.totalPages = ko.computed(function() {
        return this.pages().length;
    }, vm);

    // start templates
   $.get("/templates/ko-templates.html", function (response) {
        console.log("templates loaded");
        $body.append(response);
        ko.applyBindings(vm);
   });
    init();

    //////

    function init() {
        changePage(1);
    }

    function changePage(p) {
        console.log("^changePage clicked" + p);
        vm.currentPage(p);

        var end = Math.ceil(p / maxVisiblePages) * maxVisiblePages;
        var start = end > maxVisiblePages
            ? end - maxVisiblePages
            : 0;

        vm.initIndex(start);
        vm.endIndex(end);
        vm.visiblePages(vm.pages.slice(start, end));
    }

    function nextPage() {
        var currPage = vm.currentPage() + 1;
        if (currPage > vm.totalPages()) {
            currPage = vm.totalPages();
        }

        changePage(currPage);
    }

    function previousPage() {
        var currPage = vm.currentPage() - 1;
        if (currPage <= 0) {
            currPage = 1;
        }

        changePage(currPage);
    }

    function nextBatch() {
        var currPage = vm.currentPage();
        currPage += maxVisiblePages;

        changePage(currPage);
    }

    function previousBatch() {
        var currPage = vm.currentPage();
        currPage -= maxVisiblePages;

        changePage(currPage);
    }

})(jQuery, ko, $("body"));