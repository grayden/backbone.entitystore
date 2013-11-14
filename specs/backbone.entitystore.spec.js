describe("Backbone.EntityStore", function () {
  
  it("should exist", function () {
    expect(Backbone.EntityStore).toBeDefined();
  });

  describe ("requesting a model", function () {
    beforeEach(function () {
      var KiwiModel = this.KiwiModel = Backbone.Model.extend({
        url: '/api/kiwis'
      });

      var KiwiCollection = Backbone.Collection.extend({
        url: '/api/kiwis',
        model: KiwiModel
      });
      this.entityStore = new Backbone.EntityStore({
        model: KiwiModel,
        collection: KiwiCollection
      });

      this.spy = jasmine.createSpy("callback");
    });

    describe("from the collection", function () {
      beforeEach(function () {
        this.entityStore.collection.add(
          { id: 1, name: "kiwi" }
        ) 
      });

      it("should be able to fetch a model by id", function () {
        var fetchedModel = this.entityStore.get(1);
        fetchedModel.done(this.spy);
        expect(this.spy.mostRecentCall.args[0].get('name')).toBe('kiwi');
      });

      it("should be able to fetch a model by model", function () {
        var model = new this.KiwiModel({id : 1});
        var fetchedModel = this.entityStore.get(model).done(this.spy);
        expect(this.spy.mostRecentCall.args[0].get('name')).toBe('kiwi');
      });

    });

    describe("from the server", function () {
      beforeEach(function () {
        this.xhr = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = []

        this.xhr.onCreate = function (xhr) {
          requests.push(xhr);
        };
      });

      it("should be able to get a model that is not in the collection using and ajax request", function () {
        this.entityStore.get(1).done(this.spy);
        this.requests[0].respond(200, { "Content-type": "application/json" }, '{ "id": 1 }');
        expect(this.spy).toHaveBeenCalled();
      });


      it("it should add the model to the collection after it has been fecthed", function () {
        this.entityStore.get(1);
        this.requests[0].respond(200, { "Content-type": "application/json" }, '{ "id": 1 }');
        expect(this.entityStore.collection.length).toBe(1);
      });

      afterEach(function () {
        this.xhr.restore();
      });
    });
  });
});
