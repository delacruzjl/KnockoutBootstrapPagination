((koFn: any): void => {
    koFn.subscribeChanged = function (callback) {
        var previousValue;
        this.subscribe(function (_previousValue) {
            previousValue = _previousValue;
        }, undefined, 'beforeChange');
        this.subscribe(function (latestValue) {
            callback(latestValue, previousValue);
        });
    };
})(ko.subscribable.fn);