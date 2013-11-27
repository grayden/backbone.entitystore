describe("Backbone.EntityStore", function () {

  beforeEach(function () {
    var KiwiModel = this.KiwiModel = Backbone.Model.extend({
      url: '/api/kiwis'
    });

    this.KiwiStore = Backbone.EntityStore.extend({
      url: '/api/kiwis',
      model: KiwiModel
    });

    this.entityStore = new this.KiwiStore();
  });

  describe("startup", function () {
    it("should exist", function () {
      expect(Backbone.EntityStore).toBeDefined();
    });

    it("should be instantiated", function () {
      expect(this.entityStore).toBeTruthy();
    });

    it("should have its properties", function () {
      expect(this.entityStore.url).toBe('/api/kiwis');
      expect(this.entityStore.model).toBe(this.KiwiModel);
    });
  });

  describe ("requesting a model", function () {
    beforeEach(function () {
      this.spy = jasmine.createSpy("callback");
    });

    describe("from the collection", function () {
      beforeEach(function () {
        this.entityStore.add(
          { id: 1, name: "kiwi" }
        ) 
      });

      it("should be able to fetch a model by id", function () {
        var fetchedModel = this.entityStore.request(1);
        fetchedModel.done(this.spy);
        expect(this.spy.mostRecentCall.args[0].get('name')).toBe('kiwi');
      });

      it("should be able to fetch a model by model", function () {
        var model = new this.KiwiModel({id : 1});
        var fetchedModel = this.entityStore.request(model).done(this.spy);
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

      it("should be able to get a model that is not in the collection using an ajax request", function () {
        this.entityStore.request(1).done(this.spy);
        this.requests[0].respond(200, { "Content-type": "application/json" }, '{ "id": 1 }');
        expect(this.spy).toHaveBeenCalled();
      });


      it("it should add the model to the collection after it has been fecthed", function () {
        this.entityStore.request(1);
        this.requests[0].respond(200, { "Content-type": "application/json" }, '{ "id": 1 }');
        expect(this.entityStore.length).toBe(1);
      });

      afterEach(function () {
        this.xhr.restore();
      });
    });
  });

  describe("building a proxy collection", function () {
    beforeEach(function () {
      this.entityStore.add([
        {id: 1, a:1},
        {id: 2, a:2},
        {id: 3, a:3}
      ]);
    });

    describe("mapped collection", function () {

      var mapped;

      beforeEach(function () {
        mapped = this.entityStore.proxyMapped(function (model) {
          return {id: model.id, a: model.get('a')*2};
        });
      });

      it("should be able to build a mapped collection", function () {
        expect(mapped.length).toBe(3);

        expect(mapped.at(0).get('a')).toBe(2);
        expect(mapped.at(1).get('a')).toBe(4);
        expect(mapped.at(2).get('a')).toBe(6);
      });

      it("should not be able to add a model to the original collection through the mapped collection", function () {
        expect(mapped.add).toThrow(new Error("Cannot add models on a mapped collection."));
        expect(mapped.length).toBe(3);
        expect(this.entityStore.length).toBe(3);
      });

      it("should be able to remove a model on the original collection from the mapped collection", function () {
        var firstModel = mapped.first();
        mapped.remove(firstModel);
        
        expect(this.entityStore.length).toBe(2);
        expect(this.entityStore.first().id).not.toBe(firstModel.id);
      });
    });
  });
});
