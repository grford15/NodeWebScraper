const request = require("request");
const cheerio = require("cheerio");

const cheeseArray = [];

request(
	"https://cdn.adimo.co/clients/Adimo/test/index.html",
	function (error, response, body) {
		// console.error("error:", error); // Print the error if one occurred
		const $ = cheerio.load(body);

		$("div.item").each(function (i, elem) {
			let title = $(this).find("h1").text();
			let imageUrl = $(this).find("img").attr("src");
			let price = $(this).find(".price").text();
			let newItem = {
				title,
				imageUrl,
				price,
			};

			cheeseArray.push(newItem);
		});
	}
);

console.log(cheeseArray);
