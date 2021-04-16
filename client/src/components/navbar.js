import React from 'react';
import getWeb3 from "../getWeb3";
import RingBNB from "../contracts/RingBNB.json";

class Navbar extends React.Component {
	state = {
		account: "",
		instance: "",
		bnb_rate: 0,
	}

	componentDidMount() {
		const BNB_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd&include_24hr_change=true';

		setTimeout(function () {
			document.querySelector(".loader-wrapper").style = "display: none";
		}, 2000);

		fetch(BNB_URL).then(resp => {
			resp.json().then(r => {
				this.setState({bnb_rate:r.binancecoin.usd});
			});
		});

		this.loadBlockchainData();
	}

	loadBlockchainData = async () => {
		try {
		  // Get network provider and web3 instance.
		  const web3 = await getWeb3();
		  // Get the contract instance.
		  const networkId = await web3.eth.net.getId();
		  const deployedNetwork = RingBNB.networks[networkId];
	
		  const accounts = await web3.eth.getAccounts();
		  const currentAddr = accounts[0];
		  const hideAccount = currentAddr[0] + currentAddr[1] + currentAddr[2] + currentAddr[3] + currentAddr[4] + currentAddr[5] + '...' + currentAddr[currentAddr.length-6]+currentAddr[currentAddr.length-5]+ currentAddr[currentAddr.length-4]+ currentAddr[currentAddr.length-3]+ currentAddr[currentAddr.length-2]+ currentAddr[currentAddr.length-1]
	
		  const instance = new web3.eth.Contract(
		  	RingBNB.abi,
		  	deployedNetwork && deployedNetwork.address
		  );

		  this.setState({account:hideAccount, instance});
		} catch (error) {
		  console.error(error);
		}
	  };

	render() {
		let addressOrConnect;
		if(this.state.account){
			addressOrConnect = (<span>Your wallet:<a className="navbar-brand btn btn-custom theme-color font-weight-bold wallet-address">{this.state.account}</a></span>);
		}else {
			addressOrConnect = (<span><a onClick={() => this.loadBlockchainData} className="navbar-brand btn btn-custom theme-color font-weight-bold wallet-address">Connect wallet</a></span>);
		}

		return (
			<nav className="navbar navbar-expand-lg navbar-light theme-nav fixed-top">
				<div id="navbar-main" className="container">
					{addressOrConnect}
					<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse default-nav" id="navbarSupportedContent">
						<ul className="navbar-nav ml-auto" id="mymenu">
							<li className="nav-item">
								<a className="nav-link" href="#home">Home</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="#price" data-menuanchor="price">price</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="#about">about</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="#team">funds</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="">presentation</a>
							</li>
							<li className="nav-item">
								<a className="nav-link btn btn-custom theme-color font-weight-bold">1 BNB = ${this.state.bnb_rate}</a>
							</li>
							{/*
							<li className="nav-item">
								<a className="nav-link" href="#feature">feature</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="#screenshot">screenshot</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="#team">team</a>
							</li>
							<li className="nav-item dropdown">
								<a className="nav-link dropdown-toggle" href="#blog" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">blog</a>
								<ul className="dropdown-menu">
									<li className="nav-item"><a className="nav-link" href={`${process.env.PUBLIC_URL}/blog-list`} target="_blank">blog list</a></li>
									<li className="nav-item"><a className="nav-link" href={`${process.env.PUBLIC_URL}/blog-details`} target="_blank">blog details</a></li>
									<li className="nav-item"><a className="nav-link" href={`${process.env.PUBLIC_URL}/blog-leftside`} target="_blank">leftsidebar</a></li>
									<li className="nav-item"><a className="nav-link" href={`${process.env.PUBLIC_URL}/blog-rightside`} target="_blank">rightsidebar</a></li>
									<li className="nav-item"><a className="nav-link" href={`${process.env.PUBLIC_URL}/blog-left-sidebar`} target="_blank">details leftsidebar</a></li>
									<li className="nav-item"><a className="nav-link" href={`${process.env.PUBLIC_URL}/blog-right-sidebar`} target="_blank">details rightsidebar</a></li>
								</ul>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="#contact" data-menuanchor="contact">contact us</a>
							</li>
							<li className="nav-item dropdown">
								<a className="nav-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Other page</a>
								<ul className="dropdown-menu">
									<li className="nav-item"><a className="nav-link" href={`${process.env.PUBLIC_URL}/sign-in`} target="_blank">sign in</a></li>
									<li className="nav-item"><a className="nav-link" href={`${process.env.PUBLIC_URL}/sign-up`} target="_blank">sign up</a></li>
									<li className="nav-item"><a className="nav-link" href={`${process.env.PUBLIC_URL}/forget-password`} target="_blank">Forget Password</a></li>
									<li className="nav-item"><a className="nav-link" href={`${process.env.PUBLIC_URL}/thank-you`} target="_blank">Thank you</a></li>
									<li className="nav-item"><a className="nav-link" href={`${process.env.PUBLIC_URL}/review`} target="_blank">Review</a></li>
									<li className="nav-item"><a className="nav-link" href={`${process.env.PUBLIC_URL}/404`} target="_blank">404</a></li>
									<li className="nav-item"><a className="nav-link" href={`${process.env.PUBLIC_URL}/faq`} target="_blank">FAQ</a></li>
									<li className="nav-item"><a className="nav-link" href={`${process.env.PUBLIC_URL}/download`} target="_blank">Download</a></li>
									<li className="nav-item"><a className="nav-link" href={`${process.env.PUBLIC_URL}/coming-soon`} target="_blank">Coming Soon</a></li>
								</ul>
							</li>
							*/}
						</ul>
					</div>
				</div>
			</nav>
		);
	}
}

export default Navbar;