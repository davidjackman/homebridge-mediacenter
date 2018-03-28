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
	this.channel = "None";
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

  configureNickelodeonService() {
      let nickelodeonService = new Service.Switch("Nickle oh deaan");
      nickelodeonService.subtype = "Nickelodeon"
      nickelodeonService
        .getCharacteristic(Characteristic.On)
          .on('set', this.changeToNickelodeon.bind(this))
          .on('get', this.isThisOnNickelodeon.bind(this));

      this.nickelodeonService = nickelodeonService;
  }

  configureNickJuniorService() {
      let nickJuniorService = new Service.Switch("Nick junior");
      nickJuniorService.subtype = "Nick Junior"
      nickJuniorService
        .getCharacteristic(Characteristic.On)
          .on('set', this.changeToNickJunior.bind(this))
          .on('get', this.isThisOnNickJunior.bind(this));

      this.nickJuniorService = nickJuniorService;
  }

  configureFoxService() {
      let foxService = new Service.Switch("Fox");
      foxService.subtype = "Fox"
      foxService
        .getCharacteristic(Characteristic.On)
          .on('set', this.changeToFox.bind(this))
          .on('get', this.isThisOnFox.bind(this));

      this.foxService = foxService;
  }

  configureEService() {
      let eService = new Service.Switch("Eeee");
      eService.subtype = "Eeee"
      eService
        .getCharacteristic(Characteristic.On)
          .on('set', this.changeToE.bind(this))
          .on('get', this.isThisOnE.bind(this));

      this.eService = eService;
  }

  configureComedyService() {
      let comedyService = new Service.Switch("Comedy");
      comedyService.subtype = "Comedy"
      comedyService
        .getCharacteristic(Characteristic.On)
          .on('set', this.changeToComedy.bind(this))
          .on('get', this.isThisOnComedy.bind(this));

      this.comedyService = comedyService;
  }
  
  configureHDEService() {
      let HDEService = new Service.Switch("HDE");
      HDEService.subtype = "HDE"
      HDEService
        .getCharacteristic(Characteristic.On)
          .on('set', this.changeToHDE.bind(this))
          .on('get', this.isThisOnHDE.bind(this));

      this.HDEService = HDEService;
  }
  
  configureSourceTVService() {
      let SourceTVService = new Service.Switch("SourceTV");
      SourceTVService.subtype = "SourceTV"
      SourceTVService
        .getCharacteristic(Characteristic.On)
          .on('set', this.changeToSourceTV.bind(this))
          .on('get', this.isThisOnSourceTV.bind(this));

      this.SourceTVService = SourceTVService;
  }

  configureSourceAppleService() {
      let SourceAppleService = new Service.Switch("SourceApple");
      SourceAppleService.subtype = "SourceAppleTV"
      SourceAppleService
        .getCharacteristic(Characteristic.On)
          .on('set', this.changeToSourceApple.bind(this))
          .on('get', this.isThisOnSourceApple.bind(this));

      this.SourceAppleService = SourceAppleService;
  }

  getServices() {
    this.configureInformationServices();
	this.configureTVService();
	this.configureCableService();
    this.configureSourceService();
    this.configureAnimalPlanetService();
	this.configureDiscoveryService();
	this.configureNickelodeonService();
	this.configureNickJuniorService();
	this.configureComedyService();
	this.configureEService();
	this.configureFoxService();
	this.configureHDEService();
	this.configureSourceTVService();
	this.configureSourceAppleService();
  
    return [this.informationService, 
		this.tvService,
		this.cableService, 
		this.sourceService, 
		this.animalPlanetService, 
		this.discoveryService,
		this.nickelodeonService,
		this.nickJuniorService,
	    this.comedyService,
		this.eService,
	    this.foxService,
	    this.HDEService,
	    this.SourceTVService,
	    this.SourceAppleService];
  }

  isThisOnSourceApple(next) {
    return next(null, (this.source === "AppleTV"));
  }
  
  changeToSourceApple(s, next) {
    this.source = "AppleTV";
    lirc.send("Source", "KEY_2");  
    return next(null);
  }
  
  isThisOnSourceTV(next) {
    return next(null, (this.source === "TV"));
  }
  
  changeToSourceTV(s, next) {
    this.source = "TV";
    lirc.send("Source", "KEY_1");  
    return next(null);
  }
  
  sendKeyForLetter(char) {
    if (char === '0') {
      lirc.send("Cable", "KEY_0");
    } else if (char === '1') {
      lirc.send("Cable", "KEY_1");
    } else if (char === '2') {
      lirc.send("Cable", "KEY_2");
    } else if (char === '3') {
      lirc.send("Cable", "KEY_3");
    } else if (char === '4') {
      lirc.send("Cable", "KEY_4");
    } else if (char === '5') {
      lirc.send("Cable", "KEY_5");
    } else if (char === '6') {
      lirc.send("Cable", "KEY_6");
    } else if (char === '7') {
      lirc.send("Cable", "KEY_7");
    } else if (char === '8') {
      lirc.send("Cable", "KEY_8");
    } else if (char === '9') {
      lirc.send("Cable", "KEY_9");
    } 
  }
  
  changeToChannel(channel) {
    let char = channel.charAt(0);
    if (char != null) {
      this.sendKeyForLetter(char);
    }
    setTimeout(function() {
	let substring = channel.substr(1);
      this.changeToChannel(substring);
	}, 200);
  }
  
  isThisOnHDE(next) {
    return next(null, (this.channel === "HDE"));
  }
  
  changeToHDE(s, next) {
    this.channel = "HDE";
	console.log("Changing Channel to 1351");
	this.changeToChannel("1351");
    return next(null);
  }
  
  isThisOnComedy(next) {
    return next(null, (this.channel === "Comedy"));
  }
  
  changeToComedy(s, next) {
    this.channel = "Comedy";
	changeToChannel("62");
    // lirc.send("Cable", "KEY_6");
    // lirc.send("Cable", "KEY_2");
    return next(null);
  }
  
  isThisOnFox(next) {
    return next(null, (this.channel === "Fox"));
  }
  
  changeToFox(s, next) {
    this.channel = "Fox";
    lirc.send("Cable", "KEY_1");  
    lirc.send("Cable", "KEY_0");
    return next(null);
  }
  
  isThisOnE(next) {
    return next(null, (this.channel === "E"));
  }
  
  changeToE(s, next) {
    this.channel = "E";
    lirc.send("Cable", "KEY_5");  
    lirc.send("Cable", "KEY_6");
    return next(null);
  }
  
  isThisOnNickelodeon(next) {
    return next(null, (this.channel === "Nickelodeon"));
  }
  
  changeToNickelodeon(s, next) {
    this.channel = "Nickelodeon";
    lirc.send("Cable", "KEY_2");  
    lirc.send("Cable", "KEY_5");
    lirc.send("Cable", "KEY_8");
    return next(null);
  }
  
  isThisOnNickJunior(next) {
    return next(null, (this.channel === "Nick Junior"));
  }
  
  changeToNickJunior(s, next) {
    this.channel = "Nick Junior";
    lirc.send("Cable", "KEY_2");  
    lirc.send("Cable", "KEY_5");
    lirc.send("Cable", "KEY_7");
    return next(null);
  }
  
  isThisOnDiscovery(next) {
    return next(null, (this.channel === "Discovery"));
  }
  
  changeToDiscovery(s, next) {
    this.channel = "Discovery";
    lirc.send("Cable", "KEY_3");  
    lirc.send("Cable", "KEY_1");
    return next(null);
  }
  
  isThisOnAnimalPlanet(next) {
    return next(null, (this.channel === "Animal Planet"));
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

