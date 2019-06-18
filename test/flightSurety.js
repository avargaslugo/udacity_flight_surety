var Test = require('../config/testConfig.js');
var BigNumber = require('bignumber.js');
var sharedFlight = `Flight ${Date.now()}`;
contract('Flight Surety Tests', async (accounts) => {

    var config;
    before('setup contract', async () => {
        config = await Test.Config(accounts);
        //await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address);
    });

    /****************************************************************************************/
    /* Operations and Settings                                                              */
    /****************************************************************************************/

    it(`(operational) contract is operational`, async function () {

        // Get operating status
        let operational = await config.flightSuretyApp.isOperational();

        assert.equal(operational, true, "contract should be operational when deployed");

    });

    it(`(airline) contract is deployed with first airline registered`, async function () {

        // Get operating status
        let registeredTrue = await config.flightSuretyApp.isAirline(config.owner);
        let registeredFalse =  await config.flightSuretyApp.isAirline(accounts[2]);
        let registeredFalse2 =  await config.flightSuretyApp.isAirline(accounts[3]);
        let registeredFalse3 =  await config.flightSuretyApp.isAirline(accounts[4]);
        let registeredFalse4 =  await config.flightSuretyApp.isAirline(accounts[10]);

        let numberOfRegistered = await config.flightSuretyApp.getNumberOfRegisteredAirlines();
        assert.equal(registeredTrue, true, "first airline was not registered correctly");

        assert.equal(registeredFalse, false, "for some reason and unwanted airline was registered during deployment");
        assert.equal(registeredFalse2, false, "for some reason and unwanted airline was registered during deployment");
        assert.equal(registeredFalse3, false, "for some reason and unwanted airline was registered during deployment");
        assert.equal(registeredFalse4, false, "for some reason and unwanted airline was registered during deployment");

        assert.equal(numberOfRegistered, 1, "Registered airline counter was not increased");


    });

    it(`(airline) Only existing can register a new airline a new airline`, async function () {

        // check that sending address is a registered as expected
        let registeredCheck = await config.flightSuretyApp.isAirline(config.owner);
        assert.equal(registeredCheck, true, "sender airline is registered");
        // registered airline adds a new airline to the registry
        await config.flightSuretyApp.registerAirline(config.firstAirline, {from: config.owner});
        // check that new airline is registered correctly
        let registeredTrue = await config.flightSuretyApp.isAirline(config.firstAirline);
        let numberOfRegistered = await config.flightSuretyApp.getNumberOfRegisteredAirlines();

        assert.equal(registeredTrue, true, "first airline was not registered");
        assert.equal(numberOfRegistered, 2, "Registered airline counter was not increased");
    });
    /*
    it(`(multiparty) Only existing airline may register a new airline until there are at least four airlines registered`, async function () {

        let numberOfRegistered2 = await config.flightSuretyApp.getNumberOfRegisteredAirlines();
        assert.equal(numberOfRegistered2, 2, "number of registered airlines is not the expected one")

        // register third and 4th airline
        await config.flightSuretyApp.registerAirline(config.testAddresses[3]);
        await config.flightSuretyApp.registerAirline(config.testAddresses[4]);

        let numberOfRegistered4 = await config.flightSuretyApp.getNumberOfRegisteredAirlines();
        assert.equal(numberOfRegistered4, 4, "number of registered airlines is not the expected one")

        // 5th airline is not registered
        await config.flightSuretyApp.registerAirline(config.testAddresses[5]);
        let numberOfRegistered5 = await config.flightSuretyApp.getNumberOfRegisteredAirlines();
        assert.equal(numberOfRegistered5, 4, "number of registered airlines is not the expected one")

        // a second vote should register it
        await config.flightSuretyApp.registerAirline(config.testAddresses[5], {from: config.accounts[3]});
        //let numberOfRegistered5second = await config.flightSuretyApp.getNumberOfRegisteredAirlines();
        //assert.equal(numberOfRegistered5second, 5, "number of registered airlines is not the expected one")


    }); */



});
