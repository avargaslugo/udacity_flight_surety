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
        let registeredTrue = await config.flightSuretyApp.isAirline(config.firstAirline);
        let registeredFalse =  await config.flightSuretyApp.isAirline(config.testAddresses[2]);
        assert.equal(registeredTrue, true, "first airline was not registered correctly");
        assert.equal(registeredFalse, false, "for some reason and unwanted airline was registered during deployment");

    });

    it(`(airline) Only existing airline may register a new airline until there are at least four airlines registered`, async function () {

        let v = await config.flightSuretyApp.registerAirline(config.testAddresses[2], {from: config.firstAirline})
        // address 4 tries to register account 3 as an airline
        try{
            await config.flightSuretyApp.registerAirline(config.testAddresses[3], {from: config.testAddresses[4]})
        }
        catch (e) {
        }

        let registeredTrue = await config.flightSuretyApp.isAirline(config.testAddresses[2]);
        let registeredFalse =  await config.flightSuretyApp.isAirline(config.testAddresses[3]);

        assert.equal(registeredTrue, true, "airline was not registered correctly");
        assert.equal(registeredFalse, false, "an unregistered airline was able to register a new airline");


    });



});
