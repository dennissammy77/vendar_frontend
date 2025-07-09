'use client'
import {Box, Text} from "@chakra-ui/react";
import Script from "next/script";

export default function Page(){
	return(
		<Box>
			<Text>Hello world</Text>
			<Script
				src="https://connect.facebook.net/en_US/sdk.js"
				onReady={()=>{
					try{
					(function(d, s, id){
						let js, fjs = d.getElementsByTagName(s)[0];
						if (d.getElementById(id)) {return;}
						js = d.createElement(s); js.id = id;
						js.src = "https://connect.facebook.net/en_US/sdk.js";
						fjs.parentNode.insertBefore(js, fjs);
					}(document, 'script', 'facebook-jssdk'));

					window.fbAsyncInit = function() {
						// Initialize the SDK with your app and the Graph API version for your app
						FB.init({
							appId            : '8399748010054329',
							xfbml            : true,
							version          : 'v20.0'
						});
						// If you are logged in, automatically get your name and email adress, your public profile information
						FB.login(function(response) {
							if (response.authResponse) {
								console.log('Welcome!  Fetching your information.... ');
								FB.api('/me', {fields: 'name, email'}, function(response) {
									document.getElementById("profile").innerHTML = "Good to see you, " + response.name + ". i see your email address is " + response.email
								});
							} else { 
                           // If you are not logged in, the login dialog will open for you to login asking for permission to get your public profile and email
								console.log('User cancelled login or did not fully authorize.'); 
							}
						});
					};

					}catch(err){
						console.log(err);
					}
				}}
			/>
		</Box>
	)
}
