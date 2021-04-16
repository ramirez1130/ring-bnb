import React from 'react';
import getWeb3 from "../getWeb3";
import RingBNB from "../contracts/RingBNB.json";


class Subscribe extends React.Component {
   componentDidMount() {
      setTimeout(function () {
         document.querySelector(".loader-wrapper").style = "display: none";
      }, 2000);
   }

   render() {

      return (
         <section>
            <div className="container">
               <div className="row">
                  <div className="col-md-8 offset-md-2">
                     <div className="footer-text">
                        <img src="assets/images/email.png" alt="email" />
                        <h2 className="title text-center md-margin-top">your <span>referral code</span></h2>
                        <p>Each time a ring is completed, a part is accumulated to be awarded as a prize to the 5 investors that the most people referred.</p>
                        <form action="https://pixelstrap.us19.list-manage.com/subscribe/post?u=5a128856334b598b395f1fc9b&amp;id=082f74cbda" className="footer-form needs-validation" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" target="_blank">
                           <div className="form-group">
                              <input type="referral-code" className="form-control" placeholder="enter your email" name="EMAIL" id="mce-EMAIL" required="required" disabled />
                           </div>
                           <div className="form-button">
                              <button type="submit" className="btn btn-custom theme-color" id="mc-submit">copy</button>
                           </div>
                        </form>
                     </div>
                  </div>
               </div>
            </div>
         </section>
      );
   }
}


export default Subscribe;