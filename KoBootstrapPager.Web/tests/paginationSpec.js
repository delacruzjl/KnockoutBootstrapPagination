/// <reference path="../Scripts/jquery-3.1.1.min.js" />

/// <reference path="../Scripts/knockout-3.4.0.debug.js" />
/// <reference path="../mvvm/app1/01-pagination-viewmodel-ts.js" />

var pagerStub;

module("pagination",
{
    setup: function () {
        pagerStub = new App.PaginationViewModel();
        pagerStub.totalPages(53);
    },
    teardown: function() {
        pagerStub = null;
    }
});

test("1 page should display first batch",
    function () {
        pagerStub.changePage(1);

        deepEqual(pagerStub.visiblePages(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

test("2 page should display first batch",
    function() {
        pagerStub.changePage(2);

        deepEqual(pagerStub.visiblePages(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

test("11 page should show second batch",
    function () {
        pagerStub.changePage(11);

        deepEqual(pagerStub.visiblePages(), [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    });

test("14 page should display second batch",
    function () {
        pagerStub.changePage(14);

        deepEqual(pagerStub.visiblePages(), [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    });

test("27 page should display second batch",
    function () {
        pagerStub.changePage(27);

        deepEqual(pagerStub.visiblePages(), [21, 22, 23, 24, 25, 26, 27, 28, 29, 30]);
    });

test("30 page should display second batch",
    function () {
        pagerStub.changePage(30);

        deepEqual(pagerStub.visiblePages(), [21, 22, 23, 24, 25, 26, 27, 28, 29, 30]);
    });

test("52 page should display second batch",
    function () {
        pagerStub.changePage(52);

        deepEqual(pagerStub.visiblePages(), [51, 52, 53]);
    });

module("batch navigation",
{
    setup: function() {
        pagerStub = new App.PaginationViewModel();
        pagerStub.totalPages(53);
    },
    teardown: function() {
        pagerStub = null;
    }
});

test("given current page 1 when next ellipsis then page should switch to 11",
    function() {
        pagerStub.changePage(1);

        var actual = pagerStub.calculatePage(true);

        strictEqual(actual, 11);
    });

test("given current page 23 when next ellipsis then page should switch to 31",
    function () {
        pagerStub.changePage(23);

        var actual = pagerStub.calculatePage(true);

        strictEqual(actual, 31);
    });

test("given current page 12 when previous ellipsis then page should switch to 1",
    function() {
        pagerStub.changePage(12);

        var actual = pagerStub.calculatePage(false);

        strictEqual(actual, 10);
    });

test("given current page 23 when previous ellipsis then page should switch to 20",
    function () {
        pagerStub.changePage(23);

        var actual = pagerStub.calculatePage(false);

        strictEqual(actual, 20);
    });

module("previous arrow", {
    setup: function () {
        pagerStub = new App.PaginationViewModel();
        pagerStub.totalPages(53);
    },
    teardown: function () {
        pagerStub = null;
    }
});

test("should be enabled if page greater than 1",
    function () {
        pagerStub.currentPage(3);
        var actual = pagerStub.enablePrevArrow(3);
        ok(!!actual);
    });

test("should be disabled if page greater equals 1",
    function () {
        pagerStub.currentPage(1);
        var actual = pagerStub.enablePrevArrow(1);
        ok(!actual);
    });

test("should be displayed if page is 11",
    function() {
        pagerStub.currentPage(11);
        var actual = pagerStub.showPrevArrow(11);
        ok(!!actual, "returned: " + actual + ", initIndex:" + pagerStub.initIndex());
    });

test("should be visible only once", 3,
    function () {
        for (var i = 1; i <= 3; i++) {
            pagerStub.currentPage(i);
            var actual = pagerStub.showPrevArrow(i);
            ok((!!actual && i === 1) || (!actual && i > 1), "worked for page number: " + i);
        }
    });

module("previous batch ellipsis", {
    setup: function () {
        pagerStub = new App.PaginationViewModel();
        pagerStub.totalPages(53);
        pagerStub.maxVisiblePages(5);
    },
    teardown: function () {
        pagerStub = null;
    }
});


test("should be hidden if page less than maxVisiblePages",
    function () {
        pagerStub.currentPage(3);
        var actual = pagerStub.showPrevEllipsis(3);
        ok(!actual);
    });

test("should be visible if page greater than or equals to maxVisiblePages",
    function () {
        pagerStub.currentPage(6);
        var actual = pagerStub.showPrevEllipsis(6);
        ok(!!actual);
    });

test("should be visible only once", 4,
    function () {
        for (var i = 6; i <= 9; i++) {
            pagerStub.currentPage(i);
            var actual = pagerStub.showPrevEllipsis(i);
            ok((!!actual && i > pagerStub.maxVisiblePages()) || (!actual && i > pagerStub.maxVisiblePages()), "worked for page number: " + i);
        }
    });

module("NEXT batch ellipsis", {
    setup: function () {
        pagerStub = new App.PaginationViewModel();
        pagerStub.totalPages(53);
        pagerStub.maxVisiblePages(5);
    },
    teardown: function () {
        pagerStub = null;
    }
});


test("should be hidden if the page is not maxVisiblePages",
    function () {
        pagerStub.currentPage(3);
        var actual = pagerStub.showNextEllipsis(3);
        ok(!actual, "actual: " + actual + "page: 3" + " endIndex: " + pagerStub.endIndex() + " totalPages: " + pagerStub.totalPages());
    });

test("should be displayed if the page is maxVisiblePages",
    function () {
        var p = 4;
        pagerStub.currentPage(p);
        var actual = pagerStub.showNextEllipsis(p);
        ok(!actual, "page: " + p + " endIndex: " + pagerStub.endIndex() + " totalPages: " + pagerStub.totalPages());
    });

test("should be hidden if page greater than or equals to maxVisiblePages and no more pages exist",
    function () {
        pagerStub.currentPage(51);
        var actual = pagerStub.showNextEllipsis(51);
        ok(!actual, "actual: " + actual + "page: 51" + " endIndex: " + pagerStub.endIndex() + " totalPages: " + pagerStub.totalPages());
    });

test("should be visible only once", 4,
    function () {
        for (var i = 6; i <= 9; i++) {
            pagerStub.currentPage(i);
            var actual = pagerStub.showNextEllipsis(i);
            ok((!!actual && i > pagerStub.maxVisiblePages()) || (!actual && i > pagerStub.maxVisiblePages()), "worked for page number: " + i);
        }
    });

