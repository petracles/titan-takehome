# Titan Takehome (Jack Kelly)

Hey there Titan! Thanks for letting me take a shot at this takehome problem. I had a fun time building this and hope you're happy with the result; I also learned a great deal about writing Web clients seeing that I have less experience on the front-end.

# Summary

My submission took just over 8 hours total to build. I spent the day of Sunday, 9/16/2019 working on it. Some comments about the process:

* I rebuilt the client template since the CRA installation was being difficult to get going out-of-the-box. I went with a CRAP template (adding Parcel to the mix) based on the examples I was following.
* This app uses a simple search-bar and a list that holds all stock symbols as links. It refreshes the cache every 5 minutes.
* Clicking a symbol link doesn't do anything special after that except hit my server and dump the JSON coming from IEX on the specified symbol. In that JSON blob you'll only see the last price; there is no 30 day chart.
* The two features I didn't get to are rendering of the symbol-details and the 30 day chart.

# Takeaways

This project was fun and definitely humbling - as I mentioned I have a lot of backend experience with Node servers, but not so much with clients. Some fun learnings include:

* Using Webpack for the first time, Bable for the second.
* CORS and all it's nitty gritty details.
* Named and default exporting