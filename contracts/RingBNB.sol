// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract RingBNB {
    using SafeMath for uint256;

    uint256 public constant REFERRER_CODE = 4000;
    uint256 public constant PENALTY_STEP = 250;
    uint256 public constant PERCENTS_DIVIDER = 1000;
    uint256 public constant MAX_TOP_REFERENTS = 5;

    uint256 public constant DEVELOPER_RATE = 300;
    uint256 public constant REFERRAL_REWARD_RATE = 300;
    uint256 public constant RESERVE_RATE = 200;
    uint256 public constant MARKETING_RATE = 200;

    uint256 public constant AMOUNT_BY_FIRE = 1 ether;
    uint256 public constant AMOUNT_BY_EARTH = 0.5 ether;
    uint256 public constant AMOUNT_BY_WATER = 0.2 ether;
    uint256 public constant REWARD_BY_FIRE = 10 ether;
    uint256 public constant REWARD_BY_EARTH = 3 ether;
    uint256 public constant REWARD_BY_WATER = 0.4 ether;
    uint8 public constant MAX_PARTICIPANT_FIRE = 15;
    uint8 public constant MAX_PARTICIPANT_EARTH = 7;
    uint8 public constant MAX_PARTICIPANT_WATER = 3;

    address payable public developerAccount;
    address payable public marketingAccount;
    address payable public reserveAccount;
    uint256 public totalStaked;
    uint256 public insuranceFunds;
    uint256 public totalFundsTopReferents;
    uint256 public lastPayment;

    uint256 public latestReferredCode;
    mapping(address => uint256) public address2index;
    mapping(uint256 => Investor) public index2Investor;
    mapping(uint256 => Investment) public index2Investment;
    mapping(uint8 => uint256) public plan2amount;

    Ring[] internal rings;
    uint8[] internal plans = [0,1,2,3,4,5];
    uint256 internal ringIndex;
    uint256 internal indexInvestment;


    struct Ring {
        uint256 index;
        uint256 balance;
        uint256 amount;
        uint256 reward;
        uint8 maxInvestors;
        uint256[] investments;
        uint256 startDate;
        uint8 plan;
        bool finished;
    }

    struct Investor {
        address payable addr;
        uint256 referrer;
        Investment[] investments;
        uint256[] refs;
    }

    struct Investment {
        uint256 indexInvestment;
        uint256 indexInvestor;
        uint256 ring;
        uint256 investmentDate;
        bool payed;
    }

    event onInvest(address _address, uint256 _ringIndex);
    event onWithdrawn(address indexed user);
    event onRingComplete(uint256 _indexRing);

    constructor() public {
        _initPlans();
        indexInvestment = 0;
        latestReferredCode = REFERRER_CODE;
        indexInvestment = 1000;
        ringIndex = 2000;
    }

    function _initPlans() private{
        plan2amount[0] = 0.2 ether;
        plan2amount[1] = 0.5 ether;
        plan2amount[2] = 1 ether;
        plan2amount[3] = 5 ether;
        plan2amount[4] = 10 ether;
        plan2amount[5] = 50 ether;

        createRing(plan2amount[0], 0.4 ether, 3, 0);
        createRing(plan2amount[1], 3 ether, 7, 1);
        createRing(plan2amount[2], 10 ether, 10, 2);
        createRing(plan2amount[3], 12.5 ether, 3, 3);
        createRing(plan2amount[4], 25 ether, 3, 4);
        createRing(plan2amount[5], 125 ether, 3, 5);
    }

    function withdraw() public{
        uint256 _indexInvestor = address2index[msg.sender];
        require(_indexInvestor != 0, "Can not withdraw because no any investments");

        uint256 _totalAmount = getTotalInvested(_indexInvestor);
        uint256 _penaltyAmount = calculatePenalty(_totalAmount);

        _totalAmount = _totalAmount.sub(_penaltyAmount);

        msg.sender.transfer(_totalAmount);

        emit onWithdrawn(msg.sender);
    }

    function invest(uint8 _plan, uint256 _referrer) public payable{
        require(msg.value == plan2amount[_plan], "The amount to be invested must be the one requested by the plan.");

        uint256 _ringInvested;
        uint256 _indexInvestor = address2index[msg.sender];

        if(_indexInvestor == 0) {
            // Create if not exists
            address2index[msg.sender] = latestReferredCode;
            index2Investor[latestReferredCode].addr = msg.sender;
            index2Investor[latestReferredCode].referrer = latestReferredCode;
            _indexInvestor = latestReferredCode;
        }

        require(index2Investor[_indexInvestor].investments.length < plans.length, "Maximum possible investments");

        for(uint256 i=0;i<rings.length;i++) {
            if(rings[i].plan == _plan && rings[i].investments.length < rings[i].maxInvestors){
                _ringInvested = i;
                Investment memory _invest = Investment(indexInvestment, _indexInvestor, _ringInvested, block.timestamp, false);

                index2Investment[indexInvestment] = _invest;
                index2Investor[_indexInvestor].investments.push(_invest);
                rings[_ringInvested].investments.push(indexInvestment);
                indexInvestment++;
                break;
            }
        }

        totalStaked = totalStaked.add(rings[_ringInvested].amount);
        rings[_ringInvested].balance += rings[_ringInvested].amount;

        if(_referrer != 0) {
            index2Investor[_referrer].refs.push(latestReferredCode);
        }
        
        latestReferredCode++;
        emit onInvest(msg.sender, _ringInvested);
    }

    function createRing(uint256 _amount, uint256 _reward,
                        uint8 _maxInvestor, uint8 _plan) internal{
        rings.push(Ring({
            index : ringIndex,
            balance : 0,
            amount : _amount,
            reward : _reward,
            maxInvestors : _maxInvestor,
            startDate : block.timestamp,
            plan : _plan,
            finished : false,
            investments : new uint[](0)
        }));
        ringIndex++;
    }

    /*function changeOnRing(uint256 _indexRing) public{
        if(rings[_indexRing].maxInvestors == rings[_indexRing].investments.length) {
            divideRing(_indexRing);
            emit onRingComplete(_indexRing);
        }
    }

    function payRing(uint256 _indexRing) private{
        require(rings[_indexRing].finished == true, "This ring has already been paid for.");
        require(rings[_indexRing].investments.length < rings[_indexRing].maxInvestors, "Not all investors are there yet.");

        uint256 _reward = rings[_indexRing].reward;
        uint256 commissionAmount = rings[_indexRing].amount.mul(rings[_indexRing].maxInvestors).sub(_reward);
        uint256 developAmount = commissionAmount.mul(DEVELOPER_RATE).div(PERCENTS_DIVIDER);
        uint256 referralAmount = commissionAmount.mul(REFERRAL_REWARD_RATE).div(PERCENTS_DIVIDER);
        uint256 reserveAmount = commissionAmount.mul(RESERVE_RATE).div(PERCENTS_DIVIDER);
        uint256 marketingAmmount = commissionAmount.mul(MARKETING_RATE).div(PERCENTS_DIVIDER);

        index2Investor[index2Investment[rings[_indexRing].investments[0]].indexInvestor].addr.transfer(_reward);
        insuranceFunds += reserveAmount;
        totalFundsTopReferents += referralAmount;

        developerAccount.transfer(developAmount);
        reserveAccount.transfer(reserveAmount);
        marketingAccount.transfer(marketingAmmount);

        rings[_indexRing].finished = true;
    }

    function payTopReferents() private{
    }

    function getTopReferents() public view returns (uint256[] memory){
        uint256 busyPlaces;
        uint256[] memory topReferents = new uint256[](10);
        for(uint256 i=4000;i<latestReferredCode;i++) {
            if(i < 4010) {
                topReferents[busyPlaces] = i;
            }else {
                for(uint256 j=0;j<topReferents.length;j++) {
                    if(index2Investor[i].refs.length > index2Investor[topReferents[j]].refs.length) {
                        topReferents[j] = i;
                    }
                }
            }
        }
        
        return topReferents;
    }

    function divideRing(uint256 _indexRing) private{
        uint256 _amount;
        uint256 _reward;
        uint8 _maxInvestors;
        Level _level;
        uint256 indexRingOne = ringIndex;
        ringIndex++;
        uint256 indexRingTwo = ringIndex;
        uint256[] memory investsToRingOne;
        uint256[] memory investsToRingTwo;

        if(rings[_indexRing].level == Level.WATER) {
            investsToRingOne = new uint256[](1);
            investsToRingTwo = new uint256[](1);
            _amount = AMOUNT_BY_WATER;
            _reward = REWARD_BY_WATER;
            _maxInvestors = MAX_PARTICIPANT_WATER;
            _level = Level.WATER;
            investsToRingOne[0] = rings[_indexRing].investments[1];
            investsToRingTwo[0] = rings[_indexRing].investments[2];
        }else if(rings[_indexRing].level == Level.EARTH) {
            investsToRingOne = new uint256[](3);
            investsToRingTwo = new uint256[](3);
            _amount = AMOUNT_BY_EARTH;
            _reward = REWARD_BY_EARTH;
            _maxInvestors = MAX_PARTICIPANT_EARTH;
            _level = Level.EARTH;
            investsToRingOne[0] = rings[_indexRing].investments[1];
            investsToRingOne[1] = rings[_indexRing].investments[3];
            investsToRingOne[2] = rings[_indexRing].investments[4];

            investsToRingTwo[0] = rings[_indexRing].investments[2];
            investsToRingTwo[1] = rings[_indexRing].investments[5];
            investsToRingTwo[2] = rings[_indexRing].investments[6];
        }else {
            investsToRingOne = new uint256[](7);
            investsToRingTwo = new uint256[](7);
            _amount = AMOUNT_BY_FIRE;
            _reward = REWARD_BY_FIRE;
            _maxInvestors = MAX_PARTICIPANT_FIRE;
            _level = Level.FIRE;
            investsToRingOne[0] = rings[_indexRing].investments[1];
            investsToRingOne[1] = rings[_indexRing].investments[3];
            investsToRingOne[2] = rings[_indexRing].investments[4];
            investsToRingOne[3] = rings[_indexRing].investments[7];
            investsToRingOne[4] = rings[_indexRing].investments[8];
            investsToRingOne[5] = rings[_indexRing].investments[9];
            investsToRingOne[6] = rings[_indexRing].investments[10];

            investsToRingTwo[0] = rings[_indexRing].investments[2];
            investsToRingTwo[1] = rings[_indexRing].investments[5];
            investsToRingTwo[2] = rings[_indexRing].investments[6];
            investsToRingTwo[3] = rings[_indexRing].investments[11];
            investsToRingTwo[4] = rings[_indexRing].investments[12];
            investsToRingTwo[5] = rings[_indexRing].investments[13];
            investsToRingTwo[6] = rings[_indexRing].investments[14];
        }

        rings.push(Ring({
            index : indexRingOne,
            amount : _amount,
            reward : _reward,
            maxInvestors : _maxInvestors,
            startDate : block.timestamp,
            level : _level,
            balance : _amount.mul(investsToRingOne.length),
            finished : false,
            investments : investsToRingOne
        }));

        rings.push(Ring({
            index : indexRingTwo,
            amount : _amount,
            reward : _reward,
            maxInvestors : _maxInvestors,
            startDate : block.timestamp,
            level : _level,
            balance : _amount.mul(investsToRingTwo.length),
            finished : false,
            investments : investsToRingTwo
        }));
        ringIndex++;
    }
    */

    function calculatePenalty(uint256 amount) pure private returns (uint256){
        return amount.mul(PENALTY_STEP).div(PERCENTS_DIVIDER);
    }
    /************************************************ 
                            VIEWS
    *************************************************/

    function getInfoRing(uint256 _indexRing) public view returns (uint256,uint256,uint8,uint256,uint256,uint256,uint256,uint256,bool) {
        Ring memory ring = rings[_indexRing];
        return (
            ring.index,
            ring.balance,
            ring.plan,
            ring.amount,
            ring.reward,
            ring.maxInvestors,
            ring.investments.length,
            ring.startDate,
            ring.finished
        );
    }

    function getActivePlans() public view returns (bool[] memory) {
        uint256 investor = address2index[msg.sender];
        bool[] memory _activePlans = new bool[](6);

        for(uint256 i=0;i<index2Investor[investor].investments.length;i++) {
            if(!index2Investor[investor].investments[i].payed) {
                uint8 _plan = rings[index2Investor[investor].investments[i].ring].plan;
                _activePlans[_plan] = true;
            }
        }
        return _activePlans;
    }

    function getInvestedPlans() public view returns (uint256[] memory){
        uint256 investor = address2index[msg.sender];
        uint index = 0;
        uint256[] memory _investedPlans = new uint256[](6);

        for(uint256 i=0;i<index2Investor[investor].investments.length;i++) {
            if(!index2Investor[investor].investments[i].payed) {
                _investedPlans[index] = rings[index2Investor[investor].investments[i].ring].index;
                index++;
            }
        }
        return _investedPlans;
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getTotalInvested(uint256 _indexInvestor) public view returns (uint256) {
        require(_indexInvestor != 0, "Can not withdraw because no any investments");
        uint256 totalAmount;
        for(uint256 i=0;i<index2Investor[_indexInvestor].investments.length;i++) {
            if(index2Investor[_indexInvestor].investments[i].payed) {
                continue;
            }

            totalAmount = totalAmount.add(rings[index2Investor[_indexInvestor].investments[i].ring].amount);
        }

        return totalAmount;
    }

    function getIndexInvestor() public view returns (uint256){
        return address2index[msg.sender];
    }

    function getPlans() public view returns (uint8[] memory) {
        return plans;
    }

    function getTotalStaked() public view returns (uint256){
        return totalStaked;
    }

    function getInsuranceFunds() public view returns (uint256){
        return insuranceFunds;
    }

    function getReferendsFunds() public view returns (uint256){
        return totalFundsTopReferents;
    }
}

library SafeMath {

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        uint256 c = a - b;

        return c;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: division by zero");
        uint256 c = a / b;

        return c;
    }
}