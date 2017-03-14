interface IData {
    Id: number,
    Text: string
}

interface IDemoViewModel {
    source: KnockoutObservableArray<IData>,
    pagination: IPaginationViewModel,
    pageStatus: KnockoutObservable<App.PageStatus>
}

module App {
    "use strict";
    class DemoViewModel implements IDemoViewModel {
        constructor() {
            this.pageStatus = ko.observable(PageStatus.done);
            this.source = ko.observableArray([]);
            this.pagination = new PaginationViewModel(refreshData);

            // defaults to 10, but can be customized.
            this.pagination.maxVisiblePages(15);
        }

        pageStatus: KnockoutObservable<PageStatus>;
        source: KnockoutObservableArray<IData>;
        pagination: IPaginationViewModel;
    }

    var vm = new DemoViewModel();

    // load templates first
    $.get("/templates/ko-pagination-template.html",
        response => {
            $("body").append(response);

            // start knockoutJS
            ko.applyBindings(vm);

            // initialize page
            refreshData();
        });

    //////////

    function refreshData(p?: number): void {
        vm.pageStatus(PageStatus.loading);
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
        vm.pageStatus(PageStatus.done);
    }
}