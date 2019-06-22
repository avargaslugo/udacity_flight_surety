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

        // contract is deployed with the owner being registered as an airline but no funding
        let registeredTrue = await config.flightSuretyApp.isAirline(config.owner);
        let funding = await config.flightSuretyApp.fetchFunding(config.owner);
        let funded = await config.flightSuretyApp.isFunded(config.owner);

        assert.equal(registeredTrue, true, "first airline was not registered correctly");
        assert.equal(funding, 0, 'airline has some unwanted funding');
        assert.equal(funded, false, "airline status appears to be funded when it shouldnt ");

        let registeredFalse =  await config.flightSuretyApp.isAirline(accounts[1]);
        let registeredFalse2 =  await config.flightSuretyApp.isAirline(accounts[2]);
        let registeredFalse3 =  await config.flightSuretyApp.isAirline(accounts[3]);
        let registeredFalse4 =  await config.flightSuretyApp.isAirline(accounts[4]);

        let numberOfRegistered = await config.flightSuretyApp.getNumberOfRegisteredAirlines();


        assert.equal(registeredFalse, false, "for some reason and unwanted airline was registered during deployment");
        assert.equal(registeredFalse2, false, "for some reason and unwanted airline was registered during deployment");
        assert.equal(registeredFalse3, false, "for some reason and unwanted airline was registered during deployment");
        assert.equal(registeredFalse4, false, "for some reason and unwanted airline was registered during deployment");

        assert.equal(numberOfRegistered, 1, "Registered airline counter was not increased");


    });

    it(`(airline) Registered airline can register a new airline`, async function () {

        // registered airline fails to adds a new airline to the registry due to lack of funding
        let successRegister = true;
        try{
            await config.flightSuretyApp.registerAirline(config.firstAirline, {from: config.owner});
        }
        catch (e) {
            successRegister = false
        }
        assert.equal(successRegister, false, "unfunded airline register an other airline");

        await config.flightSuretyApp.fund.sendTransaction(config.owner, {from: config.owner, value: 10});




        // check that new airline is registered correctly
        //let registeredTrue = await config.flightSuretyApp.isAirline(config.firstAirline);
        //let numberOfRegistered = await config.flightSuretyApp.getNumberOfRegisteredAirlines();

        //assert.equal(registeredTrue, true, "first airline was not registered");
        //assert.equal(numberOfRegistered, 2, "Registered airline counter was not increased");
    });

    /*

    it(`(airline) Not registered airline cannot register a new airline a new airline`, async function () {

        try{
            await config.flightSuretyApp.registerAirline(accounts[4], {from: accounts[3]});
        }
        catch (e) {

        }

        // check that new airline is registered correctly
        let registeredFalse = await config.flightSuretyApp.isAirline(accounts[4]);
        let numberOfRegistered = await config.flightSuretyApp.getNumberOfRegisteredAirlines();

        assert.equal(registeredFalse, false, "first airline was not registered");
        assert.equal(numberOfRegistered, 2, "Registered airline counter was not increased");
    });



    it(`(multiparty) Up to 4 airlines can be registered without consensus`, async function () {

        let fifthAirline = accounts[4]
        // register third and 4th airline
        await config.flightSuretyApp.registerAirline(accounts[2]);
        await config.flightSuretyApp.registerAirline(accounts[3]);

        let numberOfRegistered1 = await config.flightSuretyApp.getNumberOfRegisteredAirlines();
        assert.equal(numberOfRegistered1, 4, "");

        await config.flightSuretyApp.registerAirline(fifthAirline);
        let isAirlineFalse = await config.flightSuretyApp.isAirline(fifthAirline);
        let numberOfRegistered2 = await config.flightSuretyApp.getNumberOfRegisteredAirlines();
        assert.equal(numberOfRegistered2, 4, "");
        assert.equal(isAirlineFalse, false, "5th airline was registered without multiparty consensus");

        // since the number of airlines is 4 we need an extra vote to register the fifth airline
        await config.flightSuretyApp.registerAirline(fifthAirline, {from: accounts[2]});
        let isAirlineTrue = await config.flightSuretyApp.isAirline(fifthAirline);
        let numberOfRegistered3 = await config.flightSuretyApp.getNumberOfRegisteredAirlines();
        assert.equal(numberOfRegistered3, 5, "");
        assert.equal(isAirlineTrue, true, "5th airline was not registered");


    });*/



});
