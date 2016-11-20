enum PageStatus {
    done, loading, errors
}

interface IData {
    Id: number,
    Text: string
}

interface IDemoViewModel {
    source: KnockoutObservableArray<IData>,
    pagination: IPaginationViewModel,
    pageStatus: KnockoutObservable<PageStatus>
}

module App {
    "use strict";


    class DemoViewModel implements IDemoViewModel {
        constructor() {
            this.pageStatus = ko.observable(PageStatus.done);
            this.source = ko.observableArray([]);
            this.pagination = new PaginationViewModel(this.source.length, refreshData);
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
        $.get("/app/data/?page=" + p,
        (response) => {
            vm.source(response.Rows);
            var totalPages = Math.ceil(response.Total / vm.pagination.maxVisiblePages());
            vm.pagination.totalPages(totalPages);
            vm.pageStatus(PageStatus.done);
        });
    }
}