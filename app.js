const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

let cheeseList = [];

request(
	"https://cdn.adimo.co/clients/Adimo/test/index.html",
	function (error, response, body) {
		if (error !== null) {
			console.error(error);
		}
		const $ = cheerio.load(body);

		$("div.item").each(function (i, elem) {
			//create's am empty object at this index of the array
			cheeseList[i] = {};

			//get the title of the cheese
			let title = $(this).find("h1").text();
			//assign the title to a newly created title property in the object
			cheeseList[i]["title"] = title;

			// get the imageUrl or the cheese
			let imageUrl = $(this).find("img").attr("src");
			//assign the imageUrl to a newly created imageUrl property
			cheeseList[i]["imageUrl"] = imageUrl;

			//get the price of the cheese
			let price = $(this).find(".price").text();
			//assign the price to a newly created price property
			cheeseList[i]["price"] = price;
			//remove the £ sign from the price & convert to a number for later
			let priceNumber = parseFloat(price.slice(1));

			//get the old price
			let oldPrice = $(this).find(".oldPrice").text();
			//check if oldPrice has a value, then assign it to a newly created property
			if (oldPrice.length > 1) {
				cheeseList[i]["oldPrice"] = oldPrice;
				//remove the £ sign from the oldPrice & convert it to a number
				let oldPriceNumber = parseFloat(oldPrice.slice(1));
				let discountPrice = oldPriceNumber - priceNumber;
				//create a discount property and assign it a value the convert it to a string for JSON purposes
				cheeseList[i]["discount"] = discountPrice.toString();
			}
		});

		//create's a new object with the total number of items
		let numberOfItems = {
			numberOfItems: cheeseList.length.toString(),
		};
		// add this object to the array
		cheeseList.push(numberOfItems);

		// initalize a totalPrice number
		let totalPriceOfItems = 0.0;
		// add each price to the totalPrice
		cheeseList.forEach((element) => {
			if (element.price !== undefined) {
				price = element.price.slice(1);
				totalPriceOfItems += parseFloat(price);
			}
		});
		// divide the total price by the number of items in the array, minus the last element
		let averagePrice = totalPriceOfItems / (cheeseList.length - 1);
		// create a new object for the average price of the items
		let averagePriceOfItems = {
			averagePrice: averagePrice.toString(),
		};
		// add this object to the array
		cheeseList.push(averagePriceOfItems);

		// convert the array into json
		const jsonString = JSON.stringify(cheeseList);

		// write a new file with the json data above
		fs.writeFile("cheeseList.json", jsonString, function (err, result) {
			if (err) console.error(err);
		});
	}
);
