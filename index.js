// So far this is just an exploration into the interaction of the homebridge and homekit.
// I hope this will continue, but solving the issings with non-discrete power control
// isnt exactly my passion. I do however have some ideas that i can add to the raspberri
// to get the state of the tv directly from the world. either by reading some draw from 
// the device or by reading thr light or sound levels. 

var Service, Characteristic;
const lirc = require('node-lirc');

// const ON  = true;
// const OFF = false;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-media", "Media", Media);
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
      .setCharacteristic(Characteristic.Model, "Media Center")
      .setCharacteristic(Characteristic.SerialNumber, "000-000-003");
  
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

  setTVSourceCharacteristic(state, next) {
    lirc.send("TV", "KEY_SWITCHVIDEOMODE");
    setTimeout(function() {
      lirc.send("TV", "KEY_SWITCHVIDEOMODE");
    }, 100);
    return next(null);
  }

  getTVOnCharacteristic(next) {
    this.log("Current TV State: ", !this.tvState);
    return next(null, !this.tvState);
  }

  setTVOnCharacteristic(state, next) {
    this.tvState = state;

    if state === true {
      lirc.send("TV", "KEY_POWER");
      lirc.send("Cable", "KEY_POWER");
	  setTimeout(function() {
        lirc.send("TV", "KEY_SWITCHVIDEOMODE");
        setTimeout(function() {
          lirc.send("TV", "KEY_SWITCHVIDEOMODE");
        }, 400);
	  }, 2000)
    }
	
    return next(null);
  }
  
  getCableOnCharacteristic(next) {
    return next(null, !this.cableState);
  }

  setCableOnCharacteristic(state, next) {
    
    this.cableState = !state;
    lirc.send("Cable", "KEY_POWER");
    return next(null);
  }
  
};

