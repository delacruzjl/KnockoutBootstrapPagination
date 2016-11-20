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
            this.pagination = new PaginationViewModel(this.source.length, refreshData);
        }

        source: KnockoutObservableArray<IData>;
        pagination: IPaginationViewModel;
    }

    var vm = new DemoViewModel();
    function refreshData(p?: number): void {
        $.get("/app/data/?page=" + p,
            (response) => {
                vm.source(response.Rows);
                var totalPages = Math.ceil(response.Total / vm.pagination.maxVisiblePages());
                vm.pagination.totalPages(totalPages);
            });
    };

    // load templates first
    $.get("/templates/ko-pagination-template.html",
        response => {
            $("body").append(response);
            ko.applyBindings(vm);
            refreshData();
        });
}