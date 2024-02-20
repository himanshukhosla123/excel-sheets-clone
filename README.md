**Functional Requirement:-**
  1. Should be able to upload and handle excel sheet of any size.
  2. Maximum 5 Excel Sheets can be opened at a time.
  3. All records 1st column should be visible to user upfront.
  4. On clicking upon a particular row, all of its columns should be shown on next screen.
  5. With search functionality to search through all data records of an excel sheet.

**Non Functional Requirement:-**
  1. Performance in terms of scrolling through list and data.
  2. Search functionality should be search on all data of an excel.

**Demo Link** - https://nuxtjs-ead4fffddc3d.herokuapp.com/

**Choose Tech Stack:-**
Frontend - 
- Framework Nuxtjs 
- Virtual List to enhance rendering of long lists (Can we replaced with canvas for futher optimisation)

Backend - 
- Expressjs (Nodejs) 
- Mongo Db Atlas as a service 
- Multer for file upload 
- csvtojson to convert excel to json for storing it.

Note:-Reason for making it a full stack is scalability in terms of handling excel sheets of any size and search through it easily. Could have used webworkers to parse heavy csv on frontend browser but it was not an ideal solution.


