/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

app.get('/data', async function(req, res) {
  let courses, sections, instructors, result;

  let params = {
    TableName: "course",
    Select: "ALL_ATTRIBUTES"
  };


  courses = await docClient.scan(params).promise();

  params.TableName = "section";

  sections = await docClient.scan(params).promise();

  params.TableName = "instructor";

  instructors = await docClient.scan(params).promise();

  const data = {
    courses: courses.Items.map((course) => 
    ({
      id: course.id,
      name: course.name,
      sections: sections.Items.filter((section) => section.course_id === course.id)
    })),
    instructors: instructors.Items
  }

  res.json({data});

  

  // const result = {
  //   courses: courses.map((course) => 
  //   ({
  //     id: course.id,
  //     name: course.name,
  //     sections: sections.filter((section) => section.course_id === course.id)
  //   })),
  //   instructors: instructors
  // }

  // res.json({result});
});

app.post('/delete', async function(req, res) {

  let params = {
    TableName: "section",
    Key: {
      "instructor_id": req.body.id,
      "course_id": req.body.courseId
    },
    ReturnValues: "ALL_OLD"
  };


  const result = await docClient.delete(params).promise();

  res.json({result});

});

app.post('/add', async function(req, res) {

  let params = {
    TableName: "section",
    Item: {
      "instructor_id": req.body.id,
      "course_id": req.body.courseId
    },
    ReturnValues: "ALL_OLD"
  };


  const result = await docClient.put(params).promise();

  res.json({result});

});

app.post('/update', async function(req, res) {
  let params = {
    TableName: "section",
    Key: {
      "instructor_id": req.body.curId,
      "course_id": req.body.courseId
    },
    ReturnValues: "NONE"
  };

  let result = await docClient.delete(params).promise();

  params = {
    TableName: "section",
    Item: {
      "instructor_id": req.body.selId,
      "course_id": req.body.courseId
    },
    ReturnValues: "ALL_OLD"
  };

  result = await docClient.put(params).promise();

  res.json({result});

});

app.post('/courses', async function(req, res) {
  let params = {
    TableName: "course",
    Item: {
      "instructor_id": req.body.id,
      "course_id": req.body.courseId
    },
    ReturnValues: "ALL_OLD"
  };

  result = await docClient.put(params).promise();

  res.json({result});

});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
