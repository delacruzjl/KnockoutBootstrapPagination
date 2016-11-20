/// <reference path="../js/libs/jquery-3.1.0.min.js" />

/// <reference path="../js/libs/knockout-3.4.1.js" />
/// <reference path="../js/01-pagination-viewmodel-ts.js" />

var vm;

module("pagination",
{
    setup: function () {
        vm = new App.PaginationViewModel(53);
    },
    teardown: function() {
        vm = null;
    }
});

test("1 page should display first batch",
    function () {
        vm.changePage(1);

        deepEqual(vm.visiblePages(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

test("2 page should display first batch",
    function() {
        vm.changePage(2);

        deepEqual(vm.visiblePages(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

test("11 page should show second batch",
    function () {
        vm.changePage(11);

        deepEqual(vm.visiblePages(), [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    });

test("14 page should display second batch",
    function () {
        vm.changePage(14);

        deepEqual(vm.visiblePages(), [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    });

test("27 page should display second batch",
    function () {
        vm.changePage(27);

        deepEqual(vm.visiblePages(), [21, 22, 23, 24, 25, 26, 27, 28, 29, 30]);
    });

test("30 page should display second batch",
    function () {
        vm.changePage(30);

        deepEqual(vm.visiblePages(), [21, 22, 23, 24, 25, 26, 27, 28, 29, 30]);
    });

test("52 page should display second batch",
    function () {
        vm.changePage(52);

        deepEqual(vm.visiblePages(), [51, 52, 53]);
    });

module("batch navigation",
{
    setup: function() {
        vm = new App.PaginationViewModel(53);
    },
    teardown: function() {
        vm = null;
    }
});

test("given current page 1 when next ellipsis then page should switch to 11",
    function() {
        vm.changePage(1);

        var actual = vm.calculatePage(true);

        strictEqual(actual, 11);
    });

test("given current page 23 when next ellipsis then page should switch to 31",
    function () {
        vm.changePage(23);

        var actual = vm.calculatePage(true);

        strictEqual(actual, 31);
    });

test("given current page 12 when previous ellipsis then page should switch to 1",
    function() {
        vm.changePage(12);

        var actual = vm.calculatePage(false);

        strictEqual(actual, 10);
    });

test("given current page 23 when previous ellipsis then page should switch to 20",
    function () {
        vm.changePage(23);

        var actual = vm.calculatePage(false);

        strictEqual(actual, 20);
    });

module("previous arrow", {
    setup: function () {
        vm = new App.PaginationViewModel(53);
    },
    teardown: function () {
        vm = null;
    }
});

test("should be enabled if page greater than 1",
    function () {
        vm.currentPage(3);
        var actual = vm.enablePrevArrow(3);
        ok(!!actual);
    });

test("should be disabled if page greater equals 1",
    function () {
        vm.currentPage(1);
        var actual = vm.enablePrevArrow(1);
        ok(!actual);
    });

test("should be displayed if page is 11",
    function() {
        vm.currentPage(11);
        var actual = vm.showPrevArrow(11);
        ok(!!actual, "returned: " + actual + ", initIndex:" + vm.initIndex());
    });

test("should be visible only once", 3,
    function () {
        for (var i = 1; i <= 3; i++) {
            vm.currentPage(i);
            var actual = vm.showPrevArrow(i);
            ok((!!actual && i === 1) || (!actual && i > 1), "worked for page number: " + i);
        }
    });

module("previous batch ellipsis", {
    setup: function () {
        vm = new App.PaginationViewModel(53);
        vm.maxVisiblePages(5);
    },
    teardown: function () {
        vm = null;
    }
});


test("should be hidden if page less than maxVisiblePages",
    function () {
        vm.currentPage(3);
        var actual = vm.showPrevEllipsis(3);
        ok(!actual);
    });

test("should be visible if page greater than or equals to maxVisiblePages",
    function () {
        vm.currentPage(6);
        var actual = vm.showPrevEllipsis(6);
        ok(!!actual);
    });

test("should be visible only once", 4,
    function () {
        for (var i = 6; i <= 9; i++) {
            vm.currentPage(i);
            var actual = vm.showPrevEllipsis(i);
            ok((!!actual && i > vm.maxVisiblePages()) || (!actual && i > vm.maxVisiblePages()), "worked for page number: " + i);
        }
    });

module("NEXT batch ellipsis", {
    setup: function () {
        vm = new App.PaginationViewModel(53);
        vm.maxVisiblePages(5);
    },
    teardown: function () {
        vm = null;
    }
});


test("should be hidden if the page is not maxVisiblePages",
    function () {
        vm.currentPage(3);
        var actual = vm.showNextEllipsis(3);
        ok(!actual, "actual: " + actual + "page: 3" + " endIndex: " + vm.endIndex() + " totalPages: " + vm.totalPages());
    });

test("should be displayed if the page is maxVisiblePages",
    function () {
        var p = 4;
        vm.currentPage(p);
        var actual = vm.showNextEllipsis(p);
        ok(!actual, "page: " + p + " endIndex: " + vm.endIndex() + " totalPages: " + vm.totalPages());
    });

test("should be hidden if page greater than or equals to maxVisiblePages and no more pages exist",
    function () {
        vm.currentPage(51);
        var actual = vm.showNextEllipsis(51);
        ok(!actual, "actual: " + actual + "page: 51" + " endIndex: " + vm.endIndex() + " totalPages: " + vm.totalPages());
    });

test("should be visible only once", 4,
    function () {
        for (var i = 6; i <= 9; i++) {
            vm.currentPage(i);
            var actual = vm.showNextEllipsis(i);
            ok((!!actual && i > vm.maxVisiblePages()) || (!actual && i > vm.maxVisiblePages()), "worked for page number: " + i);
        }
    });

