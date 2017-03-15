var clinSut: App.ClinViewModel;
var totalAmount = 125000;
var methodHasBeenCalled = {
    add: false,
    update: false,
    getCategories: false,
    remove: false
};

class FakeClinService implements App.IClinService {
    dfd: any;
    constructor() {
        this.dfd = $.Deferred<any>();        
    }

    getAvailableCategories(): JQueryPromise<any[]>{
        methodHasBeenCalled.getCategories = true;
        this.dfd.resolve();
        return this.dfd.promise();
    }

    addSingleEntry(clin: App.IClin): JQueryPromise<App.IClin>{
        methodHasBeenCalled.add = true;
        this.dfd.resolve(new App.Clin());
        return this.dfd.promise();
    }

    updateSingleEntry(clin: App.IClin): JQueryPromise<App.IClin>{
        methodHasBeenCalled.update = true;
        this.dfd.resolve(new App.Clin());
        return this.dfd.promise();
    }

    removeSingleEntry(clin: App.IClin): JQueryPromise<void>{
        methodHasBeenCalled.remove = true;
        this.dfd.resolve();
        return this.dfd.promise();
    }
}

var clinSvc: App.IClinService;
QUnit.module("ClinViewModel",
    {
        setup: function () {
            clinSvc = new FakeClinService();
            clinSut = new App.ClinViewModel(clinSvc, totalAmount);
            methodHasBeenCalled = {
                add: false,
                update: false,
                getCategories: false,
                remove: false
            };
        },
        teardown: function () {
            clinSut = null;
            clinSvc = null;
        }
    });

test("clin remaining should equal Total awarded direct + Total awarded reimbursable minus CLIN amounts",
    function () {
        //Arrange (setup)
        clinSut.clin().clinId("fake");
        var fakeCLINAmount = 50000
        clinSut.clins.push(new App.Clin("AAA", fakeCLINAmount));
        var expected = totalAmount - fakeCLINAmount;

        //Act (execute)
        var actual = clinSut.clinRemaining();

        //Assert (expect)
        deepEqual(actual, expected, `actual: ${actual} expected to be ${expected}`);
    });

test("clin entry should be valid",
    function () {
        //Arrange (setup)
        clinSut.clin().clinId("fake");
        clinSut.clin().clinPercentage(50);
        clinSut.updateClinAmount(clinSut.clin());

        //Act (execute)
        var actual = clinSut.validClin();

        //Assert (expect)
        ok(actual, `CLIN entry, amount:${clinSut.clin().clinAmount()} clinId: ${clinSut.clin().clinId()}`);
    });

test("clin entry with no clinID should not be allowed",
    function () {
        //Arrange (setup)
        clinSut.clin().clinId("");
        clinSut.clin().clinPercentage(50);
        clinSut.updateClinAmount(clinSut.clin());

        //Act (execute)
        var actual = !clinSut.validClin();

        //Assert (expect)
        ok(actual, `CLIN entry, amount:${clinSut.clin().clinAmount()} clinId: ${clinSut.clin().clinId()}`);
    });

test("clin with amount bigger than total awarded direct + total awarded reimbursable should not be allowed",
    function (assert: any) {
        //Arrange (setup)
        clinSut.clin().clinId("fake");
        clinSut.clin().clinAmount(totalAmount + 1);

        //Act (execute)
        var actual = !clinSut.validClin();

        //Assert (expect)        
        ok(actual, `CLIN entry, amount:${clinSut.clin().clinAmount()} clinId: ${clinSut.clin().clinId()}`);
    });

test("should calculate amount based upon a percentage",
    function () {
        //Arrange (setup)
        clinSut.clin().clinId("fake");
        clinSut.clin().clinPercentage(50);
        var expected = totalAmount / 2;

        //Act (execute)
        clinSut.updateClinAmount(clinSut.clin());
        var actual = clinSut.clin().clinAmount();

        //Assert (expect)
        deepEqual(actual, expected, `actual: ${actual} expected to be ${expected}`);
    });

test("should calculate percentage based upon an amount",
    function () {
        //Arrange (setup)
        clinSut.clin().clinId("fake");
        clinSut.clin().clinAmount(totalAmount/2);
        var expected = 50;

        //Act (execute)
        clinSut.updateClinPercent(clinSut.clin());
        var actual = clinSut.clin().clinPercentage();

        //Assert (expect)
        deepEqual(actual, expected, `actual: ${actual} expected to be ${expected}`);
    });

