pragma solidity ^0.4.25;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private contractOwner;                                      // Account used to deploy contract
    bool private operational = true;                                    // Blocks all state changes throughout the contract if false
    address[] multiCalls = new address[](0);

    struct Airline {
        bool isRegistered;
        bool isFunded;
        uint256 funds;
    }

    struct Flight {
        bool isRegistered;
        uint8 statusCode;
        uint256 updatedTimestamp;
        address airline;
    }
    // registered files
    mapping(bytes32 => Flight) private flights;
    // registered airlines
    mapping(address => Airline) private airlines;
    // registered airlines
    //address[] registeredAirline = new address[](0);
    uint256 numberOfRegisteredAirlines = 0;


    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/


    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor() public
    {
        contractOwner = msg.sender;
        airlines[contractOwner] = Airline({isRegistered:true, isFunded:false, funds:0});
        numberOfRegisteredAirlines += 1;

    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in 
    *      the event there is an issue that needs to be fixed
    */
    modifier requireIsOperational() 
    {
        require(operational, "Contract is currently not operational");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    modifier requireFunding(address airline){
        require(airlines[airline].isFunded, "Airline needs to be funded to call this function");
        _;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /**
    * @dev Get operating status of contract
    *
    * @return A bool that is the current operating status
    */      
    function isOperational() 
                            public 
                            view 
                            returns(bool) 
    {
        return operational;
    }


    /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */    
    function setOperatingStatus(bool mode) external requireContractOwner
    {
        operational = mode;
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

   /**
    * @dev Add an airline to the registration queue
    *      Can only be called from FlightSuretyApp contract
    *
    */   
    function registerAirline(address _airline, address _registeringAirline) public requireIsOperational
    requireFunding(_registeringAirline) returns(bool success, uint votes)
    {
        require(!airlines[_airline].isRegistered, "Airline already registered");
        if(numberOfRegisteredAirlines < 4){
            airlines[_airline] = Airline({isRegistered:true, isFunded:false, funds: 0});
            numberOfRegisteredAirlines += 1;
            return (true, 0);
        }
        else{
            // checks if sender has emitted a vote
            bool isDuplicate = false;
            for(uint c=0; c<multiCalls.length; c++) {
                    if (multiCalls[c] == _registeringAirline) {
                        isDuplicate = true;
                        break;
                    }
                }

            require(!isDuplicate, "Caller has already called this function.");
            // if registering airline has not voted, the vote is added
            multiCalls.push(_registeringAirline);
            votes = multiCalls.length;
            // checks if enough votes were emitted in order to accept the new airline
            if (votes >= numberOfRegisteredAirlines.div(2)) {
                    airlines[_airline] = Airline({isRegistered: true, isFunded:false, funds:0});
                    // resets multiCalls array
                    multiCalls = new address[](0);
                    numberOfRegisteredAirlines++;
                    //emit RegisterAirline(airline);   // Log airline registration event

                }


        }


    }


   /**
    * @dev Buy insurance for a flight
    *
    */   
    function buy
                            (                             
                            )
                            external
                            payable
    {

    }

    /**
     *  @dev Credits payouts to insurees
    */
    function creditInsurees
                                (
                                )
                                external
                                pure
    {
    }
    

    /**
     *  @dev Transfers eligible payout funds to insuree
     *
    */
    function pay
                            (
                            )
                            external
                            pure
    {
    }

   /**
    * @dev Initial funding for the insurance. Unless there are too many delayed flights
    *      resulting in insurance payouts, the contract should be self-sustaining
    *
    */   
    function fund(address airlineToFund) public payable requireIsOperational
    {
        // airlineToFund is registered
        require(airlines[airlineToFund].isRegistered, "Airline not registered");
        if (!airlines[airlineToFund].isFunded){
            require(msg.value >= 10, "First funding of an airline should be 10 ETH");
        }

        // current balance for target airline
        uint256 currentFunding = airlines[airlineToFund].funds;
        airlines[airlineToFund].funds = currentFunding.add(msg.value);
        airlineToFund.transfer(msg.value);

    }


    function getFlightKey
                        (
                            address airline,
                            string memory flight,
                            uint256 timestamp
                        )
                        pure
                        internal
                        returns(bytes32) 
    {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    /**
    * @dev Fallback function for funding smart contract.
    *
    function() external payable
    {
        fund();
    }
    */


    function isAirline(address airline) external view returns (bool){
        return airlines[airline].isRegistered;
    }

    function fetchFunding(address airline) external view returns (uint256){
        return airlines[airline].funds;
    }

    function isFunded(address airline) external view returns (bool){
        return airlines[airline].isFunded;
    }

    function getNumberOfRegisteredAirlines() external view returns (uint256) {
        return numberOfRegisteredAirlines;
    }



    // todo: add function for counting number of funded airlines




}

