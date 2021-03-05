const request = require("request");
const cheerio = require("cheerio");

let cheeseList = [];

request(
	"https://cdn.adimo.co/clients/Adimo/test/index.html",
	function (error, response, body) {
		if (error !== null) {
			console.error(error);
		}
		const $ = cheerio.load(body);

		$("div.item").each(function (i, elem) {
			cheeseList[i] = {};
			let title = $(this).find("h1").text();
			cheeseList[i]["title"] = title;
		});
	}
);
