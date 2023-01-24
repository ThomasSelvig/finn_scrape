var Xray = require("x-ray")
var x = Xray()

x(
	"https://www.finn.no/realestate/homes/search.html?sort=PUBLISHED_DESC",
	"article",
	[
		{
			id: ".sf-realestate-heading@id",
			title: ".sf-realestate-heading",
			address: ".sf-realestate-location span",
			sqr_ftg: "div:nth-child(3) > div:nth-child(4) > span:nth-child(1)",
			price: "div:nth-child(3) > div:nth-child(4) > span:nth-child(2)"
		}
	]
)
	.write("results.json")

