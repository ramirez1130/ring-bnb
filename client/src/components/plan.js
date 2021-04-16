import React from 'react';
import OwlCarousel from 'react-owl-carousel';
import getWeb3 from "../getWeb3";
import RingBNB from "../contracts/RingBNB.json";
import plans from "../plans.json";

class Plan extends React.Component {

    state = {
        disableds : [false, false, false, false, false, false]
    }

    componentDidMount() {
        setTimeout(function () {
            document.querySelector(".loader-wrapper").style = "display: none";
        }, 2000);
    }

    render() {
        let DataList = this.state.disableds.map((isDisabled, i) => {
            let val = plans[i];
            return (
                <div className="price-item" key={i}>
                    <div className="price-block">
                        <div className="price-type">
                            <h2>{val.title}</h2>
                        </div>
                        <div className="mrp">
                            <div className="price-devide"></div>
                            <h2>{val.price} BNB</h2>
                            <h6 className="price-year">{val.multiplication}</h6>
                            <div className="price-devide"></div>
                        </div>
                        <ul className="price-feature" dangerouslySetInnerHTML={{ __html: val.features }}></ul>
                        <button disabled={isDisabled} onClick={() => this.generateTransaction(val.price, i)} className="btn btn-custom theme-color" role="button" >Invest</button>
                    </div>
                </div>
            );
        });

        return {DataList};
    }
}

export default Plan;