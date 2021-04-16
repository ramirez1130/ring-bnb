import React, { useEffect } from 'react';
import OwlCarousel from 'react-owl-carousel';
import getWeb3 from "../getWeb3";
import RingBNB from "../contracts/RingBNB.json";
import plans from "../plans.json";


class Price extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            web3: undefined,
            instance: undefined,
            plans: plans,
            account: "",
        }
    }

    componentDidMount() {
        setTimeout(function () {
            document.querySelector(".loader-wrapper").style = "display: none";
        }, 2000);
        this.loadBlockchainData();
    }

    loadBlockchainData = async () => {
        const web3 = await getWeb3();

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = RingBNB.networks[networkId];

        const accounts = web3.eth.getAccounts();
	
        const instance = new web3.eth.Contract(
            RingBNB.abi,
            deployedNetwork && deployedNetwork.address
        );

        this.setState({web3, instance, account:accounts[0]});
    }

    updateInvestedPlans = (plans) => {
        let newPlans = plans;
        Array.from(plans).forEach((plan,i) => {
            newPlans[i].isDisabled = plan;
        });
        this.setState({newPlans});
    }

    listenPlanInvested = () =>{
        let self = this;
        console.log(this);
        this.state.instance.events.onInvest().on('data', async function(evt){
            alert("Una inversion");
            this.instance.methods.getActivePlans().call({from: this.account}).then((activePlans) => {
                Array.from(activePlans).forEach((plan,i) => {
                    let newPlans = plans;
                    newPlans[i].isDisabled = plan;
                    self.plans = newPlans;
                });
            });
        });
    } 

    generateTransaction = (amount, plan) => {
        let amountInWei = this.state.web3.utils.toWei(amount.toString(), 'ether');
        console.log("Inverting in plan " + plan + " mount " + amountInWei);
        
        this.state.instance.methods.invest(plan, amountInWei).send({
            from: this.state.account,
            value: amountInWei
        });
    }

    render() {
        // OwlCarousel Option for Prices
        const options = {
            0: {
                items: 1,
                dots: true,
                margin: 5,
            },
            600: {
                items: 1,
                dots: true,
                margin: 0,
            },
            768: {
                items: 2,
                dots: true,
            },
            992: {
                items: 3,
            },
            1000: {
                items: 3
            }
        };

        let DataList = this.state.plans.map((element,i) => {
            return (
                <div className="price-item" key={`plan-${i}`}>
                    <div className="price-block">
                        <div className="price-type">
                            <h2>{element.title}</h2>
                        </div>
                        <div className="mrp">
                            <h6 className="user-type">{element.lable}</h6>
                            <div className="price-devide"></div>
                            <h2>{element.price} BNB</h2>
                            <h6 className="price-year">{element.multiplication}</h6>
                            <div className="price-devide"></div>
                        </div>
                        <ul className="price-feature" dangerouslySetInnerHTML={{ __html: element.features }}></ul>
                        <button disabled={element.isDisabled} onClick={() => this.generateTransaction(element.price, i)} className="btn btn-custom theme-color" role="button" >
                            Invest
                        </button>
                    </div>
                </div>
            );
        });

        return (
            <section id="price" className="price">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <OwlCarousel
                                className="price-carousel owl-carousel owl-theme"
                                loop={false}
                                margin={30}
                                nav={true}
                                dots={true}
                                responsive={options}
                            >
                                {DataList}
                            </OwlCarousel>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}


export default Price;