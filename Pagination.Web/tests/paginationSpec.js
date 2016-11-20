/// <reference path="../js/libs/jquery-3.1.0.min.js" />

/// <reference path="../js/libs/knockout-3.4.1.js" />
/// <reference path="../js/main.js" />

var vm;

module("pagination",
{
    setup: function() {
        vm = new App.PaginationViewModel();
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
        vm = new App.PaginationViewModel();
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