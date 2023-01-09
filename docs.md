# API DOCUMENTATION.
Live URL: 

## AUTH
----
Account creation and login.

**SIGN UP**

* **URL**

  /auth/signup
  ----
  returns a json reponse of the created user

* **Method:**

  `POST`

* **Request body**

  `email=[string]`
  `password=[string]`
  `role=[string]` 

  Supported values for `role`: ['admin', 'regular']


* **Success Response:**

  * **Code:** 201 <br />
    **Content:** 
      ```{
          "message": "User created successfully",
          "data": {
            "email": "teniolafatunmbi@gmail.com",
            "password": "teni123",
            "role": "admin",
            "id": 2,
            },
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRlbmlvbGEiLCJfaWQiOiI2MjcyZDUzODZmNTk1MDhhOWIzMDlhMTQiLCJpYXQiOjE2NTE2OTI4NTYsImV4cCI6MTY1MTcwMzY1Nn0.a_1RuJgm9lHofQlEo_uyRP7mlcfsZP0B_NMGUNhmX1c"
          }
        }
      ```
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** 
      ```
        {
        "statusCode": 400,
        "message": "This user already exists. Log in instead.",
        "error": "Bad Request"
        }
      ```
  * **Code:** 422 UNPROCESSABLE ENTITY <br />
    **Content:** 
    ```{
            "statusCode": 422,
            "message": [
              "email must be an email",
              "password must be a string",
              "role must be one of the following values: regular, admin"
            ],
            "error": "Unprocessable entity"
        }
    ```

**LOG IN**

* **URL**

  /auth/login
  ----
  returns json response a login operation.
* **Method:**

  `POST`

* **Request body**

  `email=[string]`
  `password=[string]`


* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```
      {
        "message": "Login successful",
        "data": {
            "email": "teniolafatunmbi@gmail.com",
            "password": "teni123",
            "role": "admin",
            "id": 2,
            }
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRlbmlvbGEiLCJzdWIiOiI2MjcyZDUzODZmNTk1MDhhOWIzMDlhMTQiLCJpYXQiOjE2NTE2OTMyODcsImV4cCI6MTY1MTcwNDA4N30.Xurd8LqNd_vU1pWgFKbNeHAtEQvI8tIY5161GYYfbYA"
        }
      }
      ```
 
* **Error Responses:**

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** 
      ```
          {
          "statusCode": 401,
          "message": "Unauthorized"
          }
      ```


## BRANDS AND ADDONS
----
Endpoints for brands related operations

**CREATE BRAND**

* **URL**

  /brands
  ----
  Creates a brand

* **Method:**

  `POST`

* **Request body**

  `name=[string]`

* **Success Response:**

  * **Code:** 201 <br />
    **Content:** 
      ```[
            {
              "id": 4,
              "name": "Chicken Republick",
            }
          ]
      ```
 
* **Error Responses:**
  * **Code:** 400 BAD REQUEST <br />
    **Content:** 
      ```
        {
        "statusCode": 400,
        "message": "Brand already exists.",
        "error": "Bad Request"
        }
      ```
    
  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** 
    ```
        {
        "statusCode": 401,
        "message": "Unauthorized"
        }
    ```

  * **Code:** 422 UNPROCESSABLE ENTITY <br />
    **Content:** 
    ```{
            "statusCode": 422,
            "message": ["name must be a string"],
            "error": "Unprocessable Entity"
        }
    ```

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** 
      ```
        {
        "statusCode": 500,
        "error": "Internal server error"
        }
      ```


**CREATE MEAL ADDON FOR BRAND**

* **URL**

  /brands/:brandId/addons
  ----
  Creates a meal addon for a brand.

* **Method:**

  `POST`

* **Request Param**
   `brandId`

* **Request body**

  `name=[string]`
  `description=[string]` optional
  `price=[number]`
  `category=[string]` optional


* **Success Response:**

  * **Code:** 201 <br />
    **Content:** 
    ```{
        "message": 'Addon created successfully',
        "data": {
            "id": 3,
            "name": "Addon 1",
            "price": 20000,
            "description": "Addon #1",
            "categoryId": "1",
            "categoryName": "dessert"
        }
      }
    ```
 
* **Error Response:**

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** ```
              {
              "statusCode": 401,
              "message": "Unauthorized"
            }
            ```

  * **Code:** 400 BAD REQUEST <br />
    **Content:** 
    ```{
            "statusCode": 400,
            "message": "Brand does not exist",
            "error": "Bad Request"
          }
    ```

  * **Code:** 409 CONFLICT <br />
    **Content:** 
    ```{
            "statusCode": 409,
            "message": "Meal Addon already exists for this brand.",
            "error": "Conflict"
          }
    ```

  * **Code:** 422 UNPROCESSABLE ENTITY <br />
    **Content:** 
    ```{
            "statusCode": 422,
            "message": [
              "name must be a string",
              "description must be a string",
              "price must be a number conforming to the specified constraints"
            ],
            "error": "Unprocessble Entity"
        }
    ```


**FETCH ALL MEAL ADDONs FOR BRAND**

* **URL**

  /brands/:brandId/addons
  ----
  Retrieves all the meal addons for a brand.

* **Method:**

  `GET`

* **Request Param**
   `brandId=[integer]`

