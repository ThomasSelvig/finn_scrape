const fs = require("fs")
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
	.paginate(".pagination > a@href")
	.then(res => {
		fs.writeFileSync(
			"results.csv", 
			`id\ttitle\taddress\tsqr_ftg\tprice\n` +
			res
				.map((v, i) => `${v.id || ""}\t${v.title || ""}\t${v.address || ""}\t${v.sqr_ftg || ""}\t${v.price || ""}`)
				.join("\n")
		)
	})
	// .write("results.json")
