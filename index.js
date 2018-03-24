var Service, Characteristic;
const lirc = require('node-lirc');

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-mediacenter", "MediaCenter", MediaCenter);
}

class MediaCenter {

  constructor(log, config) {
    this.log = log;
    this.tvState = false;
    this.cableState = false;
  }

  getServices() {
    let informationService = new Service.AccessoryInformation();
    informationService
      .setCharacteristic(Characteristic.Manufacturer, "David Jackman")
      .setCharacteristic(Characteristic.Model, "MediaCenter")
      .setCharacteristic(Characteristic.SerialNumber, "000-000-002");
  
    let tvService = new Service.Switch("TV");
    tvService.subtype = "Bravia";
    tvService
      .getCharacteristic(Characteristic.On)
        .on('get', this.getTVOnCharacteristic.bind(this))
        .on('set', this.setTVOnCharacteristic.bind(this));
    
    this.informationService = informationService;
    this.tvService = tvService;

    let cableService = new Service.Switch("Cable");
    cableService.subtype = "Cable";
    cableService
      .getCharacteristic(Characteristic.On)
        .on('get', this.getCableOnCharacteristic.bind(this))
        .on('set', this.setCableOnCharacteristic.bind(this));

    this.cableService = cableService

    let sourceService = new Service.Switch("Source");
    sourceService.subtype = "TV";
    sourceService
      .getCharacteristic(Characteristic.On)
        .on('get', this.getTVSourceCharacteristic.bind(this))
        .on('set', this.setTVSourceCharacteristic.bind(this));

    this.sourceService = sourceService

    return [informationService, tvService, cableService, sourceService];
  }

  getTVSourceCharacteristic(next) {
    return next(null, false);
  }

  getTVSourceCableCharacteristic(next) {
    return next(null, false);
  }

  setTVSourceCharacteristic(state, next) {
    lirc.send("TV", "KEY_SWITCHVIDEOMODE");
    setTimeout(function() {
      lirc.send("TV", "KEY_SWITCHVIDEOMODE");
    }, 100);
    return next(null);
  }

  setTVSourceCableCharacteristic(state, next) {
    lirc.send("TV", "KEY_SWITCHVIDEOMODE");
    setTimeout(function() {
      lirc.send("TV", "KEY_SWITCHVIDEOMODE");
    }, 400);
    setTimeout(function() {
      lirc.send("TV", "KEY_SWITCHVIDEOMODE");
    }, 800);
    setTimeout(function() {
      lirc.send("TV", "KEY_SWITCHVIDEOMODE");
    }, 1200);
    setTimeout(function() {
      lirc.send("TV", "KEY_SWITCHVIDEOMODE");
    }, 1600);
    return next(null);
  }

  getTVOnCharacteristic(next) {
    this.log("Current TV State: ", !this.tvState);
    return next(null, !this.tvState);
  }

  getCableOnCharacteristic(next) {
    return next(null, !this.cableState);
  }

  setCableOnCharacteristic(state, next) {
    this.cableState = !state;
    lirc.send("Cable", "KEY_POWER");
    return next(null);
  }

  setTVOnCharacteristic(state, next) {
    this.tvState = !state;
    this.log("This thing wants:", state);

    lirc.send("TV", "KEY_POWER");
    return next(null);
  }
};

