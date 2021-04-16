import React from 'react';
import Navbar from './components/navbar';
import About from './components/about';
import Team from './components/team';
import Price from './components/price';
import Footer from './components/footer';
import Tilt from 'react-tilt';

class HomeOne extends React.Component {

	state = {
		myplans : [],
		cantContracts : []
	}

	componentDidMount() {
		setTimeout(function () {
			document.querySelector(".loader-wrapper").style = "display: none";
		}, 2000);
	}

	render() {
		document.body.classList.remove('landing-page');
		document.body.classList.remove('home-style');
		document.body.classList.remove('three');
		document.body.classList.remove('home-style-two');

		return (
			<div>
				{/* Navbar Component*/}
				<Navbar />

				{/* Home One Section Start */}
				<section id="home" className="home">
					<div className="home-decor">
						<div className="home-circle1"><img src="assets/images/haze-crypto.svg" alt="haze-crypto"/></div>
						<div className="home-circle2"><img src="assets/images/main-banner12.png" alt="" /></div>
						<div className="home-circle3"><img src="assets/images/main-banner1.png" alt="" /></div>
					</div>
					<div className="container">
						<div className="row">
							<div className="col-md-5">
								<div className="home-contain">
									<div>
										<img src="assets/images/logoimage.png" alt="caption-img" className="caption-img" />
										<h4>Landing page for</h4>
										<h1>R<span className="f-bold">I</span>N<span className="f-bold">G</span>
											<span className="f-bold f-color">BNB</span>
										</h1>
										<p>Enhance your business ideas with Powerful, Responsive, Elegant TOVO Theme.</p>
									</div>
								</div>
							</div>
							<div className="col-sm-6 offset-md-1">
								<div className="home-right">
									<Tilt options={{ perspective: 110, speed: 400, max: 1.2, scale: 1 }}>
										<img src="assets/images/logo-ring.png" className="img-fluid" alt="ring-bnb-logo" />
									</Tilt>
								</div>
							</div>
						</div>
					</div>
				</section>
				{/* Home One Section End */}

				{/*Price Component*/}
				<Price />

				{/*Subscription Component*/}
				{this.state.cantContracts}

				{/*Team Component*/}
				<Team />

				{/*Footer Component*/}
				<Footer />
			</div>
		);}
}

export default HomeOne;