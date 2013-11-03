describe("Backbone.EntityStore", function () {
  
  it("should exist", function () {
    expect(Backbone.EntityStore).toBeDefined();
  });

  describe ("when requesting a model", function () {
    beforeEach(function () {
      var KiwiModel = Backbone.Model.extend({
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
  });
});
