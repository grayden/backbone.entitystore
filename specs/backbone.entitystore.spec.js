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
    });

    describe("from the collection", function () {
      beforeEach(function () {
        this.entityStore.collection.add(
          { id: 1, name: "kiwi" }
        ) 
      });

      it("should be able to fetch a model by model", function () {
        var model = new this.KiwiModel({id : 1});
        var fetchedModel = this.entityStore.get(model);
        expect(fetchedModel.get('name')).toBe('kiwi');
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


      afterEach(function () {
        this.xhr.restore();
      });
    });
  });
});
