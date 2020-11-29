Stony Brook is preparing to start mass weekly COVID19 testing for all students, faculty and hospital employees (approximately 28K people) using saliva tests. Since they cannot test all 28K samples, multiple tests will be mixed together in the same "pool" to be tested at once. A lab employee will put this pool in a testing "well" once it becomes available. If the well turns out negative, all the tests are negative. If the well turns out positive, they have to continue testing the remaining saliva for all the participants (also in this binary testing fashion, that is, 50% in a separate well and 50% in another well, and the process continues until all positives are found). From 1 saliva sample, they can dilute it to a fixed maximum number of samples (3-5). Given that the positivity cases rate is 0.97-1.29%, at most 50 samples will be batched together in the first step.

We will develop the Web interface for this testing.

//Web Page Panels

Login page:
The application will support several panels. Some are for lab technicians to record collections being tested and record results of those tests. Some are for the Employee to check their results.
The lab workder clicks ‘Lab Login’ which opens the ‘Lab Home’ page which is shown next.

Test Collection Page:
The Test Collection page is to register employees with their employee id and the current test barcode they are assigned (in a real world implementation, this would be read by a barcode scanner). Here we will just enter numbers. If an error is made, you can select the checkbox(s) and click ‘Delete’ to remove the entry.

Pool Mapping Page:
Pool mapping is performed to create a group of samples to test. The test barcode is used to identify the specimen. You can add as many tests as needed to a pool and then submit the pool for testing. The panel at the bottom shows the current pools with the list of associated test barcodes.

Well Testing Page:
The Well testing page, the lab tech selects a well to set results. The default value is ‘in progress’. A test is selected, and ‘Edit’ is clicked. This moves the data to the panel at the top of the page. They then use the drop down to change ‘in progress’ to the actual test result.

Employee Login Page:
Finally, there is a login page for employees. When the employee logs in, they can access the results for each week’s tests. That panel is shown below the login page.

Project Objectives
Build a complete web application which supports the use of a mysql database to track test collections and results.

The application will allow entering data for test pools and wells in addition to posting test results. It will also allow employees and students being tested to log in and check the results of tests on their samples.

The application will implement the functionality using Node-JS/Express and MySQL. 
