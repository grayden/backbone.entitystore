describe("Backbone.EntityStore", function () {
  
  it("should exist", function () {
    expect(Backbone.EntityStore).toBeDefined();
  });

  describe ("when requesting a model", function () {
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

      this.xhr = sinon.useFakeXMLHttpRequest();
      var requests = this.requests = []

      this.xhr.onCreate = function (xhr) {
        requests.push(xhr);
      };
    });

    afterEach(function () {
      this.xhr.restore();
    });

    it("should be able to get a model that is not in the collection using and ajax request", function () {
      var spy = jasmine.createSpy('callback');
      this.entityStore.get(1).done(spy);
      this.requests[0].respond(200, { "Content-type": "application/json" }, '{ "id": 1 }');
      expect(spy).toHaveBeenCalled();
    });


    it("should add a fetched model to the collection so that it doesn't need to be fetched again", function () {
      this.entityStore.get(1);
      this.requests[0].respond(200, { "Content-type": "application/json" }, '{ "id": 1, "name": "jimmy" }');

      expect(this.entityStore.collection.length).toBe(1);
      
      var aKiwi = this.entityStore.get(1);
      expect(aKiwi.get("name")).toBe("jimmy");
    });

    it("should be able to fetch a model by model", function () {
      var model = new this.KiwiModel({id : 1});
      var spy = jasmine.createSpy("callback");

      var fetchedModel = this.entityStore.get(model);
      fetchedModel.done(spy);
      this.requests[0].respond(200, { "Content-type": "application/json" }, '{ "id": 1 }');
      expect(spy).toHaveBeenCalled();
    });
  });
});
