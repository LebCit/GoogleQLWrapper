class GoogleQLWrapper {
	/**
	 * Method to parse CSV into an array of objects
	 *
	 * @param {string} csv - The CSV string to be parsed
	 * @returns {Array<Object>} An array of objects representing the CSV data
	 */
	parseCSV = (csv) => {
		try {
			// Split the CSV string into an array of lines
			const lines = csv.split("\n")

			// Extract headers from the first line, removing leading/trailing spaces and quotes
			const headers = lines[0].split(",").map((header) => header.trim().replace(/"/g, ""))

			// Initialize an array to store the parsed data
			const data = []

			// Loop through each line starting from the second line (index 1)
			for (let i = 1; i < lines.length; i++) {
				// Split the line into values, remove leading/trailing spaces and quotes
				const values = lines[i].split(",").map((value) => value.trim().replace(/"/g, ""))

				// Check if the number of values matches the number of headers
				if (values.length === headers.length) {
					// Initialize an object to store this entry's data
					const entry = {}
					// Map each value to its corresponding header and store it in the entry object
					headers.forEach((header, index) => {
						entry[header] = values[index]
					})
					// Push the entry object to the data array
					data.push(entry)
				}
			}

			// Return the parsed data
			return data
		} catch (error) {
			// Handle any errors that occur during the parsing process
			console.error("Error parsing CSV data:", error)
			throw error // Re-throw the error to propagate it to the caller
		}
	}

	/**
	 * Method to construct a Google Query Language (GQL) query string.
	 *
	 * @param {Object} options - Query options including select, where, orderBy, etc.
	 * @returns {string} A string representing the constructed GQL query.
	 */
	constructQuery = (options) => {
		let query = "SELECT *"

		if (options.select) {
			query = `SELECT ${options.select}`
		}

		if (options.where) {
			query += ` WHERE ${options.where}`
		}

		if (options.groupBy) {
			query += ` Group BY ${options.groupBy}`
		}

		if (options.pivot) {
			query += ` PIVOT ${options.pivot}`
		}

		if (options.orderBy) {
			query += ` ORDER BY ${options.orderBy}`
		}

		if (options.limit) {
			query += ` LIMIT ${options.limit}`
		}

		if (options.offset) {
			query += ` OFFSET ${options.offset}`
		}

		if (options.label) {
			query += ` LABEL ${options.label}`
		}

		// Omit FORMAT and OPTIONS

		return encodeURIComponent(query)
	}

	/**
	 * Asynchronous method to fetch data from a Google Sheets document and parse it into an array of objects.
	 *
	 * @param {string} sheetID - The ID of the Google Sheets document.
	 * @param {Object} queryOptions - Options for constructing the query.
	 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects representing the data from the Google Sheets document.
	 */
	getSheetData = async (sheetID, queryOptions = {}) => {
		try {
			let url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:csv`

			if (queryOptions.headers) {
				url += `&headers=${queryOptions.headers}`
			}

			if (queryOptions.gid) {
				url += `&gid=${queryOptions.gid}`
			}

			if (queryOptions.sheet) {
				url += `&sheet=${queryOptions.sheet}`
			}

			if (queryOptions.range) {
				url += `&range=${queryOptions.range}`
			}

			if (Object.keys(queryOptions).length !== 0) {
				// Construct the GQL query string
				const query = this.constructQuery(queryOptions)
				// Append the query string to the URL
				url += `&tq=${query}`
			}

			// Fetch CSV data from the specified URL
			const response = await fetch(url)

			if (!response.ok) {
				throw new Error(`Failed to fetch data. Status: ${response.status}`)
			}

			// Extract text from the response
			const csvData = await response.text()

			// Parse the CSV data into an array of objects using the parseCSV function
			return this.parseCSV(csvData)
		} catch (error) {
			// Handle any errors that occur during the process
			console.error("Error fetching or parsing data:", error)
			throw error // Re-throw the error to propagate it to the caller
		}
	}

	/**
	 * Retrieves data from a Google Sheets document.
	 *
	 * @param {string} sheetID - The ID of the Google Sheets document.
	 * @param {string} sheetName - (Optional) The name of the specific sheet within the document.
	 * @returns {Promise<Object>} - A Promise that resolves with the retrieved data as a JavaScript object or rejects with an error.
	 */
	getSourceData = async (sheetID, sheetName) => {
		try {
			// Construct the URL for accessing the Google Sheets document data
			let url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq`

			if (sheetName) {
				url += `?sheet=${sheetName}`
			}

			// Fetch data from the specified URL
			let response = await fetch(url)

			// Read the text content from the response
			let jsonpResponse = await response.text()

			// Extract the JSON string from the JSONP response
			let jsonMatch = jsonpResponse.match(/google.visualization.Query.setResponse\((.*?)\);/)
			let jsonString = jsonMatch ? jsonMatch[1] : ""

			// Parse the JSON string into a JavaScript object
			let jsonObject = JSON.parse(jsonString)

			// Return the retrieved JavaScript object
			return jsonObject
		} catch (error) {
			// Handle any errors that occur during the process
			console.error("Error fetching data source:", error)
			// Re-throw the error to propagate it to the caller
			throw error
		}
	}
}

export const { getSheetData, getSourceData } = new GoogleQLWrapper()
