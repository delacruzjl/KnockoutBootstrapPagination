interface IData {
    Id: number,
    Text: string
}

interface IDemoViewModel {
    source: KnockoutObservableArray<IData>,
    pagination: IPaginationViewModel
}

module App {
    "use strict";

    class DemoViewModel implements IDemoViewModel {
        constructor() {
            this.source = ko.observableArray([]);
            this.pagination = new PaginationViewModel(this.source.length);
        }

        source: KnockoutObservableArray<IData>;
        pagination: IPaginationViewModel;
    }

    // load templates first
    $.get("/templates/ko-pagination-template.html",
        response => {
            $("body").append(response);
            var vm = new DemoViewModel();

            var refreshData = (p?: number): void => {
                if (p === vm.pagination.currentPage()) {
                    //do nothing
                    return;
                }

                vm.pagination.currentPage(p || 1);
                $.get("/app/data/?page=" + p,
                    (response) => {
                        vm.source(response.Rows);
                        var totalPages = Math.ceil(response.Total / vm.pagination.maxVisiblePages());
                        vm.pagination.totalPages(totalPages);
                    });
            };

            vm.pagination.changePage = refreshData;
            ko.applyBindings(vm);
            refreshData();
        });
}