test("addClin should call the CLIN service",
    function () {
        //Arrange (setup)
        clinSut.clin().clinId("fake");
        clinSut.clin().clinAmount(totalAmount / 2);

        //Act (execute)
        clinSut.addClin();

        //Assert (expect)
        ok(methodHasBeenCalled.add, "svc was called");
    });

test("removeClin should remove one item and call the service",
    function () {
        //Arrange (setup)
        var fakeClin = new App.Clin("fake", 100);
        clinSut.clins.push(fakeClin);

        //Act (execute)
        clinSut.removeClin(fakeClin);

        //Assert (expect)
        ok(methodHasBeenCalled.remove, "svc was called");
    });

test("updateClin should call the service",
    function () {
        //Arrange (setup)
        var fakeClin = new App.Clin("fake", 100);

        //Act (execute)
        clinSut.updateClin(fakeClin);

        //Assert (expect)
        ok(methodHasBeenCalled.update, "svc was called");
    });


test("toggleClinEditMode should set editMode true",
    function() {
        //Arrange (setup)
        var fakeClin = new App.Clin("fake", 100);
        fakeClin.editMode(false);

        //Act (execute)
        clinSut.toggleClinEditMode(fakeClin);

        //Assert (expect)
        ok(!!fakeClin.editMode(), "toggle editMode");
    });

test("toggleClinEditMode should set editMode false",
    function() {
        //Arrange (setup)
        var fakeClin = new App.Clin("fake", 100);
        fakeClin.editMode(true);

        //Act (execute)
        clinSut.toggleClinEditMode(fakeClin);

        //Assert (expect)
        ok(!fakeClin.editMode(), "toggle editMode");
    });


test("undoClinChanges should rollback value",
    function() {
        //Arrange (setup)
        var expected = 0;
        var actual = 50000;
        var fakeClin = new App.Clin("fake", expected);
        
        //Act (execute)
        fakeClin.clinAmount(actual);
        clinSut.undoClinChanges(fakeClin);
        actual = fakeClin.clinAmount();

        //Assert (expect)
        deepEqual(fakeClin.clinAmount(), expected, `actual: ${actual} should be ${expected}`);
    });

test("addSlinToClin should call the service",
    function() {
        //Arrange (setup)
        var fakeClin = new App.Clin("fake", 100);
        clinSut.editedClin(fakeClin);
        clinSut.slin(new App.Slin({
            id: ko.observable(1),
            categoryName: ko.observable("cat1")
        }, 50));

        //Act (execute)
        clinSut.addSlinToClin();

        //Assert (expect)
        ok(methodHasBeenCalled.update, "svc was called");
        deepEqual(clinSut.editedClin().slins().length, 1);
    });

test("openSlinEditorModal should load categories",
    function() {
        //Arrange (setup)
        var fakeClin = new App.Clin("fake", 100);

        //Act (execute)
        clinSut.openSlinEditorModal(fakeClin);

        //Assert (expect)
        ok(methodHasBeenCalled.getCategories, "svc was called");
    });


test("updateSlinAmount should update amount from percentage",
    function() {
        //Arrange (setup)
        var fakeClin = new App.Clin("fake", 1000);
        clinSut.editedClin(fakeClin);
        clinSut.slin(new App.Slin({
            id: ko.observable(1),
            categoryName: ko.observable("cat1")
        }, 0, 50));
        var expected = 500
        
        //Act (execute)
        clinSut.updateSlinAmount();

        //Assert (expect)
        deepEqual(clinSut.slin().slinAmount(), expected, `expected ${clinSut.slin().slinAmount()} to be ${expected}`);
    });

test("updateSlinPercent should update percent from amount",
    function() {
        //Arrange (setup)
        var fakeClin = new App.Clin("fake", 1000);
        clinSut.editedClin(fakeClin);
        clinSut.slin(new App.Slin({
            id: ko.observable(1),
            categoryName: ko.observable("cat1")
        }, 500));
        var expected = 50

        //Act (execute)
        clinSut.updateSlinPercent();

        //Assert (expect)
        deepEqual(clinSut.slin().slinPercent(), expected, `expected ${clinSut.slin().slinPercent()} to be ${expected}`);
    });

test("removeSlinToClin should remove one item and call the service",
    function() {
        //Arrange (setup)
        var fakeClin = new App.Clin("fake", 100);
        var fakeSlin = new App.Slin({
            id: ko.observable(1),
            categoryName: ko.observable("cat1")
        }, 500);
        fakeClin.slins.push(fakeSlin);

        clinSut.clins.push(fakeClin);


        //Act (execute)
        clinSut.removeSlinToClin(fakeClin, fakeSlin);

        //Assert (expect)
        ok(methodHasBeenCalled.update, "svc was called");
    });