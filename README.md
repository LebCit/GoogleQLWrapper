# GoogleQLWrapper

GoogleQLWrapper simplifies [Google's Visualization API Query Language](https://developers.google.com/chart/interactive/docs/querylanguage).<br />

To gain insight into the development and functionality of GoogleQLWrapper, please take a moment to read the article available [here](https://lebcit.github.io/posts/google-ql-wrapper/). This article explains why and how the tool was created, providing a clear understanding of its workings.

> [!IMPORTANT]  
> GoogleQLWrapper works only on [publicly available spreadsheets](https://support.google.com/docs/answer/183965?hl=en&ref_topic=9083762) that grant at least a **Viewer** permission to anyone on the internet with the link.

# Usage

To simplify the documentation and illustrate it with concrete examples, I've created a [public multi-sheet document](https://docs.google.com/spreadsheets/d/1FrnOkibXDg7NzxxMx6x3vDzpnV522ObYSSOewuoyiGg/), with some data, that you can use to test this wrapper.

Add GoogleQLWrapper-min.js to your project.<br />
Load a module script before the closing `</body>` tag like the following example (**index.html**):

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Google Sheet Data</title>
	</head>
	<body>
		<h1>Testing GoogleQLWrapper</h1>

		<!-- Assuming that index.js is at the same level as index.html in your project -->
		<script type="module" src="index.js"></script>
	</body>
</html>
```

Import the available methods from **GoogleQLWrapper-min.js** into **index.js**:

```js
// Import methods from the GoogleQLWrapper-min.js file
import { getSheetData, getSourceData } from "./GoogleQLWrapper-min.js"

// Retrieving data from a Google Sheet using the getSheetData function
const sheetData = await getSheetData("1FrnOkibXDg7NzxxMx6x3vDzpnV522ObYSSOewuoyiGg")

// Retrieving data from the source of the Google Sheet using the getSourceData function
const sourceData = await getSourceData("1FrnOkibXDg7NzxxMx6x3vDzpnV522ObYSSOewuoyiGg")

// Logging the retrieved data to the console
console.log(sheetData, sourceData)
```

Launch your local server (could be integrated to your IDE/Code Editor or via an extension).<br />
When the code gets executed in your browser, open the browser's console (F12) → Console (tab).<br />
You should see an **empty array** and an **object with some properties**.

# getSheetData(sheetID, queryOptions = {})

Asynchronous function to fetch data from a Google Sheets document and parse it into an array of objects.<br />
`getSheetData` has two parameters

1. `sheetID`, **mandatory** a string representing the ID of a Google Sheet, usually composed of 44 characters (combination of letters, numbers, and special characters, such as hyphens and underscores).
2. `queryOptions`, **optional**, an object that accepts the following properties:
    - headers: integer, zero or greater, specifies how many rows are header rows (headers: 1)
    - gid: integer, id number of a particular sheet in a multi-sheet document (gid: 788760943)
    - sheet: string, name of a particular sheet in a multi-sheet document (sheet: "Sheet1")
    - range: string, specifies what part of a spreadsheet to use in the query (range: "A1:F6")
    - [Query Language Clauses](https://developers.google.com/chart/interactive/docs/querylanguage#language-clauses) except Format and Options!

> [!NOTE]  
> You should only use `gid` or `sheet`. I recommend `sheet`!

## getSheetData examples

When you open the [public multi-sheet document](https://docs.google.com/spreadsheets/d/1FrnOkibXDg7NzxxMx6x3vDzpnV522ObYSSOewuoyiGg/) that I've made for this documentation, you can see that it has 3 sheets and only the **Employees_Data** sheet contains some data.<br />
Let's modify the previous code in **index.js** and have another look to the browser's console:

```js
import { getSheetData, getSourceData } from "./google-ql-wrapper-min.js"

const sheetData = await getSheetData("1FrnOkibXDg7NzxxMx6x3vDzpnV522ObYSSOewuoyiGg", {
	sheet: "Employees_Data",
})

const sourceData = await getSourceData("1FrnOkibXDg7NzxxMx6x3vDzpnV522ObYSSOewuoyiGg")

console.log(sheetData, sourceData)
```

Now that we have required the function to get the data from the sheet named **Employees_Data**, we can see that the browser's console displays an array of objects representing the table's data in this sheet!

Let's use the range and some clauses to understand how it works and see what would be the output.<br />
Suppose that we want to run the following query:

1. Get the data from the sheet named Employees_Data
2. Work only on the range from A1 to G5 (name to isSenior and 4 rows)
3. Return only the data in the name, salary and age columns (A, D, F)
4. Where the employee is a senior
5. And finally arrange the returned data by ascending order of salary

```js
import { getSheetData, getSourceData } from "./google-ql-wrapper-min.js"

const sheetData = await getSheetData("1FrnOkibXDg7NzxxMx6x3vDzpnV522ObYSSOewuoyiGg", {
	sheet: "Employees_Data",
	range: "A1:G5",
	select: "A, D, F",
	where: "G=true",
	orderBy: "D asc",
})

const sourceData = await getSourceData("1FrnOkibXDg7NzxxMx6x3vDzpnV522ObYSSOewuoyiGg")

console.log(sheetData, sourceData)
```

The following response should be displayed in the browser's console for `sheetData`:

```js
[
	{
		name: "Ben",
		salary: "400",
		age: "32",
	},
	{
		name: "John",
		salary: "1000",
		age: "35",
	},
]
```

Obtaining data from a public Google sheet using GoogleQLWrapper is as simple as child's play; all you need to do is familiarize yourself with the [Query Language Clauses](https://developers.google.com/chart/interactive/docs/querylanguage#language-clauses) (except Format and Options) to grasp their purposes and functionalities.

# getSourceData(sheetID, sheetName)

Asynchronous function to retrieve data from a public Google Sheets document.<br />
It returns a Promise that resolves with the retrieved data as a JavaScript object or rejects with an error.<br />
`getSourceData` has two parameters

1. `sheetID`, **mandatory** a string representing the ID of a Google Sheet, usually composed of 44 characters (combination of letters, numbers, and special characters, such as hyphens and underscores).
2. `sheetName`, **optional**, a string representing the name of a particular sheet in a multi-sheet document.

## getSourceData example

Until now, `sourceData` was returning the following object:

```js
{
  "version": "0.6",
  "reqId": "0",
  "status": "ok",
  "sig": "1945619023",
  "table": {
    "cols": [
      {
        "id": "Col0",
        "label": "",
        "type": "string"
      }
    ],
    "rows": [],
    "parsedNumHeaders": 0
  }
}
```

Let's require the **Employees_Data** sheet with `getSourceData`:

```js
import { getSheetData, getSourceData } from "./google-ql-wrapper-min.js"

const sheetData = await getSheetData("1FrnOkibXDg7NzxxMx6x3vDzpnV522ObYSSOewuoyiGg", {
	sheet: "Employees_Data",
	range: "A1:G5",
	select: "A, D, F",
	where: "G=true",
	orderBy: "D asc",
})

const sourceData = await getSourceData("1FrnOkibXDg7NzxxMx6x3vDzpnV522ObYSSOewuoyiGg", "Employees_Data")

console.log(sheetData, sourceData)
```

The returned object is:

```js
{
  "version": "0.6",
  "reqId": "0",
  "status": "ok",
  "sig": "1711726279",
  "table": {
    "cols": [
      {
        "id": "A",
        "label": "name",
        "type": "string"
      },
      {
        "id": "B",
        "label": "department",
        "type": "string"
      },
      {
        "id": "C",
        "label": "lunchTime",
        "type": "datetime",
        "pattern": "h:mm:ss"
      },
      {
        "id": "D",
        "label": "salary",
        "type": "number",
        "pattern": "General"
      },
      {
        "id": "E",
        "label": "hireDate",
        "type": "date",
        "pattern": "yyyy-mm-dd"
      },
      {
        "id": "F",
        "label": "age",
        "type": "number",
        "pattern": "General"
      },
      {
        "id": "G",
        "label": "isSenior",
        "type": "boolean"
      },
      {
        "id": "H",
        "label": "seniorityStartTime",
        "type": "datetime",
        "pattern": "yyyy-mm-dd h:mm:ss"
      }
    ],
    "rows": [
      {
        "c": [
          {
            "v": "John"
          },
          {
            "v": "Eng"
          },
          {
            "v": "Date(1899,11,30,12,0,0)",
            "f": "12:00:00"
          },
          {
            "v": 1000,
            "f": "1000"
          },
          {
            "v": "Date(2005,2,19)",
            "f": "2005-03-19"
          },
          {
            "v": 35,
            "f": "35"
          },
          {
            "v": true,
            "f": "TRUE"
          },
          {
            "v": "Date(2007,11,2,15,56,0)",
            "f": "2007-12-02 15:56:00"
          }
        ]
      },
      {
        "c": [
          {
            "v": "Dave"
          },
          {
            "v": "Eng"
          },
          {
            "v": "Date(1899,11,30,12,0,0)",
            "f": "12:00:00"
          },
          {
            "v": 500,
            "f": "500"
          },
          {
            "v": "Date(2006,3,19)",
            "f": "2006-04-19"
          },
          {
            "v": 27,
            "f": "27"
          },
          {
            "v": false,
            "f": "FALSE"
          },
          {
            "v": null
          }
        ]
      },
      {
        "c": [
          {
            "v": "Sally"
          },
          {
            "v": "Eng"
          },
          {
            "v": "Date(1899,11,30,13,0,0)",
            "f": "13:00:00"
          },
          {
            "v": 600,
            "f": "600"
          },
          {
            "v": "Date(2005,9,10)",
            "f": "2005-10-10"
          },
          {
            "v": 30,
            "f": "30"
          },
          {
            "v": false,
            "f": "FALSE"
          },
          {
            "v": null
          }
        ]
      },
      {
        "c": [
          {
            "v": "Ben"
          },
          {
            "v": "Sales"
          },
          {
            "v": "Date(1899,11,30,12,0,0)",
            "f": "12:00:00"
          },
          {
            "v": 400,
            "f": "400"
          },
          {
            "v": "Date(2002,9,10)",
            "f": "2002-10-10"
          },
          {
            "v": 32,
            "f": "32"
          },
          {
            "v": true,
            "f": "TRUE"
          },
          {
            "v": "Date(2005,2,9,12,30,0)",
            "f": "2005-03-09 12:30:00"
          }
        ]
      },
      {
        "c": [
          {
            "v": "Dana"
          },
          {
            "v": "Sales"
          },
          {
            "v": "Date(1899,11,30,12,0,0)",
            "f": "12:00:00"
          },
          {
            "v": 350,
            "f": "350"
          },
          {
            "v": "Date(2004,8,8)",
            "f": "2004-09-08"
          },
          {
            "v": 25,
            "f": "25"
          },
          {
            "v": false,
            "f": "FALSE"
          },
          {
            "v": null
          }
        ]
      },
      {
        "c": [
          {
            "v": "Mike"
          },
          {
            "v": "Marketing"
          },
          {
            "v": "Date(1899,11,30,13,0,0)",
            "f": "13:00:00"
          },
          {
            "v": 800,
            "f": "800"
          },
          {
            "v": "Date(2005,0,10)",
            "f": "2005-01-10"
          },
          {
            "v": 24,
            "f": "24"
          },
          {
            "v": true,
            "f": "TRUE"
          },
          {
            "v": "Date(2007,11,30,14,40,0)",
            "f": "2007-12-30 14:40:00"
          }
        ]
      }
    ],
    "parsedNumHeaders": 1
  }
}
```

`getSourceData` provides us with a lot of useful details regarding the data that we can use to understand how the data is formatted.

# Tip

You can find a lot of public Google Sheets on [heystack](https://heystacks.com/) to test GoogleQLWrapper and master The Google Visualization API Query Language (GViz).

I sincerely hope that this compact and user-friendly wrapper proves invaluable to anyone seeking to retrieve data from publicly accessible Google Sheets!
