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

class Media {

  constructor(log, config) {
    this.log = log;
    this.tvState = false;
    this.cableState = false;
  }
  
  configureInformationServices() {
      let informationService = new Service.AccessoryInformation();
      informationService
        .setCharacteristic(Characteristic.Manufacturer, "David Jackman")
        .setCharacteristic(Characteristic.Model, "Media")
        .setCharacteristic(Characteristic.SerialNumber, "000-000-003");
  
      this.informationService = informationService;
  }
  
  configureTVService() {
      let tvService = new Service.Switch("TV");
      tvService.subtype = "Bravia";
      tvService
        .getCharacteristic(Characteristic.On)
          .on('get', this.getTVOnCharacteristic.bind(this))
          .on('set', this.setTVOnCharacteristic.bind(this));
    
      this.tvService = tvService;
  }

  configureCableService() {
      let cableService = new Service.Switch("Cable");
      cableService.subtype = "Cable";
      cableService
        .getCharacteristic(Characteristic.On)
          .on('get', this.getCableOnCharacteristic.bind(this))
          .on('set', this.setCableOnCharacteristic.bind(this));

      this.cableService = cableService;
  }
  
  configureSourceService() {
      let sourceService = new Service.Switch("Source");
      sourceService.subtype = "TV";
      sourceService
        .getCharacteristic(Characteristic.On)
          .on('get', this.getTVSourceCharacteristic.bind(this))
          .on('set', this.setTVSourceCharacteristic.bind(this));

      this.sourceService = sourceService;
  }
  
  configureAnimalPlanetService() {
      let animalPlanetService = new Service.Switch("Animal Planet");
      animalPlanetService.subtype = "AnimalPlanet"
      animalPlanetService
        .getCharacteristic(Characteristic.On)
          .on('set', this.changeToAnimalPlanet.bind(this))
          .on('get', this.isThisOnAnimalPlanet.bind(this));

      this.animalPlanetService = animalPlanetService;
  }
  
  configureDiscoveryService() {
      let discoveryService = new Service.Switch("Discovery");
      discoveryService.subtype = "Discovery"
      discoveryService
        .getCharacteristic(Characteristic.On)
          .on('set', this.changeToDiscovery.bind(this))
          .on('get', this.isThisOnDiscovery.bind(this));

      this.discoveryService = discoveryService;
  }

  getServices() {
    this.configureInformationServices();
	this.configureTVService();
	this.configureCableService();
    this.configureSourceService();
    this.configureAnimalPlanetService();
	this.configureDiscoveryService();
  
    return [this.informationService, this.tvService, this.cableService, this.sourceService, this.animalPlanetService, this.discoveryService];
  }

  isThisOnDiscovery(next) {
    return this.channel === "Discovery";
  }
  
  changeToDiscovery(s, next) {
    this.channel = "Discovery";
    lirc.send("Cable", "KEY_3");  
    lirc.send("Cable", "KEY_1");
    return next(null);
  }
  
  isThisOnAnimalPlanet(next) {
    return this.channel === "Animal Planet";
  }
  
  changeToAnimalPlanet(s, next) {
    this.channel = "Animal Planet";
    lirc.send("Cable", "KEY_1");  
    lirc.send("Cable", "KEY_0");
    return next(null);
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
    return next(null, this.tvState);
  }

  setTVOnCharacteristic(state, next) {
    this.tvState = state;

    lirc.send("TV", "KEY_POWER");
    lirc.send("Cable", "KEY_POWER");

    if (state) {
      setTimeout(function() {
        lirc.send("TV", "KEY_SWITCHVIDEOMODE");
        setTimeout(function() {
          lirc.send("TV", "KEY_SWITCHVIDEOMODE");
        }, 400);
      }, 2000)
    }
	
	lirc.send("Source", "KEY_1");
  
    return next(null);
  }
  
  getCableOnCharacteristic(next) {
    return next(null, this.cableState);
  }

  setCableOnCharacteristic(state, next) {
    this.cableState = state;
    lirc.send("Cable", "KEY_POWER");
    return next(null);
  }
  
};

