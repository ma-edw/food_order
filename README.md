# FullStack food ordering app

This food ordering app involves FastAPI for backend and React for frontend.
</br>

### Copy the code to local directory
Run the following command in your local folder after logging in with your Github account:
```
git clone https://github.com/madzai/food_order_app.git
```

## Backend
### Install required Python packages for backend
Backend is run with FastAPI.
<br />
Create and activate a virtual environment. Then run the following code in the FastAPI folder:
```
cd FastAPI/
pip install -r requirements.txt
```

### Run the code
Run the backend with the following command:
```
uvicorn main:app --reload
```
The backend will be available at http://127.0.0.1:8000/docs


## Frontend
### Install required packages with npm for frontend
Frontend is run with React.
<br />
Go to the frontend folder to install the required packages:
```
cd React/food_order/
npm install
```

### Run the code
Run the frontend with the following command:
```
npm start
```
The backend will be available at http://localhost:3000/