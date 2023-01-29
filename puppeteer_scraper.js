import puppeteer from "puppeteer"
// import { writeFileSync } from "fs"
import PocketBase from "pocketbase"


(async () => {
	const pb = new PocketBase("http://127.0.0.1:8090")
	await pb.admins.authWithPassword("a@a.com", "2PDLXd7R3yJQDKa")

	// clear DB
	for (let post of await pb.collection("posts").getFullList()) {
		pb.collection("posts").delete(post.id)
	}

	const browser = await puppeteer.launch({headless: true})
	const page = await browser.newPage()

	// await page.goto("https://www.finn.no/realestate/homes/search.html?sort=PUBLISHED_DESC")
	// ca. 190 search results
	await page.goto( "https://www.finn.no/realestate/homes/search.html?lifecycle=3&sort=PUBLISHED_DESC")

	while (true) {
		// load the page
		await page.waitForSelector("article")

		// scrape
		let data = await page.evaluate(() => {
			data = []
			for (let article of document.querySelectorAll("article")) {
				data.push({
					post_id: article.querySelector(".sf-realestate-heading").id,
					title: article.querySelector( ".sf-realestate-heading").text
				})
			}
			return data
		})
		// add to DB
		for (let post of data) {
			await pb.collection("posts").create(post)
		}
		
		// move to next page
		let page_nr = await page.evaluate(() => (new URLSearchParams(location.search)).get("page"))
		page_nr ||= 1
		console.log(page_nr);
		try {
			let next_page_link = await page.waitForSelector(".pagination > a[rel=next]", {timeout: 1000})
			if (next_page_link)
				await next_page_link.click()
		} catch (error) {
			// console.log(error);
			// console.log("graceful crash");
			break
		}

	}
	// let annonse = await page.waitForSelector("article")
	// console.log(await annonse.evaluate(el => el.textContent));
	
	await browser.close()
})()