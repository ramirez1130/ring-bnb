import React from 'react';
import OwlCarousel from 'react-owl-carousel';
import getWeb3 from "../getWeb3";
import RingBNB from "../contracts/RingBNB.json";


class Team extends React.Component {
   state = {
      instance: null,
      web3: null,
      total_staked_fund: "...",
      insurance_fund: "...",
      referral_funds: "..."
	}

   componentDidMount() {
      setTimeout(function () {
         document.querySelector(".loader-wrapper").style = "display: none";
      }, 2000);

      this.loadBlockchainData();
      setInterval( async() => {
         if(this.state.instance) {
            const totalStaked = await this.state.instance.methods.getTotalStaked().call();
            const insurance = await this.state.instance.methods.getInsuranceFunds().call();
            const referrends = await this.state.instance.methods.getReferendsFunds().call();

            const total_staked_fund = this.state.web3.utils.fromWei(totalStaked.toString(), 'ether');
            const insurance_funds = this.state.web3.utils.fromWei(insurance.toString(), 'ether');
            const referral_funds = this.state.web3.utils.fromWei(referrends.toString(), 'ether');
            this.setState({insurance_funds, total_staked_fund, referral_funds});
         }
      },5000);
   }

   loadBlockchainData = async () => {
      const web3 = await getWeb3();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = RingBNB.networks[networkId];
 
      const instance = new web3.eth.Contract(
          RingBNB.abi,
          deployedNetwork && deployedNetwork.address
      );

      this.setState({instance, web3});
   }

   render() {
      // OwlCarousel Option for Team Members
      const options = {
         0: {
            items: 1,
            margin: 5,
         },
         600: {
            items: 1,
            margin: 5,
         },
         768: {
            items: 2,
         },
         992: {
            items: 3,
         },
         1000: {
            items: 3,
         }
      };

      // Dynamic Team Members Easy to Update
      /*let data = [
         { name: '100 BNB', designation: 'Insurance Funds', photo: 'logo-ring.png', facebook: '#', google: '#', twitter: '#', instagram: '#', rss: '#' },
         { name: `${this.state.total_staked_fund} BNB`, designation: 'Total Staked', photo: 'logo-ring.png', facebook: '#', google: '#', twitter: '#', instagram: '#', rss: '#' },
         { name: '35 BNB', designation: 'Referral Funds', photo: 'logo-ring.png', facebook: '#', google: '#', twitter: '#', instagram: '#', rss: '#' }
      ];*/

      // Dynamic Team Members Data Loop
      return (
         <section id="team" className="team">
            <div className="team-decor">
               <div className="team-circle1"><img src="assets/images/team1.png" alt="" /></div>
               <div className="team-circle2"><img src="assets/images/team3.png" alt="" /></div>
               <div className="team-circle3"><img src="assets/images/team.png" alt="" /></div>
            </div>
            <div className="container">
               <div className="row ">
                  <div className="col-sm-12">
                     <h2 className="title"><span>funds</span></h2>
                  </div>
                  <div className="col-sm-12">
                     <div>
                        <OwlCarousel className="team-carousel owl-carousel owl-theme" loop={false} margin={30} nav={false} dots={false} responsive={options}>
                              <div className="team-item" key={0}>
                                    <div className="team-block">
                                       <div className="team-box">
                                          <div className="team-avtar">
                                             <img src="assets/images/logo-ring.png" alt="" />
                                          </div>
                                          <div className="team-text">
                                             <h3>{this.state.insurance_fund} BNB</h3>
                                             <h6>Insurance Funds</h6>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="team-item" key={1}>
                                 <div className="team-block">
                                    <div className="team-box">
                                       <div className="team-avtar">
                                          <img src="assets/images/logo-ring.png" alt="" />
                                       </div>
                                       <div className="team-text">
                                          <h3>{this.state.total_staked_fund} BNB</h3>
                                          <h6>Total staked</h6>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <div className="team-item" key={2}>
                              <div className="team-block">
                                 <div className="team-box">
                                    <div className="team-avtar">
                                       <img src="assets/images/logo-ring.png" alt="" />
                                    </div>
                                    <div className="team-text">
                                       <h3>{this.state.referral_funds} BNB</h3>
                                       <h6>Referral Funds</h6>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </OwlCarousel>
                     </div>
                  </div>
               </div>
            </div>
         </section>
      );
   }
}


export default Team;