* **Request Query**
   `size=[integer]`
   `page=[integer]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```{
        data: {
            items: [
                {
                    "id": 4,
                    "name": "Big boys Pro",
                    "description": null,
                    "price": 20000,
                    "brand_id": "1",
                    "category_id": "1"
                }
            ],
            previous_page: "http://localhost:3000/api/brands/1/addons?page=1",
            next_page: "http://localhost:3000/api/brands/1/addons?page=3",
            total: "9",
        },
      }
    ```
 
* **Error Response:**
  * **Code:** 400 BAD REQUEST <br />
    **Content:** 
    ```{
            "statusCode": 400,
            "message": "Brand does not exist",
            "error": "Bad Request"
          }
    ```

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** 
    ```
        {
            "statusCode": 401,
            "message": "Unauthorized"
        }
    ```


**FIND MEAL ADDON**

* **URL**

  /brands/:brandId/addons/:addonId
  ----
  Retrieve a meal addon in a brand.

* **Method:**

  `GET`

* **Request Param**
   `brandId=[integer]`
   `addonId=[integer]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```{
        "data": {
            "id": 3,
            "name": "Addon 1",
            "price": 20000,
            "description": "Addon #1",
            "categoryId": "1",
            "categoryName": "dessert"
        }
      }
    ```
 
* **Error Response:**
  * **Code:** 400 BAD REQUEST <br />
    **Content:** 
    ```{
            "statusCode": 400,
            "message": "Brand does not exist"
            "error": "Bad Request"
          }
    ```

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** ```
              {
              "statusCode": 401,
              "message": "Unauthorized"
            }
            ```

  * **Code:** 404 NOT FOUND <br />
    **Content:** 
    ```{
            "statusCode": 404,
            "message": "Meal addon does not exist for this brand"
            "error": "Not Found"
          }
    ```

**UPDATE MEAL ADDON**

* **URL**

  /brands/:brandId/addons/:addonId
  ----
  Update a meal addon in a brand.

* **Method:**

  `PATCH`

* **Request Param**
   `brandId=[integer]`
   `addonId=[integer]`

* **Request body**

  `name=[string]` optional
  `description=[string]` optional
  `price=[number]` optional
  `category=[string]` optional



* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```{
        "message": 'Addon updated successfully',
        "data": {
            "id": 3,
            "name": "Addon 1",
            "price": 20000,
            "description": "Addon #1",
            "categoryId": "1",
            "categoryName": "dessert"
        }
      }
    ```
 
* **Error Response:**
  * **Code:** 400 BAD REQUEST <br />
    **Content:** 
    ```{
            "statusCode": 400,
            "message": "Brand does not exist"
            "error": "Bad Request"
        } 
    ```

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** ```
              {
              "statusCode": 401,
              "message": "Unauthorized"
            }
            ```

  * **Code:** 404 NOT FOUND <br />
    **Content:** 
    ```{
            "statusCode": 404,
            "message": "Meal addon does not exist for this brand"
            "error": "Not Found"
          }
    ```

  * **Code:** 422 UNPROCESSABLE ENTITY <br />
    **Content:** 
    ```{
            "statusCode": 422,
            "message": [
              "name must be a string",
              "description must be a string",
              "price must be a number conforming to the specified constraints",
              "category must be a string"
            ],
            "error": "Unprocessable Entity"
        }
    ```


**REMOVE MEAL ADDON**

* **URL**

  /brands/:brandId/addons/:addonId
  ----
  Update a meal addon in a brand.

* **Method:**

  `DELETE`

* **Request Param**
   `brandId=[integer]`
   `addonId=[integer]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```{
        "message": "Addon with name Chicken Republic deleted successfully"
      }
    ```
 
* **Error Response:**
  * **Code:** 400 BAD REQUEST <br />
    **Content:** 
    ```{
            "statusCode": 400,
            "message": "Brand does not exist"
            "error": "Bad Request"
          }
    ```

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** ```
              {
              "statusCode": 401,
              "message": "Unauthorized"
            }
            ```

  * **Code:** 404 NOT FOUND <br />
    **Content:** 
    ```{
            "statusCode": 404,
            "message": "Meal addon does not exist for this brand"
            "error": "Not Found"
          }
    ```

**CREATE MEAL CATEGORY FOR BRAND ADDONS**

* **URL**

  /brands/:brandId/addon-categories
  ----
  Creates a addon category for a brand.

* **Method:**

  `POST`

* **Request Param**
   `brandId`

* **Request body**
  `name=[string]`


* **Success Response:**

  * **Code:** 201 <br />
    **Content:** 
    ```{
        data: { 
                "id": 4,
                "name": "Whiskey",
                "brand_id": "1",
                "brand_name": "Chicken Republic"
            }
        }
    ```
 
* **Error Response:**
  * **Code:** 400 BAD REQUEST <br />
    **Content:** 
    ```{
            "statusCode": 400,
            "message": "Brand does not exist"
            "error": "Bad Request"
          }
    ```

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** ```
              {
              "statusCode": 401,
              "message": "Unauthorized"
            }
            ```

  * **Code:** 409 CONFLICT <br />
    **Content:** 
    ```{
            "statusCode": 409,
            "message": "Meal Category already exists for this brand.",
            "error": "Conflict"
          }
    ```

  * **Code:** 422 UNPROCESSABLE ENTITY <br />
    **Content:** 
    ```{
            "statusCode": 400,
            "message": ["name must be a string"],
            "error": "Unprocessable Entity"
          }
    ```